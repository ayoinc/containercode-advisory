import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('Desktop navigation shows all links', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 800 });
    
    await page.goto('/');
    
    // Check if main navigation links are visible
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByText('Services')).toBeVisible();
    await expect(page.getByText('Case Studies')).toBeVisible();
    await expect(page.getByText('Blog')).toBeVisible();
    await expect(page.getByText('About')).toBeVisible();
    await expect(page.getByText('Contact')).toBeVisible();
    
    // Hover over services to check dropdown
    await page.locator('text=Services').hover();
    
    // Wait for dropdown animation
    await page.waitForTimeout(300);
    
    // Check if services dropdown is visible
    await expect(page.getByText('Cloud Technologies')).toBeVisible();
    await expect(page.getByText('Cybersecurity')).toBeVisible();
    await expect(page.getByText('DevOps & DevSecOps')).toBeVisible();
  });
  
  test('Mobile navigation works correctly', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check if mobile menu button is visible
    const menuButton = page.getByRole('button', { name: 'Toggle menu' });
    await expect(menuButton).toBeVisible();
    
    // Open mobile menu
    await menuButton.click();
    
    // Check if menu items are visible
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByText('Services')).toBeVisible();
    await expect(page.getByText('Case Studies')).toBeVisible();
    await expect(page.getByText('Blog')).toBeVisible();
    await expect(page.getByText('About')).toBeVisible();
    await expect(page.getByText('Contact')).toBeVisible();
    
    // Close menu
    await menuButton.click();
    
    // Check if menu is closed
    await expect(page.getByRole('link', { name: 'Home' })).not.toBeVisible();
  });
  
  test('Header changes on scroll', async ({ page }) => {
    await page.goto('/');
    
    // Check initial header state
    const header = page.locator('header');
    const initialClass = await header.getAttribute('class');
    expect(initialClass).toContain('bg-transparent');
    
    // Scroll down
    await page.evaluate(() => {
      window.scrollTo(0, 100);
    });
    
    // Wait for header transition
    await page.waitForTimeout(400);
    
    // Check header state after scroll
    const scrolledClass = await header.getAttribute('class');
    expect(scrolledClass).toContain('bg-white/90');
  });
});
