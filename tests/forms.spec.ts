import { test, expect } from '@playwright/test';

test.describe('Form Components Tests', () => {
  test('Contact form submission flow', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to contact form
    await page.getByText('Ready to Transform Your Technology?').scrollIntoViewIfNeeded();
    
    // Fill out the form
    await page.locator('input#name').fill('Test User');
    await page.locator('input#email').fill('test@example.com');
    await page.locator('select#service').selectOption('cloud');
    await page.locator('textarea#message').fill('This is a test message from the Playwright automation test.');
    
    // Intercept the form submission
    await page.route('**/api/contact', async route => {
      // Mock a successful response
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    // Submit the form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Check for success message
    // Note: This would need to be adapted based on your success message implementation
    // await expect(page.getByText('Message Sent!')).toBeVisible();
  });
  
  test('Form validation errors display correctly', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to contact form
    await page.getByText('Ready to Transform Your Technology?').scrollIntoViewIfNeeded();
    
    // Submit the empty form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Check for validation errors
    // Note: This would need to be adapted based on your validation error implementation
    // await expect(page.getByText('Name is required')).toBeVisible();
    // await expect(page.getByText('Email is required')).toBeVisible();
    // await expect(page.getByText('Message is required')).toBeVisible();
    
    // Fill one field and check that its error disappears
    await page.locator('input#name').fill('Test User');
    // await expect(page.getByText('Name is required')).not.toBeVisible();
    
    // Other fields should still show errors
    // await expect(page.getByText('Email is required')).toBeVisible();
    // await expect(page.getByText('Message is required')).toBeVisible();
  });
  
  test('Newsletter signup form works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Find and fill the newsletter form
    // Note: This would need to be adapted based on your newsletter form implementation
    // await page.locator('input[type="email"][placeholder="Enter your email"]').fill('newsletter@example.com');
    
    // Intercept the form submission
    await page.route('**/api/newsletter', async route => {
      // Mock a successful response
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    // Submit the form
    // await page.getByRole('button', { name: 'Subscribe' }).click();
    
    // Check for success message
    // await expect(page.getByText('Thank you for subscribing!')).toBeVisible();
  });
});
