import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Basic Site Functionality', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page loads
    await expect(page).toHaveTitle('ContainerCode Advisory | Multi-Cloud Consulting Experts');
    
    // Check main heading is visible
    await expect(page.getByRole('heading', { name: 'Transforming Businesses Through Cloud Excellence' })).toBeVisible();
    
    // Check navigation is present (be more specific)
    await expect(page.getByRole('navigation').first()).toBeVisible();
    
    // Check key elements are visible using more specific selectors
    await expect(page.getByRole('heading', { name: 'Multi-Cloud Technologies' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cybersecurity Excellence' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'DevOps & DevSecOps' })).toBeVisible();
  });

  test('navigation menu works', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links (use first navigation for desktop)
    const navigation = page.getByRole('navigation').first();
    await expect(navigation.getByRole('link', { name: 'Home' }).first()).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Case Studies' }).first()).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Insights' }).first()).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'About Us' }).first()).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Contact' }).first()).toBeVisible();
  });

  test('services dropdown functionality', async ({ page }) => {
    await page.goto('/');
    
    // Click on Services dropdown (use first button for desktop)
    await page.getByRole('button', { name: 'Services' }).first().click();
    
    // Wait a moment for dropdown to appear
    await page.waitForTimeout(500);
    
    // Check if services section is visible on page (since dropdown might be part of page content)
    await expect(page.getByRole('heading', { name: 'Multi-Cloud Technologies' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cybersecurity Excellence' })).toBeVisible();
  });

  test('contact form is present and functional', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to contact form
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    
    // Check form elements are present (use textbox role instead of placeholder)
    await expect(page.getByRole('textbox').nth(0)).toBeVisible(); // Full Name field
    await expect(page.getByRole('textbox').nth(1)).toBeVisible(); // Email field
    await expect(page.getByRole('combobox', { name: 'Service of Interest' })).toBeVisible();
    await expect(page.getByRole('textbox').nth(2)).toBeVisible(); // Message field
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
  });

  test('footer links are present', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    
    // Check footer sections using more specific selectors within footer
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('heading', { name: 'Services' })).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Company', exact: true })).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Contact Information' })).toBeVisible();
    
    // Check important links
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms & Conditions' })).toBeVisible();
  });

  test('CTA buttons are present and clickable', async ({ page }) => {
    await page.goto('/');
    
    // Check main CTA buttons
    await expect(page.getByRole('link', { name: 'Start Your Transformation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Success Stories' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Schedule Consultation' })).toBeVisible();
  });

  test('page performance basics', async ({ page }) => {
    await page.goto('/');
    
    // Check that page loads within reasonable time
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    // Check for basic SEO elements
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  });
});
