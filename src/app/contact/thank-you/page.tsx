import { Metadata } from 'next';
import { Section, Container, Card, CardContent } from '@/components/ui';
import { CheckCircle, Clock, Mail, Phone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thank You | ContainerCode Advisory',
  description: 'Thank you for contacting ContainerCode Advisory. We will respond to your inquiry within 24 hours.',
};

export default function ThankYouPage() {
  return (
    <main>
      <Section spacing="xl">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-aqua-500/10 border border-aqua-500/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-12 w-12 text-aqua-400" />
            </div>

            {/* Main Message */}
            <h1 className="text-4xl font-bold text-navy-100 mb-4">
              Thank You for Reaching Out!
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Your message has been received and we appreciate your interest in ContainerCode Advisory.
            </p>

            {/* What Happens Next */}
            <Card variant="default" className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">What Happens Next?</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-aqua-500/10 rounded-lg">
                      <Mail className="h-5 w-5 text-aqua-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-2">We&apos;ll Review Your Request</h3>
                      <p className="text-navy-300">
                        Our team will carefully review your message and requirements to prepare a tailored response.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-aqua-500/10 rounded-lg">
                      <Clock className="h-5 w-5 text-aqua-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-2">Response Within 24 Hours</h3>
                      <p className="text-navy-300">
                        You can expect a personalized response from our team within 24 hours during business days.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-aqua-500/10 rounded-lg">
                      <Phone className="h-5 w-5 text-aqua-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-2">Free Consultation Call</h3>
                      <p className="text-navy-300">
                        We&apos;ll schedule a free consultation to discuss your project in detail and explore solutions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card variant="default" className="border border-error-500/40 bg-error-700/30 mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-error-400 mb-2">
                  Need Immediate Assistance?
                </h3>
                <p className="text-error-400 text-sm mb-4">
                  For urgent issues or time-sensitive projects, call our emergency line.
                </p>
                <a
                  href="tel:+15551234567"
                  className="inline-flex items-center gap-2 bg-error-500 text-white px-4 py-2 rounded-lg hover:bg-error-700 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +1 (555) 123-4567
                </a>
              </CardContent>
            </Card>

            {/* Explore More */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link 
                href="/blog"
                className="p-6 border border-navy-700 rounded-lg hover:border-aqua-500/50 transition-colors group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-aqua-400">
                  Case Studies
                </h3>
                <p className="text-navy-300 text-sm mb-3">
                  See how we&apos;ve helped other businesses transform.
                </p>
                <div className="flex items-center gap-2 text-aqua-400 font-medium">
                  View Stories <ArrowRight className="h-4 w-4" />
                </div>
              </Link>

              <Link 
                href="/services"
                className="p-6 border border-navy-700 rounded-lg hover:border-aqua-500/50 transition-colors group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-aqua-400">
                  Our Services
                </h3>
                <p className="text-navy-300 text-sm mb-3">
                  Explore our comprehensive technology solutions.
                </p>
                <div className="flex items-center gap-2 text-aqua-400 font-medium">
                  Learn More <ArrowRight className="h-4 w-4" />
                </div>
              </Link>

              <Link 
                href="/resources"
                className="p-6 border border-navy-700 rounded-lg hover:border-aqua-500/50 transition-colors group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-aqua-400">
                  Free Resources
                </h3>
                <p className="text-navy-300 text-sm mb-3">
                  Access whitepapers, tools, and guides.
                </p>
                <div className="flex items-center gap-2 text-aqua-400 font-medium">
                  Get Resources <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
