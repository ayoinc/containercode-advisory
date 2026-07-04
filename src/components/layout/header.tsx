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
          ? 'bg-navy-950/90 border-b border-navy-800 shadow-lg backdrop-blur-lg'
          : isOpen
            ? 'bg-navy-950 border-b border-navy-800'
            : 'bg-navy-900/80 backdrop-blur-md border-b border-transparent'
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
                    'relative group text-navy-200 hover:text-navy-100 px-3 py-2 rounded text-sm font-medium transition-colors duration-150',
                    pathname === item.href && 'text-aqua-400'
                  )}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-aqua-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              ) : (
                <div key={item.name} className="relative group">
                  <button className="text-navy-200 hover:text-navy-100 px-3 py-2 rounded text-sm font-medium transition-colors duration-150 flex items-center group">
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  <div className="absolute left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-2 mt-1 bg-navy-850 rounded-lg shadow-xl border border-navy-700">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href as any}
                          className={cn(
                            "block px-4 py-3 text-sm text-navy-200 hover:bg-navy-800 hover:text-aqua-400 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg",
                            pathname === child.href && 'bg-navy-800 text-aqua-400'
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                      <div className="px-4 py-2 mt-1 border-t border-navy-700">
                        <Link
                          href="/services"
                          className="flex items-center text-sm font-medium text-aqua-400 hover:text-aqua-300"
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
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-aqua-500 text-navy-950 font-semibold rounded hover:bg-aqua-400 transition-all duration-200 shadow-button hover:shadow-button-hover"
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
                className="p-2 rounded text-navy-200 hover:bg-navy-800 hover:text-navy-100 transition-colors"
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
          'md:hidden transition-all duration-300 bg-navy-950 border-t border-navy-800 overflow-y-auto max-h-[80vh]',
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
                    'text-base font-medium transition-colors py-2.5 px-3 rounded',
                    pathname === item.href
                      ? 'text-aqua-400 bg-navy-800'
                      : 'text-navy-200 hover:text-aqua-400 hover:bg-navy-850'
                  )}
                >
                  {item.name}
                </Link>
              ) : (
                <div key={item.name} className="space-y-1 rounded-lg overflow-hidden border border-navy-800">
                  <button
                    onClick={() => toggleMobileItem(item.name)}
                    className="flex justify-between items-center w-full text-left text-base font-medium text-navy-200 p-3 hover:bg-navy-850"
                  >
                    {item.name}
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-navy-300 transition-transform duration-200",
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
                    <div className="bg-navy-900 px-3 py-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href as any}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "block text-sm rounded px-3 py-2.5 transition-colors",
                            pathname === child.href
                              ? "text-aqua-400 bg-navy-800"
                              : "text-navy-300 hover:text-aqua-400 hover:bg-navy-800"
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center text-sm font-medium text-aqua-400 hover:text-aqua-300 px-3 py-2.5"
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-aqua-500 text-navy-950 font-semibold rounded hover:bg-aqua-400 transition-all duration-200 mt-2 w-full justify-center"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}