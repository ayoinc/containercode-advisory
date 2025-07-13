'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  Star,
  ArrowRight,
  MessageSquare,
  Calendar,
  Shield,
  Award,
  Users,
  Building2,
  Headphones
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfessionalContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    position: '',
    service: '',
    message: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.service || !formData.message) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Log form data for debugging
      console.log('Submitting contact form with data:', {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        service: formData.service,
        message: formData.message
      });

      // Call the actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.position, // Using position field as phone for now
          service: formData.service,
          message: formData.message,
          subscribe: false // Default to false, can be made configurable
        }),
      });

      const result = await response.json();
      console.log('API response:', response.status, result);

      if (response.ok && result.success) {
        setIsSubmitting(false);
        setSubmitted(true);
        toast.success('Thank you for your enquiry. We\'ll respond within 24 hours.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          position: '',
          service: '',
          message: '',
          budget: '',
          timeline: ''
        });
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast.error('Failed to send message. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Enquiries',
      content: 'hello@containercode.club',
      description: 'Response within 24 hours',
      href: 'mailto:hello@containercode.club'
    },
    {
      icon: Phone,
      title: 'Telephone',
      content: '+44 (0) 20 7946 0958',
      description: 'Monday-Friday, 9AM-6PM GMT',
      href: 'tel:+442079460958'
    },
    {
      icon: Calendar,
      title: 'Schedule Consultation',
      content: 'Book Meeting',
      description: 'Complimentary 30-minute session',
      href: '/book-consultation'
    },
    {
      icon: MapPin,
      title: 'Headquarters',
      content: 'London, United Kingdom',
      description: 'Serving clients globally',
      href: '#location'
    }
  ];

  const services = [
    'Multi-Cloud Technologies',
    'Cybersecurity Excellence', 
    'DevOps & DevSecOps',
    'Digital Transformation',
    'Software Engineering',
    'Managed IT Support',
    'Strategic Consulting',
    'Other (Please specify)'
  ];

  const budgetRanges = [
    '£10,000 - £25,000',
    '£25,000 - £50,000',
    '£50,000 - £100,000',
    '£100,000 - £250,000',
    '£250,000+'
  ];

  const timelines = [
    'Immediate (< 1 month)',
    '1-3 months',
    '3-6 months',
    '6-12 months',
    '12+ months'
  ];

  const trustIndicators = [
    { icon: Shield, text: 'ISO 27001 Certified', stat: '100%' },
    { icon: Star, text: 'Client Satisfaction', stat: '4.9/5' },
    { icon: CheckCircle, text: 'Service Availability', stat: '99.9%' },
    { icon: Headphones, text: 'Support Response', stat: '<2hrs' }
  ];

  const achievements = [
    { number: '150+', label: 'Successful Projects' },
    { number: '50+', label: 'Enterprise Clients' },
    { number: '£50M+', label: 'Cost Savings Delivered' },
    { number: '24/7', label: 'Expert Support' }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6">
                <Building2 className="w-4 h-4 mr-2" />
                Get In Touch
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Let's Discuss Your
                <span className="block text-primary-400">Digital Transformation</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-12">
                Ready to accelerate your technology journey? Our expert team is here to help you achieve 
                your business objectives with proven solutions and measurable results.
              </p>

              {/* Achievement Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">
                      {achievement.number}
                    </div>
                    <div className="text-sm text-gray-400 font-medium">{achievement.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Multiple Ways to Connect
            </h2>
            <p className="text-xl text-gray-600">
              Choose the communication method that works best for your requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.href}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <method.icon className="w-6 h-6 text-primary-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-primary-600 font-semibold mb-2">{method.content}</p>
                <p className="text-sm text-gray-600">{method.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Information */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Tell Us About Your Project</h3>
                
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="John Smith"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="john.smith@company.co.uk"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="Your Organisation"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Position
                          </label>
                          <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="Your Role"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service of Interest
                          </label>
                          <select
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          >
                            <option value="">Please select a service</option>
                            {services.map((service) => (
                              <option key={service} value={service}>{service}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Budget Range
                          </label>
                          <select
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          >
                            <option value="">Select budget range</option>
                            {budgetRanges.map((range) => (
                              <option key={range} value={range}>{range}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Timeline
                        </label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        >
                          <option value="">Select preferred timeline</option>
                          {timelines.map((timeline) => (
                            <option key={timeline} value={timeline}>{timeline}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Requirements *
                        </label>
                        <textarea
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                          placeholder="Please describe your project requirements, current challenges, and objectives. Include any specific technologies or compliance requirements."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting Enquiry...
                          </>
                        ) : (
                          <>
                            Submit Enquiry
                            <Send className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      className="text-center py-12"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Enquiry Submitted Successfully</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Thank you for contacting ContainerCode Advisory. We'll review your requirements 
                        and respond within 24 hours with next steps.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Submit Another Enquiry
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Information Panel */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Trust Indicators */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Why Choose ContainerCode Advisory?</h3>
                <div className="space-y-4">
                  {trustIndicators.map((indicator, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 p-2 bg-primary-100 rounded-lg">
                        <indicator.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-semibold text-gray-900">{indicator.text}</div>
                      </div>
                      <div className="text-lg font-bold text-primary-600">{indicator.stat}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Support */}
              <div className="bg-gradient-to-br from-primary-600 to-gray-700 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Emergency Support Available</h3>
                <p className="text-primary-100 mb-6 leading-relaxed">
                  Experiencing critical issues? Our emergency support team provides 
                  immediate assistance for urgent technical matters.
                </p>
                <a
                  href="tel:+442079460958"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Emergency Hotline
                </a>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">What Happens Next?</h3>
                <div className="space-y-4">
                  {[
                    'We review your project requirements and objectives',
                    'Schedule a complimentary consultation call',
                    'Develop a tailored proposal and roadmap',
                    'Begin your digital transformation journey'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Global Reach</h2>
            <p className="text-xl text-gray-600">
              Headquartered in London, serving clients worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Headquarters</h3>
              <p className="text-gray-600">London, United Kingdom</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Business Hours</h3>
              <p className="text-gray-600">Monday-Friday, 9AM-6PM GMT</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Global Service</h3>
              <p className="text-gray-600">Supporting clients across all time zones</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}