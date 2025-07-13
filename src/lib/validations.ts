import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, { message: 'Please select a service' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
  subscribe: z.boolean().default(false),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Newsletter form validation schema
export const newsletterSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

// Client portal login validation schema
export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  rememberMe: z.boolean().optional(),
});

export type LoginData = z.infer<typeof loginSchema>;

// Assessment tool validation schema
export const assessmentSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name is required' }),
  industry: z.string().min(1, { message: 'Please select an industry' }),
  employeeCount: z.string().min(1, { message: 'Please select employee count' }),
  currentCloud: z.array(z.string()).min(1, { message: 'Please select at least one cloud provider' }),
  securityPriorities: z.array(z.string()).optional(),
  budgetRange: z.string().min(1, { message: 'Please select a budget range' }),
  timeframe: z.string().min(1, { message: 'Please select a timeframe' }),
  contactName: z.string().min(2, { message: 'Contact name is required' }),
  contactEmail: z.string().email({ message: 'Please enter a valid email address' }),
  contactPhone: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export type AssessmentData = z.infer<typeof assessmentSchema>;
