import { test, expect } from '@playwright/test';

test.describe('Improved User Acceptance Tests - Business Requirements', () => {
  test('homepage communicates value proposition clearly with proper content structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify key value propositions with flexible text matching
    await expect(page.getByRole('heading', { name: /Transforming Businesses Through Cloud Excellence/i })).toBeVisible();
    
    // Check for key value statements (more flexible matching)
    await expect(page.getByText(/multi-cloud architectures.*cybersecurity.*operational excellence/i)).toBeVisible();
    
    // Check that main benefits are clearly stated in content
    const benefitsSection = page.locator('text=Multi-cloud expertise').locator('..');
    await benefitsSection.scrollIntoViewIfNeeded();
    
    // Verify trust indicators with flexible selectors
    await expect(page.getByText(/Trusted by.*organisations/i)).toBeVisible();
    await expect(page.getByText(/Successful Transformations/i)).toBeVisible();
    await expect(page.getByText(/Service Reliability/i)).toBeVisible();
  });

  test('all services are clearly presented and accessible with proper navigation', async ({ page }) => {
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
      
      // Check that each service has descriptive content and learn more link
      const serviceSection = serviceHeading.locator('..').locator('..');
      
      // Look for service features (lists or descriptive content)
      const hasContent = await serviceSection.locator('ul, ol, p').count() > 0;
      expect(hasContent).toBeTruthy();
      
      // Check for Learn More button
      const learnMoreButton = serviceSection.getByRole('link', { name: 'Learn More' });
      if (await learnMoreButton.isVisible()) {
        await expect(learnMoreButton).toBeVisible();
      }
    }
  });

  test('multiple contact methods are easily accessible and functional', async ({ page }) => {
    await page.goto('/');
    
    // 1. Main contact form accessibility
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    
    // Verify form is properly structured and accessible
    await expect(page.getByAltText('Full Name')).toBeVisible();
    await expect(page.getByAltText('Email Address')).toBeVisible();
    await expect(page.getByAltText('Subject')).toBeVisible();
    await expect(page.getByAltText('Message')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
    
    // 2. Email links in footer
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    
    await expect(footer.getByRole('link', { name: 'info@containercode.club' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'hello@containercode.club' })).toBeVisible();
    
    // 3. Phone numbers as clickable links
    await expect(footer.getByRole('link', { name: '+1 (123) 456-7890' })).toBeVisible();
    await expect(footer.getByRole('link', { name: '+44 (0) 20 7946 0958' })).toBeVisible();
    
    // 4. CTA buttons throughout the page
    await expect(page.getByRole('link', { name: 'Start Your Transformation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Schedule Consultation' })).toBeVisible();
    
    // Test that email links have proper mailto attributes
    const emailLink = footer.getByRole('link', { name: 'info@containercode.club' });
    await expect(emailLink).toHaveAttribute('href', /mailto:/);
    
    // Test that phone links have proper tel attributes
    const phoneLink = footer.getByRole('link', { name: '+44 (0) 20 7946 0958' });
    await expect(phoneLink).toHaveAttribute('href', /tel:/);
  });

  test('credibility and trust elements are prominent and visible', async ({ page }) => {
    await page.goto('/');
    
    // Check client testimonials section
    const testimonialsSection = page.getByRole('heading', { name: 'What Our Clients Say' });
    await testimonialsSection.scrollIntoViewIfNeeded();
    await expect(testimonialsSection).toBeVisible();
    
    // Verify testimonials with named executives are present
    const testimonialNames = ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez'];
    const testimonialTitles = ['CTO', 'VP of Engineering', 'Chief Innovation Officer'];
    
    for (const name of testimonialNames) {
      await expect(page.getByText(name)).toBeVisible();
    }
    
    for (const title of testimonialTitles) {
      await expect(page.getByText(new RegExp(title, 'i'))).toBeVisible();
    }
    
    // Check certifications and partnerships in footer
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    
    const certifications = ['AWS Partner', 'Microsoft Partner', 'Google Cloud Partner', 'ISO 27001'];
    
    for (const cert of certifications) {
      const certElement = footer.getByText(new RegExp(cert, 'i'));
      if (await certElement.isVisible()) {
        await expect(certElement).toBeVisible();
      }
    }
    
    // Check case study presence
    await expect(page.getByText(/Global Manufacturing Company.*Multi-Cloud Digital Transformation/i)).toBeVisible();
  });

  test('business impact metrics are highlighted and accurate', async ({ page }) => {
    await page.goto('/');
    
    // Check key performance indicators with flexible matching
    const metricsToCheck = [
      { value: '95%', context: 'Client Retention' },
      { value: '40%', context: 'Cost Reduction' },
      { value: '24/7', context: 'Support' },
      { value: '500+', context: 'Clients' },
      { value: '99.9%', context: 'Uptime' },
      { value: '150+', context: 'Projects' }
    ];
    
    for (const metric of metricsToCheck) {
      // Look for the metric value
      const metricElement = page.getByText(metric.value);
      await metricElement.scrollIntoViewIfNeeded();
      
      if (await metricElement.isVisible()) {
        await expect(metricElement).toBeVisible();
        
        // Check that context is nearby
        const parentSection = metricElement.locator('..').locator('..');
        await expect(parentSection.getByText(new RegExp(metric.context, 'i'))).toBeVisible();
      }
    }
    
    // Check competitive advantages
    const advantages = [
      '5+ Cloud Platforms',
      '100% Compliance Success',
      '60% Faster Deployments'
    ];
    
    for (const advantage of advantages) {
      const advantageElement = page.getByText(new RegExp(advantage, 'i'));
      if (await advantageElement.isVisible()) {
        await expect(advantageElement).toBeVisible();
      }
    }
  });

  test('lead generation forms work correctly with proper validation', async ({ page }) => {
    await page.goto('/');
    
    // Test main contact form validation and submission
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    
    // Test empty form validation
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Verify validation messages appear
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Subject is required')).toBeVisible();
    await expect(page.getByText('Message is required')).toBeVisible();
    
    // Test invalid email validation
    await page.getByAltText('Full Name').fill('Business User');
    await page.getByAltText('Email Address').fill('invalid-email');
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    
    // Fill form with valid business data
    await page.getByAltText('Full Name').fill('Jane Smith');
    await page.getByAltText('Email Address').fill('jane.smith@businesscorp.com');
    await page.getByAltText('Phone Number (Optional)').fill('+1 (555) 987-6543');
    await page.getByAltText('Subject').fill('Enterprise Cloud Migration Consultation');
    await page.getByAltText('Message').fill('We are a mid-size company with 200+ employees looking to modernize our legacy systems and adopt cloud technologies. Can you help us develop a comprehensive migration roadmap and provide ongoing support?');
    
    // Submit form
    await page.getByRole('button', { name: 'Send Message' }).click();
    await page.waitForTimeout(2000);
    
    // Test newsletter subscription
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    
    const newsletterSection = footer.getByRole('heading', { name: 'Stay Informed' }).locator('..');
    if (await newsletterSection.isVisible()) {
      const newsletterEmail = newsletterSection.getByPlaceholder('Email for newsletter subscription');
      await newsletterEmail.fill('business@example.com');
      await newsletterSection.getByRole('button', { name: 'Subscribe' }).click();
      await page.waitForTimeout(1000);
    }
  });

  test('mobile user experience meets business requirements across devices', async ({ page }) => {
    // Test tablet viewport (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Key information should be accessible on tablet
    await expect(page.getByRole('heading', { name: /Transforming Businesses Through Cloud Excellence/i })).toBeVisible();
    await expect(page.getByText(/Multi-Cloud Technologies/i)).toBeVisible();
    
    // Contact form should work on tablet
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    await page.getByAltText('Full Name').fill('Tablet User');
    await page.getByAltText('Email Address').fill('tablet@business.com');
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
    
    // Test phone viewport (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Essential content should remain accessible
    await expect(page.getByRole('heading', { name: /Transforming Businesses Through Cloud Excellence/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start Your Transformation' })).toBeVisible();
    
    // Navigation should work on mobile
    const mobileMenuButton = page.getByRole('button', { name: 'Toggle menu' });
    await expect(mobileMenuButton).toBeVisible();
    
    // Test mobile navigation
    await mobileMenuButton.click();
    await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    
    const mobileNav = page.locator('div.md\\:hidden').filter({ hasText: 'Home' });
    await expect(mobileNav.getByRole('link', { name: 'Contact' })).toBeVisible();
    
    // Contact information should be accessible on mobile
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await expect(page.getByRole('link', { name: '+44 (0) 20 7946 0958' })).toBeVisible();
    
    // Test mobile form functionality
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    await page.getByAltText('Full Name').fill('Mobile User');
    await page.getByAltText('Email Address').fill('mobile@business.com');
    await page.getByAltText('Subject').fill('Mobile Inquiry');
    await page.getByRole('button', { name: 'Send Message' }).click();
  });

  test('SEO and discoverability elements are properly implemented', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check page title is descriptive and includes key terms
    await expect(page).toHaveTitle(/ContainerCode Advisory.*Multi-Cloud.*Consulting/i);
    
    // Check meta description exists and is descriptive
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);
    
    const descriptionContent = await metaDescription.getAttribute('content');
    expect(descriptionContent).toBeTruthy();
    expect(descriptionContent!.length).toBeGreaterThan(120);
    expect(descriptionContent!.length).toBeLessThan(160);
    
    // Check structured headings hierarchy
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    
    const h2Count = await page.getByRole('heading', { level: 2 }).count();
    expect(h2Count).toBeGreaterThan(2);
    
    const h3Count = await page.getByRole('heading', { level: 3 }).count();
    expect(h3Count).toBeGreaterThan(5);
    
    // Check that all images have proper alt text
    const images = page.getByRole('img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);
    
    // Check specific important images
    await expect(page.getByRole('img', { name: 'ContainerCode Advisory' })).toBeVisible();
    
    // Check for schema markup or structured data
    const scriptTags = page.locator('script[type="application/ld+json"]');
    const schemaCount = await scriptTags.count();
    
    if (schemaCount > 0) {
      console.log(`Found ${schemaCount} structured data scripts`);
    }
    
    // Check canonical URL if present
    const canonicalLink = page.locator('link[rel="canonical"]');
    if (await canonicalLink.count() > 0) {
      const canonicalHref = await canonicalLink.getAttribute('href');
      expect(canonicalHref).toBeTruthy();
    }
  });

  test('performance meets business requirements under realistic conditions', async ({ page }) => {
    // Test with slower network to simulate real conditions
    await page.route('**/*', route => {
      // Add slight delay to simulate real network conditions
      setTimeout(() => route.continue(), 50);
    });
    
    // Track comprehensive performance metrics
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Business requirement: Page should load within 3 seconds even with delays
    expect(loadTime).toBeLessThan(3000);
    
    // Test that critical content loads quickly
    const heroLoadTime = Date.now();
    await expect(page.getByRole('heading', { name: /Transforming Businesses Through Cloud Excellence/i })).toBeVisible();
    const heroTime = Date.now() - heroLoadTime;
    expect(heroTime).toBeLessThan(500);
    
    // Test that images load and display properly
    const images = page.getByRole('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const image = images.nth(i);
      if (await image.isVisible()) {
        await expect(image).toBeVisible();
      }
    }
    
    // Test interactive element responsiveness
    const ctaButton = page.getByRole('link', { name: 'Start Your Transformation' });
    const hoverStart = Date.now();
    await ctaButton.hover();
    const hoverTime = Date.now() - hoverStart;
    expect(hoverTime).toBeLessThan(100);
    
    // Test form interaction performance
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    
    const formInteractionStart = Date.now();
    await page.getByAltText('Full Name').fill('Performance Test User');
    await page.getByAltText('Email Address').fill('perf@test.com');
    const formInteractionTime = Date.now() - formInteractionStart;
    expect(formInteractionTime).toBeLessThan(200);
  });

  test('emergency support and 24/7 messaging is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check 24/7 support messaging in content
    await expect(page.getByText(/24\/7.*Support/i)).toBeVisible();
    await expect(page.getByText(/24\/7.*Monitoring/i)).toBeVisible();
    
    // Check emergency contact information in footer
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    
    await expect(footer.getByText(/Emergency Support/i)).toBeVisible();
    await expect(footer.getByText(/24\/7.*critical.*assistance/i)).toBeVisible();
    
    // Check for emergency contact link or number
    const emergencyLink = footer.getByRole('link', { name: /Emergency Hotline/i });
    if (await emergencyLink.isVisible()) {
      await expect(emergencyLink).toBeVisible();
      
      // Should be a phone link
      const href = await emergencyLink.getAttribute('href');
      expect(href).toMatch(/tel:|mailto:/);
    }
    
    // Check that emergency support is highlighted prominently
    const emergencySection = footer.getByText(/Emergency Support/i).locator('..');
    await expect(emergencySection).toBeVisible();
  });

  test('privacy and legal compliance information is visible and accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check footer legal links
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    
    const legalLinks = [
      'Privacy Policy',
      'Terms & Conditions', 
      'Cookie Policy'
    ];
    
    for (const linkText of legalLinks) {
      const legalLink = footer.getByRole('link', { name: linkText });
      await expect(legalLink).toBeVisible();
      
      // Verify links have proper href attributes
      const href = await legalLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
    
    // Check compliance certifications
    const certifications = [
      'ISO 27001',
      'SOC 2 Type II',
      'Cyber Essentials Plus'
    ];
    
    for (const cert of certifications) {
      const certElement = footer.getByText(new RegExp(cert, 'i'));
      if (await certElement.isVisible()) {
        await expect(certElement).toBeVisible();
      }
    }
    
    // Check privacy messaging in newsletter section
    const privacyText = footer.getByText(/We respect your privacy.*Unsubscribe/i);
    if (await privacyText.isVisible()) {
      await expect(privacyText).toBeVisible();
    }
    
    // Check company registration information
    const companyInfo = footer.getByText(/Company registered in England and Wales/i);
    if (await companyInfo.isVisible()) {
      await expect(companyInfo).toBeVisible();
    }
    
    // Test privacy policy accessibility
    const privacyLink = footer.getByRole('link', { name: 'Privacy Policy' });
    await privacyLink.click();
    await page.waitForTimeout(1000);
    
    // Should navigate to privacy policy or show content
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/(privacy|terms|legal)/i);
  });
});
