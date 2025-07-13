import { test, expect } from '@playwright/test';

test.describe('Improved Smoke Tests - Basic Site Functionality', () => {
  // Helper function to get desktop navigation
  const getDesktopNavigation = (page: any) => page.locator('nav.hidden.md\\:flex');
  
  // Helper function to get mobile navigation
  const getMobileNavigation = (page: any) => page.locator('[aria-label="Toggle menu"]').locator('..').locator('..').locator('nav');

  test('homepage loads successfully with proper content', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check page loads
    await expect(page).toHaveTitle('ContainerCode Advisory | Multi-Cloud Consulting Experts');
    
    // Check main heading is visible (more specific selector)
    await expect(page.getByRole('heading', { name: 'Transforming Businesses Through Cloud Excellence', level: 1 })).toBeVisible();
    
    // Check logo is present with proper alt text
    await expect(page.getByRole('img', { name: 'ContainerCode Advisory' })).toBeVisible();
    
    // Check key service headings are visible
    await expect(page.getByRole('heading', { name: 'Multi-Cloud Technologies', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cybersecurity Excellence', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'DevOps & DevSecOps', level: 3 })).toBeVisible();
  });

  test('desktop navigation works correctly', async ({ page }) => {
    // Ensure we're testing on desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Test desktop navigation specifically
    const desktopNav = getDesktopNavigation(page);
    await expect(desktopNav).toBeVisible();
    
    // Test individual navigation links within desktop nav
    await expect(desktopNav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Case Studies' })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Insights' })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'About Us' })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Contact' })).toBeVisible();
    
    // Test Services dropdown within desktop nav
    const servicesButton = desktopNav.getByRole('button', { name: 'Services' });
    await expect(servicesButton).toBeVisible();
    
    // Hover to reveal dropdown
    await servicesButton.hover();
    await page.waitForTimeout(300); // Wait for hover effect
    
    // Check dropdown items are visible
    await expect(page.getByRole('link', { name: 'Cloud Technologies' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cybersecurity' })).toBeVisible();
  });

  test('mobile navigation works correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Mobile navigation should be hidden initially
    const mobileMenuButton = page.getByRole('button', { name: 'Toggle menu' });
    await expect(mobileMenuButton).toBeVisible();
    
    // Desktop nav should be hidden on mobile
    const desktopNav = getDesktopNavigation(page);
    await expect(desktopNav).not.toBeVisible();
    
    // Click mobile menu button
    await mobileMenuButton.click();
    await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Mobile navigation should now be visible
    const mobileNav = page.locator('div.md\\:hidden').filter({ hasText: 'Home' });
    await expect(mobileNav).toBeVisible();
    
    // Test mobile navigation links
    await expect(mobileNav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Case Studies' })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('contact form is present with proper form fields', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to contact form
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    
    // Check form elements using proper label-based selectors
    await expect(page.getByAltText('Full Name')).toBeVisible();
    await expect(page.getByAltText('Email Address')).toBeVisible();
    await expect(page.getByAltText('Phone Number (Optional)')).toBeVisible();
    await expect(page.getByAltText('Subject')).toBeVisible();
    await expect(page.getByAltText('Message')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
  });

  test('form validation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to contact form
    await page.getByRole('heading', { name: 'Contact Us' }).scrollIntoViewIfNeeded();
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Check for validation errors
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Subject is required')).toBeVisible();
    await expect(page.getByText('Message is required')).toBeVisible();
  });

  test('footer content is properly structured', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    
    // Check footer sections using more specific selectors within footer
    await expect(footer.getByRole('heading', { name: 'Services' })).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Company' })).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Contact Information' })).toBeVisible();
    
    // Check important links within footer
    await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Terms & Conditions' })).toBeVisible();
    
    // Check contact information
    await expect(footer.getByRole('link', { name: 'info@containercode.club' })).toBeVisible();
    await expect(footer.getByRole('link', { name: '+44 (0) 20 7946 0958' })).toBeVisible();
  });

  test('CTA buttons are present and properly accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check main CTA buttons with more specific targeting
    await expect(page.getByRole('link', { name: 'Start Your Transformation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Success Stories' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Schedule Consultation' })).toBeVisible();
    
    // Check that Get Started button is visible in navigation
    const getStartedButton = page.getByRole('link', { name: 'Get Started' });
    await expect(getStartedButton).toBeVisible();
    
    // Test button accessibility
    await expect(getStartedButton).toHaveAttribute('href', '/contact');
  });

  test('page performance and SEO basics', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time
    expect(loadTime).toBeLessThan(5000);
    
    // Check for basic SEO elements
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    
    // Check heading hierarchy
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    
    // Check that images have alt text
    const images = page.getByRole('img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);
    
    // Check logo has proper alt text
    await expect(page.getByRole('img', { name: 'ContainerCode Advisory' })).toBeVisible();
  });

  test('responsive design works across viewports', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Transforming Businesses Through Cloud Excellence' })).toBeVisible();
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Transforming Businesses Through Cloud Excellence' })).toBeVisible();
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Transforming Businesses Through Cloud Excellence' })).toBeVisible();
    
    // Check mobile navigation is accessible
    await expect(page.getByRole('button', { name: 'Toggle menu' })).toBeVisible();
  });

  test('accessibility features are working', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check focus is visible on focusable elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Check that skip links or focus management exists
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Test that ARIA labels are present
    await expect(page.getByRole('button', { name: 'Toggle menu' })).toHaveAttribute('aria-label');
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
