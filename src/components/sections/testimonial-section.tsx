'use client';

import { cn } from '@/lib/utils';

export interface TestimonialSectionProps {
  className?: string;
}

export function TestimonialSection({ className }: TestimonialSectionProps) {
  const testimonials = [
    {
      quote: "ContainerCode Advisory transformed our cloud infrastructure. Their expertise in multi-cloud architecture helped us reduce costs by 40% while improving performance and security.",
      author: "Sarah Johnson",
      position: "CTO",
      company: "TechFlow Solutions",
    },
    {
      quote: "The team's approach to DevOps and cybersecurity integration is unmatched. They didn't just implement solutions—they educated our team for long-term success.",
      author: "Michael Chen",
      position: "VP of Engineering",
      company: "DataCore Systems",
    },
    {
      quote: "Working with ContainerCode was a game-changer for our digital transformation. Their strategic guidance and technical execution exceeded all expectations.",
      author: "Emily Rodriguez",
      position: "Chief Innovation Officer",
      company: "Global Dynamics",
    },
  ];

  return (
    <section className={cn("py-24 bg-gray-50", className)}>
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-700">
            Don't just take our word for it. Hear from organizations we've helped transform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-card p-8 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-navy-100">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.691 6.292C5.094 4.771 7.217 4 10.066 4h.31l.004 1.241c0 .8-.26 1.456-.775 1.968-.523.523-1.164.784-1.921.784h-.56c-1.429 0-2.29.84-2.577 2.523.31-.203.64-.299.995-.299 2.013 0 3.02 1.52 3.02 4.557 0 1.462-.355 2.613-1.063 3.454-.709.84-1.689 1.261-2.94 1.261-1.547 0-2.714-.596-3.497-1.786-.784-1.178-1.172-2.885-1.172-5.107 0-1.32.116-2.523.349-3.611.232-1.077.65-2.045 1.251-2.903zm11.508 0C16.593 4.771 18.716 4 21.565 4h.31l.005 1.241c0 .8-.26 1.456-.775 1.968-.523.523-1.165.784-1.922.784h-.559c-1.43 0-2.29.84-2.578 2.523.31-.203.64-.299.995-.299 2.012 0 3.019 1.52 3.019 4.557 0 1.462-.354 2.613-1.063 3.454-.708.84-1.688 1.261-2.94 1.261-1.546 0-2.713-.596-3.496-1.786-.784-1.178-1.172-2.885-1.172-5.107 0-1.32.116-2.523.348-3.611.232-1.077.65-2.045 1.252-2.903z" />
                </svg>
              </div>
              
              {/* Testimonial content */}
              <div className="mb-8">
                <p className="text-gray-700 italic">
                  "{testimonial.quote}"
                </p>
              </div>
              
              {/* Author info */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4">
                  {/* Avatar placeholder */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-navy-500 to-aqua-500 flex items-center justify-center">
                    <span className="text-lg font-bold text-aqua-400">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.position} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Metrics showcase */}
        <div className="mt-16 p-8 bg-navy-800 rounded-lg text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold">The Impact We Deliver</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-aqua-400 mb-2">95%</div>
              <div className="text-gray-300">Client Retention Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-aqua-400 mb-2">40%</div>
              <div className="text-gray-300">Average Cost Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-aqua-400 mb-2">24/7</div>
              <div className="text-gray-300">Support & Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
