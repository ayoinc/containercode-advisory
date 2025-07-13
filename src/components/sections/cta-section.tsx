import Link from 'next/link';
import { Mail } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-navy-900 to-navy-800 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Technology?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Schedule a consultation with our experts to discuss your specific needs and discover how we can help you achieve your technology goals.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white/10 p-2 rounded-lg mr-4">
                  <Mail className="h-6 w-6 text-aqua-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                  <p className="text-white/70 mb-2">
                    Get a response within 24 hours
                  </p>
                  <a 
                    href="mailto:info@containercode.club" 
                    className="text-aqua-400 hover:underline"
                  >
                    info@containercode.club
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white/10 p-2 rounded-lg mr-4">
                  <svg className="h-6 w-6 text-aqua-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                  <p className="text-white/70 mb-2">
                    Speak directly with a consultant
                  </p>
                  <a 
                    href="tel:+11234567890" 
                    className="text-aqua-400 hover:underline"
                  >
                    +1 (123) 456-7890
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg p-8 shadow-elevated">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Us
              </h3>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    Service of Interest
                  </label>
                  <select
                    id="service"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  >
                    <option value="">Select a service...</option>
                    <option value="cloud">Cloud Technologies</option>
                    <option value="security">Cybersecurity</option>
                    <option value="devops">DevOps & DevSecOps</option>
                    <option value="transformation">Digital Transformation</option>
                    <option value="software">Software Engineering</option>
                    <option value="support">IT Support & Management</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-navy-600 hover:bg-navy-700 text-white rounded-md transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
