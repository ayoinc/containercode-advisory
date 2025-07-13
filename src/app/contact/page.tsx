import { Metadata } from 'next';
import ProfessionalContactPage from './modern-contact';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Contact Us | ContainerCode Advisory',
  description: 'Get in touch with ContainerCode Advisory for expert cloud consulting, cybersecurity, and digital transformation services. Free consultation available.',
  keywords: ['contact containercode', 'cloud consulting contact', 'cybersecurity consultation', 'digital transformation enquiry'],
};

export default function ContactPage() {
  return (
    <>
      <ProfessionalContactPage />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
          success: {
            duration: 3000,
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
        }}
      />
    </>
  );
}
