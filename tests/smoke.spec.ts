import { test, expect } from '@playwright/test';

test.describe('ContainerCode Advisory Website Smoke Tests', () => {
  test('Homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Verify page title
    const title = await page.title();
    expect(title).toContain('ContainerCode Advisory');
    
    // Verify hero section
    await expect(page.locator('h1')).toContainText('Cloud Excellence');
    
    // Verify navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Verify services section
    await expect(page.getByText('Comprehensive Technology Consulting')).toBeVisible();
    
    // Verify feature section
    await expect(page.getByText('Why Choose ContainerCode Advisory?')).toBeVisible();
    
    // Verify case studies section
    await expect(page.getByText('Client Success Stories')).toBeVisible();
    
    // Verify testimonials
    await expect(page.getByText('What Our Clients Say')).toBeVisible();
    
    // Verify CTA section
    await expect(page.getByText('Ready to Transform Your Technology?')).toBeVisible();
    
    // Verify footer
    await expect(page.locator('footer')).toBeVisible();
  });
  
  test('Navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test theme toggle
    const themeButton = page.getByRole('button', { name: 'Toggle theme' });
    await themeButton.click();
    
    // Check if mobile menu opens on small screens
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      const menuButton = page.getByRole('button', { name: 'Toggle menu' });
      await menuButton.click();
      await expect(page.getByRole('navigation').getByText('Services')).toBeVisible();
    }
  });
  
  test('Form validation works on contact form', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to contact form
    await page.getByText('Ready to Transform Your Technology?').scrollIntoViewIfNeeded();
    
    // Try to submit form without filling required fields
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Form should not be submitted and validation messages should be displayed
    // Note: This test would need to be adapted based on your validation implementation
  });
  
  test('Theme toggle works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test dark mode
    const themeButton = page.getByRole('button', { name: 'Toggle theme' });
    await themeButton.click();
    
    // Check for dark mode classes
    const darkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    
    expect(darkMode).toBeTruthy();
    
    // Switch back to light mode
    await themeButton.click();
    
    // Check for light mode
    const lightMode = await page.evaluate(() => {
      return !document.documentElement.classList.contains('dark');
    });
    
    expect(lightMode).toBeTruthy();
  });
});
