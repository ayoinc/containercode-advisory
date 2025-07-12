import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1280, height: 800, name: 'Desktop' },
    { width: 1920, height: 1080, name: 'Large Desktop' }
  ];
  
  for (const viewport of viewports) {
    test(`Homepage looks correct on ${viewport.name}`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      await page.goto('/');
      
      // Take a screenshot of the full page
      await page.screenshot({ 
        path: `./tests/screenshots/${viewport.name.toLowerCase()}-homepage.png`,
        fullPage: true 
      });
      
      // Specific responsive checks
      if (viewport.width < 768) {
        // Mobile checks
        await expect(page.getByRole('button', { name: 'Toggle menu' })).toBeVisible();
        await expect(page.locator('nav').getByText('Home')).not.toBeVisible();
      } else {
        // Desktop checks
        await expect(page.getByRole('button', { name: 'Toggle menu' })).not.toBeVisible();
        await expect(page.locator('nav').getByText('Home')).toBeVisible();
      }
      
      // Check for proper grid layout in services section
      const servicesSection = page.getByText('Comprehensive Technology Consulting').locator('..').locator('..');
      await servicesSection.scrollIntoViewIfNeeded();
      
      const serviceCards = servicesSection.locator('.card');
      const count = await serviceCards.count();
      expect(count).toBeGreaterThan(0);
      
      // Check specific section layouts based on viewport
      if (viewport.width >= 1024) {
        // Desktop: 3 cards per row
        await expect(servicesSection.locator('.grid')).toHaveClass(/grid-cols-3/);
      } else if (viewport.width >= 768) {
        // Tablet: 2 cards per row
        await expect(servicesSection.locator('.grid')).toHaveClass(/grid-cols-2/);
      } else {
        // Mobile: 1 card per row
        await expect(servicesSection.locator('.grid')).toHaveClass(/grid-cols-1/);
      }
    });
  }
});
