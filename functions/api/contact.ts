interface Env {
  RESEND_API_KEY: string;
  ADMIN_EMAIL: string;
  NOTION_TOKEN: string;
  NOTION_CONTACTS_DATABASE_ID: string;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  services: string[];
  budget?: string;
  timeline?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context;
    
    // Parse form data
    const formData: ContactFormData = await request.json();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Send notification email to admin
    await sendAdminNotification(formData, env);
    
    // Send confirmation email to user
    await sendUserConfirmation(formData, env);
    
    // Store contact in Notion database
    const contactId = await createContactInNotion(formData, env);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Contact form submitted successfully. We will get back to you within 24 hours.' 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function onRequestOptions(context: { request: Request }) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

async function createContactInNotion(contact: ContactFormData, env: Env): Promise<string> {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      parent: { 
        database_id: env.NOTION_CONTACTS_DATABASE_ID 
      },
      properties: {
        'Name': {
          title: [
            {
              text: {
                content: `${contact.firstName} ${contact.lastName}`
              }
            }
          ]
        },
        'First Name': {
          rich_text: [
            {
              text: {
                content: contact.firstName
              }
            }
          ]
        },
        'Last Name': {
          rich_text: [
            {
              text: {
                content: contact.lastName
              }
            }
          ]
        },
        'Email': {
          email: contact.email
        },
        'Company': {
          rich_text: contact.company ? [
            {
              text: {
                content: contact.company
              }
            }
          ] : []
        },
        'Phone': {
          phone_number: contact.phone || null
        },
        'Subject': {
          rich_text: [
            {
              text: {
                content: contact.subject
              }
            }
          ]
        },
        'Message': {
          rich_text: [
            {
              text: {
                content: contact.message
              }
            }
          ]
        },
        'Services': {
          multi_select: contact.services.map(service => ({ name: service }))
        },
        'Budget': {
          select: contact.budget ? { name: contact.budget } : null
        },
        'Timeline': {
          select: contact.timeline ? { name: contact.timeline } : null
        },
        'Status': {
          select: {
            name: 'new'
          }
        },
        'Priority': {
          select: {
            name: 'high'
          }
        },
        'Source': {
          select: {
            name: 'website_contact_form'
          }
        }
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Notion API error: ${response.statusText} - ${errorData}`);
  }

  const data = await response.json();
  return data.id;
}

async function sendAdminNotification(data: ContactFormData, env: Env) {
  const html = generateAdminNotificationHtml(data);
  
  const emailPayload = {
    from: 'ContainerCode Advisory <noreply@containercode.com>',
    to: env.ADMIN_EMAIL,
    reply_to: data.email,
    subject: `🚨 New Contact Form: ${data.subject}`,
    html
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailPayload)
  });

  if (!response.ok) {
    throw new Error(`Failed to send admin notification: ${response.statusText}`);
  }
}

async function sendUserConfirmation(data: ContactFormData, env: Env) {
  const html = generateUserConfirmationHtml(data);
  
  const emailPayload = {
    from: 'ContainerCode Advisory <noreply@containercode.com>',
    to: data.email,
    reply_to: env.ADMIN_EMAIL,
    subject: 'Thank you for contacting ContainerCode Advisory',
    html
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailPayload)
  });

  if (!response.ok) {
    throw new Error(`Failed to send user confirmation: ${response.statusText}`);
  }
}

function generateAdminNotificationHtml(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .field { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6; }
          .field-label { font-weight: 600; color: #1e40af; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; }
          .field-value { font-size: 16px; color: #374151; }
          .services { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
          .service-tag { background: #dbeafe; color: #1d4ed8; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; }
          .urgent { background: #fef2f2; border-left-color: #dc2626; }
          .contact-actions { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">🚨 NEW CONTACT FORM SUBMISSION</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone is interested in ContainerCode services!</p>
          </div>
          
          <div class="content">
            <div class="field urgent">
              <div class="field-label">👤 Contact Information</div>
              <div class="field-value">
                <strong style="font-size: 18px; color: #1e40af;">${data.firstName} ${data.lastName}</strong><br>
                📧 <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a><br>
                ${data.phone ? `📱 <a href="tel:${data.phone}" style="color: #2563eb;">${data.phone}</a><br>` : ''}
                ${data.company ? `🏢 ${data.company}<br>` : ''}
              </div>
            </div>

            <div class="field">
              <div class="field-label">📋 Subject</div>
              <div class="field-value" style="font-size: 18px; font-weight: 600; color: #1e40af;">${data.subject}</div>
            </div>

            <div class="field">
              <div class="field-label">💬 Message</div>
              <div class="field-value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>

            ${data.services?.length > 0 ? `
              <div class="field">
                <div class="field-label">🎯 Interested Services</div>
                <div class="field-value">
                  <div class="services">
                    ${data.services.map(service => `<span class="service-tag">${service}</span>`).join('')}
                  </div>
                </div>
              </div>
            ` : ''}

            ${data.budget ? `
              <div class="field">
                <div class="field-label">💰 Budget Range</div>
                <div class="field-value" style="font-weight: 600; color: #059669;">${data.budget}</div>
              </div>
            ` : ''}

            ${data.timeline ? `
              <div class="field">
                <div class="field-label">⏰ Project Timeline</div>
                <div class="field-value" style="font-weight: 600; color: #7c3aed;">${data.timeline}</div>
              </div>
            ` : ''}

            <div class="contact-actions">
              <h3 style="margin: 0 0 15px 0; color: #1e40af;">Quick Actions:</h3>
              <p style="margin: 0;">
                📧 <a href="mailto:${data.email}?subject=Re: ${data.subject}&body=Hi ${data.firstName},%0D%0A%0D%0AThank you for reaching out to ContainerCode Advisory regarding ${data.subject}.%0D%0A%0D%0A" style="color: #2563eb; text-decoration: none; font-weight: 500;">Reply to ${data.firstName}</a><br>
                📅 <a href="https://calendly.com/containercode" style="color: #2563eb; text-decoration: none; font-weight: 500;">Schedule consultation</a><br>
                📱 <a href="tel:${data.phone || data.email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">Call directly</a>
              </p>
            </div>

            <div style="background: #fefce8; padding: 15px; border-radius: 8px; border-left: 4px solid #eab308; margin-top: 20px;">
              <p style="margin: 0; color: #92400e; font-weight: 500;">
                ⚡ <strong>Action Required:</strong> Please respond within 2 hours for optimal conversion rates.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateUserConfirmationHtml(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6, #8b5cf6); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .highlight-box { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 25px; border-radius: 12px; border-left: 5px solid #3b82f6; margin: 25px 0; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 15px 0; }
          .contact-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; }
          .check-icon { background: #10b981; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="check-icon">✓</div>
            <h1 style="margin: 0; font-size: 28px;">Thank You, ${data.firstName}!</h1>
            <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 16px;">Your message has been received successfully</p>
          </div>
          
          <div class="content">
            <div class="highlight-box">
              <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 20px;">📧 Message Summary</h3>
              <p style="margin: 0; color: #4b5563;"><strong>Subject:</strong> ${data.subject}</p>
              <p style="margin: 8px 0 0 0; color: #4b5563;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <p style="font-size: 16px;">Thank you for contacting ContainerCode Advisory. We've received your inquiry and our team is already reviewing it.</p>

            <h3 style="color: #1e40af; margin: 30px 0 15px 0;">🚀 What happens next?</h3>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li style="margin-bottom: 8px;"><strong>Within 2 hours:</strong> Initial review and prioritization</li>
                <li style="margin-bottom: 8px;"><strong>Within 24 hours:</strong> Senior consultant reaches out</li>
                <li style="margin-bottom: 8px;"><strong>Within 48 hours:</strong> Detailed consultation scheduled</li>
              </ul>
            </div>

            <div class="contact-info">
              <h3 style="margin: 0 0 15px 0; color: #1e40af;">Need immediate assistance? 🔥</h3>
              <p style="margin: 0;">
                📧 <strong>Email:</strong> <a href="mailto:ayoinc@me.com" style="color: #2563eb;">ayoinc@me.com</a><br>
                📱 <strong>Phone:</strong> <a href="tel:+15551234567" style="color: #2563eb;">+1 (555) 123-4567</a><br>
                🌐 <strong>Website:</strong> <a href="https://containercode.com" style="color: #2563eb;">containercode.com</a>
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <h3 style="color: #1e40af; margin-bottom: 15px;">While you wait, explore our insights:</h3>
              <a href="https://containercode.com/blog" class="cta-button">Read Our Blog 📚</a>
              <a href="https://containercode.com/case-studies" class="cta-button">View Case Studies 🎯</a>
            </div>

            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <p style="margin: 0; color: #92400e; font-weight: 500;">
                💡 <strong>Pro Tip:</strong> Add our email to your contacts to ensure our response reaches your inbox!
              </p>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0 0 10px 0; color: #1e40af; font-weight: 600; font-size: 18px;">ContainerCode Advisory</p>
            <p style="margin: 0; color: #64748b; font-size: 14px;">Leading Cloud Consulting & Digital Transformation</p>
          </div>
        </div>
      </body>
    </html>
  `;
}