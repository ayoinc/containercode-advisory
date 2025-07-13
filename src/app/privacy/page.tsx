import { Section, Container, Card, CardContent } from '@/components/ui';

export default function PrivacyPage() {
  return (
    <main>
      <Section spacing="xl" background="white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  contact us for support, or subscribe to our newsletter.
                </p>

                <h2 className="text-2xl font-semibold mb-4 mt-8">How We Use Your Information</h2>
                <p className="mb-4">
                  We use the information we collect to provide, maintain, and improve our services, 
                  communicate with you, and ensure the security of our platform.
                </p>

                <h2 className="text-2xl font-semibold mb-4 mt-8">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@containercode.club" className="text-primary-600 hover:underline">
                    privacy@containercode.club
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </main>
  );
}
