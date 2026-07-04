import { Quote } from 'lucide-react';

export interface TestimonialSectionProps {
  className?: string;
}

export function TestimonialSection({ className }: TestimonialSectionProps) {
  const testimonials = [
    {
      quote:
        'ContainerCode Advisory transformed our cloud infrastructure. Their expertise in multi-cloud architecture helped us reduce costs by 40% while improving performance and security.',
      author: 'Sarah Johnson',
      position: 'CTO',
      company: 'TechFlow Solutions',
    },
    {
      quote:
        "The team's approach to DevOps and cybersecurity integration is unmatched. They didn't just implement solutions — they educated our team for long-term success.",
      author: 'Michael Chen',
      position: 'VP of Engineering',
      company: 'DataCore Systems',
    },
    {
      quote:
        'Working with ContainerCode was a game-changer for our digital transformation. Their strategic guidance and technical execution exceeded all expectations.',
      author: 'Emily Rodriguez',
      position: 'Chief Innovation Officer',
      company: 'Global Dynamics',
    },
  ];

  const metrics = [
    { value: '95%', label: 'Client Retention Rate' },
    { value: '40%', label: 'Average Cost Reduction' },
    { value: '24/7', label: 'Support & Monitoring' },
  ];

  return (
    <section className={`py-24 bg-navy-900 relative ${className ?? ''}`}>
      <div aria-hidden className="absolute inset-0 bg-tech-grid opacity-40" />
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mb-16">
          <span className="tech-label">[ 04 ] — Client Outcomes</span>
          <h2 className="mt-4 mb-4 text-navy-100">What Our Clients Say</h2>
          <p className="text-lg text-navy-200">
            Don&apos;t just take our word for it. Hear from organisations we&apos;ve helped transform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <figure
              key={index}
              className="relative rounded-lg border border-navy-700 bg-navy-850 p-8 shadow-card"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-navy-700" aria-hidden />

              <blockquote className="mb-8 text-navy-200 italic leading-relaxed border-0 bg-transparent p-0">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <figcaption className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-aqua-500/20 to-navy-800 border border-navy-700 flex items-center justify-center">
                  <span className="text-sm font-bold font-mono text-aqua-400">
                    {testimonial.author.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-navy-100">{testimonial.author}</div>
                  <div className="text-sm text-navy-300">
                    {testimonial.position} at {testimonial.company}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Impact metrics */}
        <div className="mt-16 p-8 rounded-xl border border-navy-700 bg-navy-950 card-featured">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-navy-100">The Impact We Deliver</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((m) => (
              <div key={m.label}>
                <div className="font-display text-4xl font-bold text-gradient-aqua mb-2 tabular-nums">
                  {m.value}
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-navy-300">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
