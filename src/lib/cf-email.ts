import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Cloudflare `send_email` binding — native email sending.
 *
 * The site delivers its internal notifications (contact enquiries, newsletter
 * signups) through this binding rather than a third-party API, so the "you got
 * a new enquiry" path needs no external key.
 *
 * We use Cloudflare's structured builder — `env.EMAIL.send({ to, from, ... })`
 * — deliberately, instead of the legacy `EmailMessage` from the `cloudflare:email`
 * virtual module. That module cannot be bundled through OpenNext's build
 * pipeline (Turbopack + esbuild can't resolve the Workers-only specifier), and
 * the structured builder is Cloudflare's current recommended API anyway.
 *
 * Hard constraint from Cloudflare Email Routing: the binding can ONLY deliver to
 * *verified destination addresses*. That is perfect for an admin inbox but
 * means it cannot email an arbitrary form submitter — user-facing confirmation /
 * welcome mail is therefore sent separately (best-effort, via Resend) and is
 * never required for a submission to succeed.
 *
 * Cloudflare dashboard setup required for delivery:
 *   1. Enable Email Routing on the `containercode.club` zone (verifies the
 *      sending domain — `RESEND_EMAIL_FROM`'s address).
 *   2. Add + verify `ADMIN_EMAIL` as a destination address.
 *   3. Bind `send_email` as `EMAIL` (see wrangler.jsonc).
 */

interface EmailAddress {
  email: string;
  name?: string;
}

/** Cloudflare's structured email builder (a plain object passed to send()). */
interface EmailMessageBuilder {
  to: string | EmailAddress | (string | EmailAddress)[];
  from: string | EmailAddress;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | EmailAddress;
  headers?: Record<string, string>;
}

interface EmailSendResult {
  messageId: string;
}

interface EmailSendBinding {
  send(message: EmailMessageBuilder): Promise<EmailSendResult>;
}

export interface AdminEmail {
  subject: string;
  html: string;
  /** Address that a reply to the notification should go to (e.g. the enquirer). */
  replyTo?: string;
}

const FROM_NAME = 'ContainerCode Advisory';

/**
 * Bare sending address. The binding's `from` must be on a domain with Email
 * Routing enabled on the Cloudflare account, so strip any `Display Name <addr>`
 * wrapper off `RESEND_EMAIL_FROM` and reuse just the address.
 */
function fromAddress(): string {
  const raw = (process.env.RESEND_EMAIL_FROM || 'hello@containercode.club').trim();
  const match = raw.match(/<([^>]+)>/);
  return (match ? match[1] : raw).trim();
}

/** Verified Email Routing destination that receives site notifications. */
function adminAddress(): string {
  return (process.env.ADMIN_EMAIL || 'admin@containercode.club').trim();
}

/**
 * Resolve the `EMAIL` binding from the current request context, or null when it
 * is unavailable (e.g. a plain `next dev` without the Workers runtime). Never
 * throws — `getCloudflareContext` throws outside the worker request scope.
 */
function getEmailBinding(): EmailSendBinding | null {
  try {
    const { env } = getCloudflareContext();
    const binding = (env as Record<string, unknown>).EMAIL as EmailSendBinding | undefined;
    return binding && typeof binding.send === 'function' ? binding : null;
  } catch {
    return null;
  }
}

export type AdminNotifyResult =
  | { delivered: true; via: 'binding'; messageId: string }
  | { delivered: false; via: 'none'; reason: string };

/**
 * Deliver an internal notification to the site admin via the Cloudflare
 * `send_email` binding. Throws if the binding is present but the send is
 * rejected (so a real misconfiguration — unverified domain / destination —
 * surfaces as an error); returns a non-delivered result instead of throwing
 * when no binding exists, so local development does not 500.
 */
export async function notifyAdmin(email: AdminEmail): Promise<AdminNotifyResult> {
  const binding = getEmailBinding();
  if (!binding) {
    return { delivered: false, via: 'none', reason: 'EMAIL binding unavailable' };
  }

  const result = await binding.send({
    from: { email: fromAddress(), name: FROM_NAME },
    to: adminAddress(),
    subject: email.subject,
    html: email.html,
    ...(email.replyTo ? { replyTo: email.replyTo } : {}),
  });

  return { delivered: true, via: 'binding', messageId: result.messageId };
}
