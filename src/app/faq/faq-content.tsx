'use client';

import { Section, Container, Card, CardContent } from '@/components/ui';
import { PageHeader } from '@/components/ui/page-header';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const faqData = [
  {
    category: 'General Services',
    questions: [
      {
        id: 1,
        question: 'What cloud platforms do you specialize in?',
        answer: 'We specialize in all major cloud platforms including AWS, Microsoft Azure, Google Cloud Platform (GCP), Oracle Cloud, and IBM Cloud. Our team has deep expertise across these platforms and can help you choose the right solution for your business needs.'
      },
      {
        id: 2,
        question: 'How do you approach digital transformation projects?',
        answer: 'Our digital transformation approach is comprehensive and tailored to each client. We start with a thorough assessment of your current infrastructure, business goals, and challenges. Then we develop a strategic roadmap that includes technology modernization, process optimization, and team training to ensure successful transformation.'
      },
      {
        id: 3,
        question: 'Do you provide ongoing support after project completion?',
        answer: 'Yes, we offer various support packages including managed services, monitoring, maintenance, and continuous optimization. We believe in building long-term partnerships with our clients to ensure ongoing success.'
      }
    ]
  },
  {
    category: 'Cloud Migration',
    questions: [
      {
        id: 4,
        question: 'How long does a typical cloud migration take?',
        answer: 'Cloud migration timelines vary depending on the complexity of your infrastructure, applications, and data. Simple migrations can take 2-4 weeks, while complex enterprise migrations may take 3-6 months. We provide detailed project timelines during our initial assessment.'
      },
      {
        id: 5,
        question: 'What is your approach to minimizing downtime during migration?',
        answer: 'We use proven migration strategies including blue-green deployments, rolling migrations, and hybrid cloud setups to minimize or eliminate downtime. Our team plans migration windows during off-peak hours and has rollback procedures in place for any issues.'
      },
      {
        id: 6,
        question: 'How do you ensure data security during migration?',
        answer: 'Data security is our top priority. We use encrypted data transfer, secure VPN connections, and follow industry best practices for data handling. All migrations are performed by certified professionals following strict security protocols and compliance requirements.'
      }
    ]
  },
  {
    category: 'Cybersecurity',
    questions: [
      {
        id: 7,
        question: 'What cybersecurity frameworks do you follow?',
        answer: 'We follow industry-standard frameworks including NIST Cybersecurity Framework, ISO 27001, SOC 2, and cloud-specific security guidelines. Our approach is tailored to your industry requirements and compliance needs.'
      },
      {
        id: 8,
        question: 'Do you provide security assessments and audits?',
        answer: 'Yes, we offer comprehensive security assessments including vulnerability assessments, penetration testing, compliance audits, and security architecture reviews. These help identify risks and provide actionable recommendations for improvement.'
      },
      {
        id: 9,
        question: 'How do you handle incident response?',
        answer: 'We provide 24/7 incident response services with defined escalation procedures, forensic analysis, containment strategies, and recovery planning. Our team helps you respond quickly to security incidents and implements measures to prevent future occurrences.'
      }
    ]
  },
  {
    category: 'DevOps & Development',
    questions: [
      {
        id: 10,
        question: 'What DevOps tools and technologies do you use?',
        answer: 'We work with a wide range of DevOps tools including Docker, Kubernetes, Jenkins, GitLab CI/CD, Terraform, Ansible, and cloud-native services. Our tool selection is based on your specific needs and existing infrastructure.'
      },
      {
        id: 11,
        question: 'How do you implement CI/CD pipelines?',
        answer: 'We design CI/CD pipelines tailored to your development workflow, including automated testing, security scanning, and deployment strategies. Our pipelines include proper branching strategies, quality gates, and rollback mechanisms.'
      },
      {
        id: 12,
        question: 'Do you provide training for our development teams?',
        answer: 'Yes, we offer comprehensive training programs for your teams including cloud technologies, DevOps practices, security best practices, and new tools. Training can be conducted on-site, remotely, or through workshops.'
      }
    ]
  },
  {
    category: 'Pricing & Engagement',
    questions: [
      {
        id: 13,
        question: 'How do you structure your pricing?',
        answer: 'We offer flexible pricing models including project-based fixed pricing, hourly consulting rates, and retainer agreements for ongoing services. Pricing depends on project scope, complexity, and duration. We provide detailed estimates after initial consultation.'
      },
      {
        id: 14,
        question: 'Do you offer free consultations?',
        answer: 'Yes, we offer free initial consultations to understand your needs and discuss how we can help. This typically includes a 30-60 minute discovery call and may include a preliminary assessment of your current infrastructure.'
      },
      {
        id: 15,
        question: 'What is your typical engagement process?',
        answer: 'Our engagement process starts with discovery and assessment, followed by strategy development, detailed planning, implementation, testing, and ongoing support. We maintain regular communication throughout the project with status updates and milestone reviews.'
      }
    ]
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card variant="default" className="mb-4">
      <CardContent className="p-0">
        <button
          className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3 className="text-lg font-semibold pr-4">{question}</h3>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
          )}
        </button>
        {isOpen && (
          <div className="px-6 pb-6">
            <p className="text-gray-600 leading-relaxed">{answer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function FAQContent() {
  return (
    <main>
      <PageHeader
        title="Frequently Asked Questions"
        description="Get answers to common questions about our cloud consulting, cybersecurity, and digital transformation services."
      />

      <Section spacing="xl">
        <Container>
          <div className="max-w-4xl mx-auto">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq) => (
                    <FAQItem
                      key={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact CTA */}
      <Section spacing="lg" background="slate">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Our team is here to help. Get in touch for personalized answers to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Contact Us
              </a>
              <a
                href="mailto:hello@containercode.club"
                className="bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Email Directly
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
