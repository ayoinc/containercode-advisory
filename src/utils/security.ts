
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from './rate-limit';

// Input validation utilities
export const validateInput = (input: string, maxLength: number = 1000): string => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  if (input.length > maxLength) {
    throw new Error(`Input too long. Maximum length is ${maxLength} characters`);
  }
  
  // Remove potentially harmful characters
  const sanitized = input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
  
  return sanitized;
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// CSRF protection
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Rate limiting middleware
export const withRateLimit = (handler: any) => {
  return async (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-forwarded-for') || 'unknown';
    
    try {
      await rateLimit.check(ip, 10, '1 m'); // 10 requests per minute
      return handler(req);
    } catch {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
  };
};

// Security headers middleware
export const withSecurityHeaders = (response: NextResponse) => {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
};
