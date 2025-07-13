'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Navigation items with proper British spelling
  const navigation = [
    { name: 'Home', href: '/' },
    { 
      name: 'Services', 
      href: '/services',
      children: [
        { name: 'Cloud Technologies', href: '/services/cloud-technologies' },
        { name: 'Cybersecurity', href: '/services/cybersecurity' },
        { name: 'DevOps & DevSecOps', href: '/services/devops' },
        { name: 'Digital Transformation', href: '/services/digital-transformation' },
        { name: 'Software Engineering', href: '/services/software-engineering' },
        { name: 'Managed IT Support', href: '/services/it-support' },
      ]
    },
    { name: 'Insights', href: '/blog' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const toggleMobileItem = (name: string) => {
    if (expandedMobileItem === name) {
      setExpandedMobileItem(null);
    } else {
      setExpandedMobileItem(name);
    }
  };

  return (
    <header
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white border-b border-gray-200 shadow-lg backdrop-blur-lg bg-white/95'
          : isOpen 
            ? 'bg-white border-b border-gray-200' 
            : 'bg-white/90 backdrop-blur-md'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="ContainerCode Advisory Home">
            {/* Desktop and Tablet - Horizontal Logo */}
            <div className="hidden sm:block">
              <img 
                src="/images/containercode-logo-horizontal.svg" 
                alt="ContainerCode Advisory" 
                className="h-10 w-auto"
              />
            </div>
            
            {/* Mobile - Icon Only */}
            <div className="block sm:hidden">
              <img 
                src="/images/containercode-icon.svg" 
                alt="ContainerCode Advisory" 
                className="h-9 w-9"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigation.map((item) => 
              !item.children ? (
                <Link
                  key={item.name}
                  href={item.href as any}
                  className={cn(
                    'relative group text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                    pathname === item.href && 'text-primary-600 bg-primary-50'
                  )}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              ) : (
                <div key={item.name} className="relative group">
                  <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center group">
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  <div className="absolute left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-2 mt-1 bg-white rounded-xl shadow-xl border border-gray-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href as any}
                          className={cn(
                            "block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg",
                            pathname === child.href && 'bg-primary-50 text-primary-700'
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                      <div className="px-4 py-2 mt-1 border-t border-gray-100">
                        <Link
                          href="/services"
                          className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          View All Services
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            
            {/* CTA Button */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile menu */}
          <div className="flex items-center space-x-2">
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          'md:hidden transition-all duration-300 bg-white border-t border-gray-100 overflow-y-auto max-h-[80vh]',
          isOpen ? 'block animate-slide-down' : 'hidden'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex flex-col space-y-3">
            {navigation.map((item) => 
              !item.children ? (
                <Link
                  key={item.name}
                  href={item.href as any}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-base font-medium transition-colors py-2.5 px-3 rounded-lg',
                    pathname === item.href
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                  )}
                >
                  {item.name}
                </Link>
              ) : (
                <div key={item.name} className="space-y-1 rounded-lg overflow-hidden border border-gray-100">
                  <button
                    onClick={() => toggleMobileItem(item.name)}
                    className="flex justify-between items-center w-full text-left text-base font-medium text-gray-700 p-3 hover:bg-gray-50"
                  >
                    {item.name}
                    <ChevronDown 
                      className={cn(
                        "h-5 w-5 text-gray-500 transition-transform duration-200",
                        expandedMobileItem === item.name && "rotate-180"
                      )} 
                    />
                  </button>
                  
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      expandedMobileItem === item.name 
                        ? "max-h-96 opacity-100" 
                        : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="bg-gray-50 px-3 py-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href as any}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "block text-sm rounded-md px-3 py-2.5 transition-colors",
                            pathname === child.href
                              ? "text-primary-700 bg-primary-50"
                              : "text-gray-600 hover:text-primary-700 hover:bg-gray-100"
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 px-3 py-2.5"
                      >
                        View All Services
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}
            
            {/* Mobile CTA */}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 mt-2 w-full justify-center"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}