import { Section, Container, Card, CardContent } from '@/components/ui';

export default function TermsPage() {
  return (
    <main>
      <Section spacing="xl" background="white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
                <p className="mb-4">
                  By accessing and using this website, you accept and agree to be bound by the terms 
                  and provision of this agreement.
                </p>

                <h2 className="text-2xl font-semibold mb-4 mt-8">Use License</h2>
                <p className="mb-4">
                  Permission is granted to temporarily download one copy of the materials on 
                  ContainerCode Advisory's website for personal, non-commercial transitory viewing only.
                </p>

                <h2 className="text-2xl font-semibold mb-4 mt-8">Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at{' '}
                  <a href="mailto:legal@containercode.club" className="text-primary-600 hover:underline">
                    legal@containercode.club
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
