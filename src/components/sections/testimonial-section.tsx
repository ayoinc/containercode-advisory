export function TestimonialSection() {
  const testimonials = [
    {
      quote: "ContainerCode Advisory's multi-cloud expertise helped us optimize our infrastructure across AWS and Azure, resulting in a 30% cost reduction while improving performance and security.",
      author: "Sarah Johnson",
      position: "CTO",
      company: "FinTech Innovations",
      image: "/images/testimonials/sarah-j.jpg", // Placeholder - replace with actual image
    },
    {
      quote: "Their security-first approach to cloud migration ensured we maintained compliance throughout our digital transformation journey. Their team's expertise was invaluable.",
      author: "Michael Chen",
      position: "CISO",
      company: "HealthCare Partners",
      image: "/images/testimonials/michael-c.jpg", // Placeholder - replace with actual image
    },
    {
      quote: "Working with ContainerCode Advisory transformed our DevOps practices. We've reduced deployment times from days to minutes and improved our overall development velocity.",
      author: "Emily Rodriguez",
      position: "VP of Engineering",
      company: "E-commerce Solutions",
      image: "/images/testimonials/emily-r.jpg", // Placeholder - replace with actual image
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-slate-700 dark:text-slate-300">
            Don't just take our word for it. Hear from organizations we've helped transform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-800 rounded-lg shadow-card p-8 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-navy-100 dark:text-slate-700">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.691 6.292C5.094 4.771 7.217 4 10.066 4h.31l.004 1.241c0 .8-.26 1.456-.775 1.968-.523.523-1.164.784-1.921.784h-.56c-1.429 0-2.29.84-2.577 2.523.31-.203.64-.299.995-.299 2.013 0 3.02 1.52 3.02 4.557 0 1.462-.355 2.613-1.063 3.454-.709.84-1.689 1.261-2.94 1.261-1.547 0-2.714-.596-3.497-1.786-.784-1.178-1.172-2.885-1.172-5.107 0-1.32.116-2.523.349-3.611.232-1.077.65-2.045 1.251-2.903zm11.508 0C16.593 4.771 18.716 4 21.565 4h.31l.005 1.241c0 .8-.26 1.456-.775 1.968-.523.523-1.165.784-1.922.784h-.559c-1.43 0-2.29.84-2.578 2.523.31-.203.64-.299.995-.299 2.012 0 3.019 1.52 3.019 4.557 0 1.462-.354 2.613-1.063 3.454-.708.84-1.688 1.261-2.94 1.261-1.546 0-2.713-.596-3.496-1.786-.784-1.178-1.172-2.885-1.172-5.107 0-1.32.116-2.523.348-3.611.232-1.077.65-2.045 1.252-2.903z" />
                </svg>
              </div>
              
              {/* Testimonial content */}
              <div className="mb-8">
                <p className="text-slate-700 dark:text-slate-300 italic">
                  "{testimonial.quote}"
                </p>
              </div>
              
              {/* Author info */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 mr-4">
                  {/* This would be replaced with an actual image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-lg font-bold text-navy-500 dark:text-aqua-400">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {testimonial.position}, {testimonial.company}
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { metric: "40+", label: "Enterprise Clients" },
              { metric: "250+", label: "Projects Delivered" },
              { metric: "35%", label: "Average Cost Reduction" },
              { metric: "99.99%", label: "Cloud Uptime Achieved" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-aqua-400 mb-2">
                  {item.metric}
                </div>
                <div className="text-white/80">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
