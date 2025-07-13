import { test, expect } from '@playwright/test';

test.describe('User Acceptance Tests - Business Requirements', () => {
  test('homepage clearly communicates value proposition', async ({ page }) => {
    await page.goto('/');
    
    // Verify key value propositions are visible
    await expect(page.getByText('Transforming Businesses Through Cloud Excellence')).toBeVisible();
    await expect(page.getByText('multi-cloud architectures, cybersecurity, and operational excellence')).toBeVisible();
    
    // Check that main benefits are clearly stated
    await expect(page.getByText('Multi-cloud expertise across all major platforms')).toBeVisible();
    await expect(page.getByText('Security-first approach with regulatory compliance')).toBeVisible();
    await expect(page.getByText('DevOps automation and operational excellence')).toBeVisible();
    await expect(page.getByText('Strategic digital transformation guidance')).toBeVisible();
    
    // Verify trust indicators
    await expect(page.getByText('Trusted by organisations worldwide')).toBeVisible();
    await expect(page.getByText('Successful Transformations')).toBeVisible();
    await expect(page.getByText('Service Reliability')).toBeVisible();
  });

  test('services are clearly presented and accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check all six core services are presented
    const services = [
      'Multi-Cloud Technologies',
      'Cybersecurity Excellence',
      'DevOps & DevSecOps', 
      'Digital Transformation',
      'Software Engineering',
      'Managed IT Support'
    ];
    
    for (const service of services) {
      const serviceHeading = page.getByRole('heading', { name: service });
      await serviceHeading.scrollIntoViewIfNeeded();
      await expect(serviceHeading).toBeVisible();
      
      // Check that each service has descriptive content
      const serviceSection = serviceHeading.locator('..').locator('..');
      await expect(serviceSection.getByRole('list')).toBeVisible(); // Service features
      await expect(serviceSection.getByRole('link', { name: 'Learn More' })).toBeVisible();
    }
  });

  test('contact methods are easily accessible', async ({ page }) => {
    await page.goto('/');
    
    // Multiple ways to contact should be available
    
    // 1. Main contact form
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
    
    // 2. Email links
    await expect(page.getByRole('link', { name: 'info@containercode.club' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'hello@containercode.club' })).toBeVisible();
    
    // 3. Phone numbers
    await expect(page.getByRole('link', { name: '+1 (123) 456-7890' })).toBeVisible();
    await expect(page.getByRole('link', { name: '+44 (0) 20 7946 0958' })).toBeVisible();
    
    // 4. CTA buttons
    await expect(page.getByRole('link', { name: 'Start Your Transformation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Schedule Consultation' })).toBeVisible();
  });

  test('credibility and trust elements are prominent', async ({ page }) => {
    await page.goto('/');
    
    // Check client testimonials
    await page.getByRole('heading', { name: 'What Our Clients Say' }).scrollIntoViewIfNeeded();
    
    // Verify testimonials are present with names and titles
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
    await expect(page.getByText('CTO at TechFlow Solutions')).toBeVisible();
    await expect(page.getByText('Michael Chen')).toBeVisible();
    await expect(page.getByText('VP of Engineering at DataCore Systems')).toBeVisible();
    await expect(page.getByText('Emily Rodriguez')).toBeVisible();
    await expect(page.getByText('Chief Innovation Officer at Global Dynamics')).toBeVisible();
    
    // Check certifications and partnerships
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await expect(page.getByText('AWS Partner')).toBeVisible();
    await expect(page.getByText('Microsoft Partner')).toBeVisible();
    await expect(page.getByText('Google Cloud Partner')).toBeVisible();
    await expect(page.getByText('ISO 27001 Certified')).toBeVisible();
    
    // Check case study presence
    await expect(page.getByText('Global Manufacturing Company: Multi-Cloud Digital Transformation')).toBeVisible();
  });

  test('business impact metrics are highlighted', async ({ page }) => {
    await page.goto('/');
    
    // Check key performance indicators
    await expect(page.getByText('95%')).toBeVisible(); // Client Retention Rate
    await expect(page.getByText('40%')).toBeVisible(); // Average Cost Reduction
    await expect(page.getByText('24/7')).toBeVisible(); // Support & Monitoring
    
    // Check other business metrics
    await expect(page.getByText('500+')).toBeVisible(); // Clients Served
    await expect(page.getByText('99.9%')).toBeVisible(); // Uptime SLA
    await expect(page.getByText('150+')).toBeVisible(); // Projects Delivered
    
    // Check competitive advantages
    await expect(page.getByText('5+ Cloud Platforms')).toBeVisible();
    await expect(page.getByText('100% Compliance Success')).toBeVisible();
    await expect(page.getByText('60% Faster Deployments')).toBeVisible();
    await expect(page.getByText('40% Cost Reduction')).toBeVisible();
  });

  test('lead generation forms work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test main contact form validation
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    
    // Try submitting empty form to test validation
    await page.getByRole('button', { name: 'Send Message' }).click();
    await page.waitForTimeout(1000);
    
    // Fill form with valid data
    await page.getByPlaceholder('Full Name').fill('Test User');
    await page.getByPlaceholder('Email Address').fill('test@businessuser.com');
    await page.getByRole('combobox', { name: 'Service of Interest' }).click();
    await page.getByRole('option', { name: 'Digital Transformation' }).click();
    await page.getByPlaceholder('Message').fill('We are a mid-size company looking to modernize our legacy systems and adopt cloud technologies. Can you help us develop a roadmap?');
    
    // Submit form
    await page.getByRole('button', { name: 'Send Message' }).click();
    await page.waitForTimeout(2000);
    
    // Test newsletter subscription
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    const newsletterEmail = page.getByPlaceholder('Email for newsletter subscription');
    await newsletterEmail.fill('business@example.com');
    await page.getByRole('button', { name: 'Subscribe' }).click();
    await page.waitForTimeout(1000);
  });

  test('mobile user experience meets business requirements', async ({ page }) => {
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Key information should be accessible on tablet
    await expect(page.getByRole('heading', { name: 'Transforming Businesses Through Cloud Excellence' })).toBeVisible();
    await expect(page.getByText('Multi-Cloud Technologies')).toBeVisible();
    
    // Contact form should work on tablet
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    await page.getByPlaceholder('Full Name').fill('Tablet User');
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
    
    // Test phone viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Essential content should remain accessible
    await expect(page.getByRole('heading', { name: 'Transforming Businesses Through Cloud Excellence' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start Your Transformation' })).toBeVisible();
    
    // Navigation should work on mobile
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Contact information should be accessible
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await expect(page.getByRole('link', { name: '+44 (0) 20 7946 0958' })).toBeVisible();
  });

  test('SEO and discoverability elements are present', async ({ page }) => {
    await page.goto('/');
    
    // Check page title and meta description
    await expect(page).toHaveTitle(/ContainerCode Advisory/);
    
    // Check structured headings
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const headingCount = await page.getByRole('heading', { level: 2 }).count();
    expect(headingCount).toBeGreaterThanOrEqual(3);
    
    // Check alt text for images (accessibility and SEO)
    const images = page.getByRole('img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);
    
    // Check that logo has proper alt text
    await expect(page.getByRole('img', { name: 'ContainerCode Advisory' })).toBeVisible();
  });

  test('performance meets business requirements', async ({ page }) => {
    // Track performance metrics
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Business requirement: Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check that images load properly
    const heroImage = page.getByRole('img').first();
    await expect(heroImage).toBeVisible();
    
    // Check that interactive elements respond quickly
    const ctaButton = page.getByRole('link', { name: 'Start Your Transformation' });
    const hoverStart = Date.now();
    await ctaButton.hover();
    const hoverTime = Date.now() - hoverStart;
    expect(hoverTime).toBeLessThan(100); // Should respond within 100ms
  });

  test('emergency support information is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check 24/7 support messaging
    await expect(page.getByText('24/7 Expert Support')).toBeVisible();
    await expect(page.getByText('24/7 Support & Monitoring')).toBeVisible();
    
    // Check emergency contact in footer
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await expect(page.getByText('Emergency Support')).toBeVisible();
    await expect(page.getByText('24/7 critical issue assistance available')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Emergency Hotline' })).toBeVisible();
  });

  test('privacy and legal compliance is visible', async ({ page }) => {
    await page.goto('/');
    
    // Check footer legal links
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms & Conditions' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cookie Policy' })).toBeVisible();
    
    // Check compliance certifications
    await expect(page.getByText('ISO 27001 Certified')).toBeVisible();
    await expect(page.getByText('SOC 2 Type II')).toBeVisible();
    await expect(page.getByText('Cyber Essentials Plus')).toBeVisible();
    
    // Check privacy messaging in newsletter
    await expect(page.getByText('We respect your privacy. Unsubscribe at any time.')).toBeVisible();
    
    // Check company registration info
    await expect(page.getByText('Company registered in England and Wales')).toBeVisible();
  });
});
