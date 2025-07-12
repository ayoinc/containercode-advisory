'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

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

  // Navigation items
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
        { name: 'IT Support', href: '/services/it-support' },
      ]
    },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        isScrolled || isOpen
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-subtle'
          : 'bg-transparent'
      )}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-navy-800 dark:text-white">
              ContainerCode
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => 
              !item.children ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-navy-600 dark:hover:text-aqua-500',
                    pathname === item.href
                      ? 'text-navy-800 dark:text-aqua-500'
                      : 'text-slate-600 dark:text-slate-300'
                  )}
                >
                  {item.name}
                </Link>
              ) : (
                <div key={item.name} className="relative group">
                  <button className="flex items-center text-sm font-medium transition-colors hover:text-navy-600 dark:hover:text-aqua-500 text-slate-600 dark:text-slate-300">
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-2 mt-1 bg-white dark:bg-slate-800 rounded-md shadow-elevated border border-slate-200 dark:border-slate-700">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
            
            {/* Theme switcher */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </button>
            
            {/* CTA Button */}
            <Link
              href="/contact"
              className="btn-primary btn-md"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 mr-2 rounded-full bg-slate-100 dark:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 dark:text-white"
              aria-label="Toggle menu"
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

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 shadow-md">
          <div className="container-custom py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => 
                !item.children ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'text-base font-medium transition-colors',
                      pathname === item.href
                        ? 'text-navy-800 dark:text-aqua-500'
                        : 'text-slate-600 dark:text-slate-300'
                    )}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div key={item.name} className="space-y-2">
                    <div className="text-base font-medium text-slate-800 dark:text-white">
                      {item.name}
                    </div>
                    <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className="block text-sm text-slate-600 dark:text-slate-400 hover:text-navy-600 dark:hover:text-aqua-500"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              )}
              
              {/* Mobile CTA */}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary btn-md w-full text-center mt-4"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
