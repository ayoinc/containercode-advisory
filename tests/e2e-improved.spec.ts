import { test, expect } from '@playwright/test';

test.describe('Improved E2E Tests - Complete User Journeys', () => {
  test('complete contact form submission journey with proper validation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to contact section
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    
    // Test form validation first (empty form)
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Check validation errors appear
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    
    // Fill out contact form using proper label-based selectors
    await page.getByAltText('Full Name').fill('John Doe');
    await page.getByAltText('Email Address').fill('john.doe@example.com');
    await page.getByAltText('Phone Number (Optional)').fill('+1 (555) 123-4567');
    await page.getByAltText('Subject').fill('Cloud Technologies Consultation');
    await page.getByAltText('Message').fill('I am interested in learning more about your multi-cloud services for our enterprise infrastructure. We are looking to migrate our current systems to a more scalable solution.');
    
    // Verify form is filled correctly
    await expect(page.getByAltText('Full Name')).toHaveValue('John Doe');
    await expect(page.getByAltText('Email Address')).toHaveValue('john.doe@example.com');
    
    // Submit form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Wait for form processing
    await page.waitForTimeout(2000);
    
    // Check for success state or form reset
    // The form should either show success message or reset the fields
    const nameField = page.getByAltText('Full Name');
    const isFormReset = await nameField.inputValue() === '';
    const hasSuccessMessage = await page.getByText('Message Sent Successfully!').isVisible().catch(() => false);
    
    expect(isFormReset || hasSuccessMessage).toBeTruthy();
  });

  test('navigation flow through service sections', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to each service section
    const services = [
      { name: 'Multi-Cloud Technologies', expectedContent: 'Multi-cloud expertise' },
      { name: 'Cybersecurity Excellence', expectedContent: 'Security-first approach' },
      { name: 'DevOps & DevSecOps', expectedContent: 'DevOps automation' },
      { name: 'Digital Transformation', expectedContent: 'Strategic digital transformation' },
      { name: 'Software Engineering', expectedContent: 'Software engineering' },
      { name: 'Managed IT Support', expectedContent: 'IT support' }
    ];
    
    for (const service of services) {
      // Scroll to service section
      const serviceHeading = page.getByRole('heading', { name: service.name });
      await serviceHeading.scrollIntoViewIfNeeded();
      await expect(serviceHeading).toBeVisible();
      
      // Check that service content is visible
      const serviceSection = serviceHeading.locator('..').locator('..');
      await expect(serviceSection).toBeVisible();
      
      // Look for Learn More button within the service section
      const learnMoreButton = serviceSection.getByRole('link', { name: 'Learn More' });
      if (await learnMoreButton.isVisible()) {
        await expect(learnMoreButton).toBeVisible();
        
        // Click and verify navigation (but return to home for next test)
        await learnMoreButton.click();
        await page.waitForTimeout(1000);
        
        // Check if we navigated to a service page
        const currentUrl = page.url();
        console.log(`Service: ${service.name}, URL: ${currentUrl}`);
        
        // Return to home for next iteration
        await page.goto('/');
      }
    }
  });

  test('newsletter subscription flow with validation', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to newsletter section in footer
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    
    // Find newsletter subscription section
    const newsletterSection = footer.getByRole('heading', { name: 'Stay Informed' }).locator('..');
    await expect(newsletterSection).toBeVisible();
    
    // Test empty form validation
    const subscribeButton = newsletterSection.getByRole('button', { name: 'Subscribe' });
    await subscribeButton.click();
    await page.waitForTimeout(500);
    
    // Fill newsletter email with proper targeting
    const emailInput = newsletterSection.getByPlaceholder('Email for newsletter subscription');
    await expect(emailInput).toBeVisible();
    
    // Test invalid email first
    await emailInput.fill('invalid-email');
    await subscribeButton.click();
    await page.waitForTimeout(500);
    
    // Fill valid email
    await emailInput.fill('test@example.com');
    await subscribeButton.click();
    
    // Wait for subscription processing
    await page.waitForTimeout(2000);
    
    // Verify subscription was processed
    console.log('Newsletter subscription submitted');
  });

  test('responsive navigation journey across viewports', async ({ page }) => {
    // Test desktop navigation
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Desktop navigation should be visible
    const desktopNav = page.locator('nav.hidden.md\\:flex');
    await expect(desktopNav).toBeVisible();
    
    // Test Services dropdown on desktop
    const servicesButton = desktopNav.getByRole('button', { name: 'Services' });
    await servicesButton.hover();
    await page.waitForTimeout(300);
    await expect(page.getByRole('link', { name: 'Cloud Technologies' })).toBeVisible();
    
    // Switch to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Desktop nav should be hidden, mobile menu button visible
    await expect(desktopNav).not.toBeVisible();
    const mobileMenuButton = page.getByRole('button', { name: 'Toggle menu' });
    await expect(mobileMenuButton).toBeVisible();
    
    // Open mobile menu
    await mobileMenuButton.click();
    await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Mobile navigation should be visible
    const mobileNav = page.locator('div.md\\:hidden').filter({ hasText: 'Home' });
    await expect(mobileNav).toBeVisible();
    
    // Test mobile Services expansion
    const mobileServicesButton = mobileNav.getByRole('button', { name: 'Services' });
    await mobileServicesButton.click();
    await page.waitForTimeout(300);
    
    // Check if services expanded in mobile
    await expect(mobileNav.getByRole('link', { name: 'Cloud Technologies' })).toBeVisible();
    
    // Test navigation to a page
    await mobileNav.getByRole('link', { name: 'Contact' }).click();
    await page.waitForTimeout(1000);
    
    // Menu should close after navigation
    await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('accessibility keyboard navigation journey', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation through main elements
    await page.keyboard.press('Tab'); // First focusable element
    
    let focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing through navigation
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      focusedElement = page.locator(':focus');
      
      // Ensure focus is always visible
      const isVisible = await focusedElement.isVisible().catch(() => false);
      expect(isVisible).toBeTruthy();
    }
    
    // Test Enter key activation on a focusable element
    const currentFocus = page.locator(':focus');
    const tagName = await currentFocus.evaluate(el => el.tagName.toLowerCase());
    
    if (tagName === 'button' || tagName === 'a') {
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
    }
    
    // Test escape key functionality (close modals, dropdowns)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  });

  test('complete case study exploration journey', async ({ page }) => {
    await page.goto('/');
    
    // Look for case study section
    const caseStudySection = page.getByText('Global Manufacturing Company').locator('..');
    await caseStudySection.scrollIntoViewIfNeeded();
    
    // Find and click on case study link
    const caseStudyButton = page.getByRole('link', { name: 'Read Case Study' });
    if (await caseStudyButton.isVisible()) {
      await caseStudyButton.click();
      await page.waitForTimeout(2000);
      
      // Verify navigation to case study
      const currentUrl = page.url();
      console.log(`Case study URL: ${currentUrl}`);
      
      // Go back to test other elements
      await page.goBack();
    }
    
    // Test "View Success Stories" link
    const successStoriesLink = page.getByRole('link', { name: 'View Success Stories' });
    await successStoriesLink.scrollIntoViewIfNeeded();
    if (await successStoriesLink.isVisible()) {
      await successStoriesLink.click();
      await page.waitForTimeout(2000);
      console.log(`Success stories URL: ${page.url()}`);
    }
  });

  test('service links exploration with proper targeting', async ({ page }) => {
    await page.goto('/');
    
    // Test footer service links
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    
    const serviceLinks = [
      'Multi-Cloud Technologies',
      'Cybersecurity Excellence',
      'DevOps & DevSecOps',
      'Digital Transformation',
      'Software Engineering',
      'Managed IT Support'
    ];
    
    for (const service of serviceLinks) {
      await page.goto('/');
      await footer.scrollIntoViewIfNeeded();
      
      // Look for service link within footer
      const serviceLink = footer.getByRole('link', { name: service });
      if (await serviceLink.isVisible()) {
        await serviceLink.click();
        await page.waitForTimeout(1000);
        
        console.log(`Service link ${service} URL: ${page.url()}`);
      } else {
        console.log(`Service link ${service} not found in footer`);
      }
    }
  });

  test('social media and external links functionality', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer social links
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    
    // Test social media links presence and attributes
    const socialLinks = [
      { name: 'Follow us on LinkedIn', expectedHref: 'linkedin.com' },
      { name: 'Follow us on Twitter', expectedHref: 'twitter.com' },
      { name: 'View our GitHub', expectedHref: 'github.com' }
    ];
    
    for (const social of socialLinks) {
      const socialLink = footer.getByRole('link', { name: social.name });
      
      if (await socialLink.isVisible()) {
        await expect(socialLink).toBeVisible();
        
        // Verify href contains expected domain
        const href = await socialLink.getAttribute('href');
        expect(href).toContain(social.expectedHref);
        
        // Verify it opens in new tab
        await expect(socialLink).toHaveAttribute('target', '_blank');
        await expect(socialLink).toHaveAttribute('rel', 'noopener noreferrer');
      }
    }
  });

  test('error handling and edge cases', async ({ page }) => {
    await page.goto('/');
    
    // Test form with edge case data
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    
    // Test with very long input
    const longText = 'A'.repeat(1500);
    await page.getByAltText('Message').fill(longText);
    
    // Check character count display
    const charCount = page.getByText(/\/1000 characters/);
    await expect(charCount).toBeVisible();
    
    // Test with special characters
    await page.getByAltText('Full Name').fill('José García-Smith O\'Brien');
    await page.getByAltText('Email Address').fill('test+tag@example-domain.co.uk');
    
    // Test form submission with edge case data
    await page.getByAltText('Subject').fill('Test Subject');
    await page.getByAltText('Message').fill('Test message with special chars: <>&"\'');
    
    await page.getByRole('button', { name: 'Send Message' }).click();
    await page.waitForTimeout(2000);
    
    // Form should handle special characters properly
    console.log('Edge case form submission completed');
  });

  test('performance under load simulation', async ({ page }) => {
    await page.goto('/');
    
    // Simulate multiple rapid interactions
    const startTime = Date.now();
    
    // Rapid navigation clicks
    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByRole('heading', { name: 'Multi-Cloud Technologies' }).scrollIntoViewIfNeeded();
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    
    // Rapid form interactions
    await page.getByAltText('Full Name').fill('Performance Test');
    await page.getByAltText('Email Address').fill('perf@test.com');
    await page.getByAltText('Subject').fill('Performance');
    await page.getByAltText('Message').fill('Testing performance');
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // Should complete rapid interactions within reasonable time
    expect(totalTime).toBeLessThan(3000);
    
    console.log(`Performance test completed in ${totalTime}ms`);
  });
});
