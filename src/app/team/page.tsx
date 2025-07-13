import { Metadata } from 'next';
import { Section, Container, Card, CardContent } from '@/components/ui';
import { PageHeader } from '@/components/ui/page-header';
import { getTeamMembers, getFeaturedTeamMembers } from '@/lib/notion';
import { Linkedin, Mail, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Team | ContainerCode Advisory',
  description: 'Meet the expert team behind ContainerCode Advisory. Technology consultants specializing in multi-cloud, cybersecurity, and digital transformation.',
};

// Fallback team data in case Notion is empty
const fallbackTeamMembers = [
  {
    id: 1,
    name: 'Ayodele Ajayi',
    position: 'Founder & Principal Consultant',
    department: 'Leadership',
    bio: 'Multi-cloud architect with 15+ years of experience in enterprise technology solutions. Specialized in Azure, AWS, and Google Cloud implementations.',
    photo: '',
    expertise: ['Multi-Cloud Architecture', 'DevOps', 'Cybersecurity', 'Digital Transformation'],
    certifications: ['Azure Solutions Architect', 'AWS Solutions Architect', 'Google Cloud Professional'],
    linkedIn: 'https://linkedin.com/in/ayodele-ajayi',
    email: 'ayodele@containercode.club',
    featured: true
  },
  {
    id: 2,
    name: 'Sarah Chen',
    position: 'Senior DevOps Engineer',
    department: 'Engineering',
    bio: 'DevSecOps specialist with expertise in CI/CD pipelines, infrastructure as code, and containerization across multiple cloud platforms.',
    photo: '',
    expertise: ['DevSecOps', 'Kubernetes', 'Terraform', 'CI/CD'],
    certifications: ['CKA', 'Terraform Associate', 'Docker Certified'],
    linkedIn: 'https://linkedin.com/in/sarah-chen',
    email: 'sarah@containercode.club',
    featured: false
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    position: 'Cybersecurity Consultant',
    department: 'Security',
    bio: 'Certified security professional specializing in cloud security assessments, compliance frameworks, and threat protection strategies.',
    photo: '',
    expertise: ['Cloud Security', 'Compliance', 'Penetration Testing', 'Risk Assessment'],
    certifications: ['CISSP', 'CISA', 'Cloud Security Alliance'],
    linkedIn: 'https://linkedin.com/in/michael-rodriguez',
    email: 'michael@containercode.club',
    featured: false
  },
  {
    id: 4,
    name: 'Emily Zhang',
    position: 'Software Engineering Lead',
    department: 'Engineering',
    bio: 'Full-stack developer with expertise in modern web technologies, API development, and cloud-native application architecture.',
    photo: '',
    expertise: ['Full-Stack Development', 'API Design', 'Cloud-Native Apps', 'Microservices'],
    certifications: ['AWS Developer', 'React Certified', 'Node.js Professional'],
    linkedIn: 'https://linkedin.com/in/emily-zhang',
    email: 'emily@containercode.club',
    featured: false
  }
];

function TeamMemberCard({ member, featured = false }: { member: any; featured?: boolean }) {
  const initials = member.name.split(' ').map((n: string) => n[0]).join('');
  
  return (
    <Card 
      variant="elevated" 
      hoverable 
      className={cn(
        "overflow-hidden h-full",
        featured && "ring-2 ring-primary-500 ring-opacity-50"
      )}
    >
      <div className={cn(
        "aspect-square bg-gradient-to-br flex items-center justify-center",
        featured 
          ? "from-primary-500 to-teal-500" 
          : "from-gray-500 to-gray-700"
      )}>
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover"
            width={300}
            height={300}
          />
        ) : (
          <div className={cn(
            "font-bold text-white",
            featured ? "text-6xl" : "text-4xl"
          )}>
            {initials}
          </div>
        )}
      </div>
      <CardContent className={cn("p-6", featured && "p-8")}>
        <div className="flex flex-col h-full">
          <div>
            <h3 className={cn(
              "font-bold mb-2",
              featured ? "text-2xl" : "text-xl"
            )}>
              {member.name}
            </h3>
            <p className="text-primary-600 mb-3">{member.position}</p>
            <p className="text-gray-600 text-sm mb-4">
              {Array.isArray(member.bio) 
                ? member.bio.map((block: any) => block.plain_text).join(' ')
                : member.bio}
            </p>
          </div>
          
          <div className="mt-auto">
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Expertise:</h4>
              <div className="flex flex-wrap gap-1">
                {member.expertise?.slice(0, featured ? 4 : 3).map((skill: string) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {member.expertise?.length > (featured ? 4 : 3) && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{member.expertise.length - (featured ? 4 : 3)} more
                  </span>
                )}
              </div>
            </div>
            
            {member.certifications && member.certifications.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Certifications:</h4>
                <div className="flex flex-wrap gap-1">
                  {member.certifications.slice(0, 2).map((cert: string) => (
                    <span
                      key={cert}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                    >
                      {cert}
                    </span>
                  ))}
                  {member.certifications.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      +{member.certifications.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              {member.linkedIn && (
                <a
                  href={member.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function TeamPage() {
  // Try to fetch from Notion, fallback to static data
  let featuredMembers = [];
  let allMembers = [];
  
  try {
    const { results: notionFeatured } = await getFeaturedTeamMembers();
    const { results: notionAll } = await getTeamMembers();
    
    if (notionFeatured.length > 0 || notionAll.length > 0) {
      featuredMembers = notionFeatured;
      allMembers = notionAll.filter(member => !member.featured);
    } else {
      // Use fallback data
      featuredMembers = fallbackTeamMembers.filter(member => member.featured);
      allMembers = fallbackTeamMembers.filter(member => !member.featured);
    }
  } catch (error) {
    console.log('Using fallback team data');
    featuredMembers = fallbackTeamMembers.filter(member => member.featured);
    allMembers = fallbackTeamMembers.filter(member => !member.featured);
  }

  return (
    <main>
      <PageHeader
        title="Meet Our Team"
        description="Expert technology consultants dedicated to transforming your business with cutting-edge cloud solutions, cybersecurity, and digital innovation."
      />

      <Section spacing="xl">
        <Container>
          {/* Leadership Section */}
          {featuredMembers.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Leadership</h2>
              <div className="max-w-4xl mx-auto">
                <div className="md:flex gap-8">
                  {featuredMembers.map((member) => (
                    <div key={member.id} className="md:w-full">
                      <TeamMemberCard member={member} featured={true} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team Members Grid */}
          {allMembers.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-center mb-12">Our Expert Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allMembers.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Culture & Values Section */}
      <Section spacing="lg" background="slate">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Culture & Values</h2>
            <p className="text-xl text-gray-600 mb-12">
              We believe in building lasting partnerships with our clients through expertise, 
              transparency, and innovative solutions that drive real business value.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">E</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We deliver exceptional results through continuous learning and best practices.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">I</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We embrace cutting-edge technologies to solve complex business challenges.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">P</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Partnership</h3>
                <p className="text-gray-600">
                  We work as an extension of your team to achieve shared success.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Join Our Team CTA */}
      <Section spacing="lg" background="navy">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              We&apos;re always looking for talented professionals who share our passion for technology excellence.
            </p>
            <a
              href="/contact"
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              View Career Opportunities
            </a>
          </div>
        </Container>
      </Section>
    </main>
  );
}
