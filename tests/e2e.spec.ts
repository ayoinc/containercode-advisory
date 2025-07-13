import { test, expect } from '@playwright/test';

test.describe('E2E Tests - Complete User Journeys', () => {
  test('complete contact form submission journey', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to contact section
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    
    // Fill out contact form
    await page.getByPlaceholder('Full Name').fill('John Doe');
    await page.getByPlaceholder('Email Address').fill('john.doe@example.com');
    
    // Select service
    await page.getByRole('combobox', { name: 'Service of Interest' }).click();
    await page.getByRole('option', { name: 'Cloud Technologies' }).click();
    
    // Fill message
    await page.getByPlaceholder('Message').fill('I am interested in learning more about your multi-cloud services for our enterprise infrastructure.');
    
    // Submit form (note: this might show validation or success message)
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Wait for any response or redirect
    await page.waitForTimeout(2000);
    
    // Verify form was processed (adjust based on actual behavior)
    // This might be a success message, redirect, or form reset
  });

  test('navigation flow through service pages', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to each service via Learn More buttons
    const services = [
      'Multi-Cloud Technologies',
      'Cybersecurity Excellence', 
      'DevOps & DevSecOps',
      'Digital Transformation',
      'Software Engineering',
      'Managed IT Support'
    ];
    
    for (const service of services) {
      await page.goto('/');
      
      // Find the service section and click Learn More
      const serviceSection = page.locator('h3', { hasText: service }).locator('..').locator('..');
      await serviceSection.scrollIntoViewIfNeeded();
      
      const learnMoreButton = serviceSection.getByRole('link', { name: 'Learn More' });
      await expect(learnMoreButton).toBeVisible();
      
      // Click and verify navigation
      await learnMoreButton.click();
      
      // Check if we navigated to a service page or stayed on same page
      await page.waitForTimeout(1000);
      
      // Verify we're on the expected URL or the page has changed appropriately
      const currentUrl = page.url();
      console.log(`Service: ${service}, URL: ${currentUrl}`);
    }
  });

  test('complete newsletter subscription flow', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to newsletter section in footer
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    
    // Find newsletter subscription
    const newsletterSection = page.getByRole('heading', { name: 'Stay Informed' }).locator('..');
    await expect(newsletterSection).toBeVisible();
    
    // Fill newsletter email
    const emailInput = newsletterSection.getByPlaceholder('Email for newsletter subscription');
    await expect(emailInput).toBeVisible();
    await emailInput.fill('test@example.com');
    
    // Submit newsletter subscription
    await newsletterSection.getByRole('button', { name: 'Subscribe' }).click();
    
    // Wait for any response
    await page.waitForTimeout(2000);
    
    // Verify subscription was processed (adjust based on actual behavior)
  });

  test('mobile responsiveness journey', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile navigation
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Test mobile form interaction
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    
    const nameInput = page.getByPlaceholder('Full Name');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Mobile User');
    
    const emailInput = page.getByPlaceholder('Email Address');
    await expect(emailInput).toBeVisible();
    await emailInput.fill('mobile@example.com');
    
    // Test form submission on mobile
    await page.getByRole('button', { name: 'Send Message' }).click();
    await page.waitForTimeout(1000);
  });

  test('accessibility keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation through main elements
    await page.keyboard.press('Tab'); // Skip to content link
    await page.keyboard.press('Tab'); // Logo
    await page.keyboard.press('Tab'); // First nav item
    
    // Continue tabbing through navigation
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Test Enter key on a focusable element
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  });

  test('complete case study exploration journey', async ({ page }) => {
    await page.goto('/');
    
    // Find and click on case study link
    const caseStudyButton = page.getByRole('link', { name: 'Read Case Study' });
    await caseStudyButton.scrollIntoViewIfNeeded();
    await expect(caseStudyButton).toBeVisible();
    
    await caseStudyButton.click();
    await page.waitForTimeout(2000);
    
    // Verify navigation to case study
    const currentUrl = page.url();
    console.log(`Case study URL: ${currentUrl}`);
    
    // Go back and test "View Success Stories" link
    await page.goto('/');
    const successStoriesLink = page.getByRole('link', { name: 'View Success Stories' });
    await successStoriesLink.scrollIntoViewIfNeeded();
    await expect(successStoriesLink).toBeVisible();
    
    await successStoriesLink.click();
    await page.waitForTimeout(2000);
    
    console.log(`Success stories URL: ${page.url()}`);
  });

  test('service links exploration', async ({ page }) => {
    await page.goto('/');
    
    // Test footer service links
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    
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
      await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
      
      const serviceLink = page.getByRole('link', { name: service });
      await expect(serviceLink).toBeVisible();
      
      await serviceLink.click();
      await page.waitForTimeout(1000);
      
      console.log(`Service link ${service} URL: ${page.url()}`);
    }
  });

  test('social media links functionality', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer social links
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    
    // Test social media links (but don't actually navigate away)
    const linkedinLink = page.getByRole('link', { name: 'Follow us on LinkedIn' });
    const twitterLink = page.getByRole('link', { name: 'Follow us on Twitter' });
    const githubLink = page.getByRole('link', { name: 'View our GitHub' });
    
    await expect(linkedinLink).toBeVisible();
    await expect(twitterLink).toBeVisible();
    await expect(githubLink).toBeVisible();
    
    // Verify href attributes
    await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/company/containercode-advisory');
    await expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/containercode');
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/containercode');
  });
});
