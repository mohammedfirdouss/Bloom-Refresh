import { test, expect } from '@playwright/test';

test.describe('Event Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Set up test user session
    await page.goto('/');
  });

  test('should create a new event', async ({ page }) => {
    // Navigate to event creation
    await page.click('text=Create Event');
    
    // Fill out the form
    await page.fill('input[name="title"]', 'Test Event');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.fill('input[name="date"]', '2024-12-31');
    await page.selectOption('select[name="status"]', 'upcoming');
    
    // Upload image
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/test-image.jpg');
    
    // Submit form
    await page.click('button:text("Create Event")');
    
    // Verify success
    await expect(page.locator('text=Event created successfully')).toBeVisible();
    
    // Verify event appears in list
    await page.goto('/dashboard/organizer');
    await expect(page.locator('text=Test Event')).toBeVisible();
  });
}); 