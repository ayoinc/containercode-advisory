import { Metadata } from 'next';
import { FAQContent } from './faq-content';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | ContainerCode Advisory',
  description: 'Get answers to common questions about our cloud consulting, cybersecurity, and digital transformation services.',
};

export default function FAQPage() {
  return <FAQContent />;
}
