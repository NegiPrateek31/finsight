import { test, expect } from '@playwright/test'

test('authentication flow', async ({ page }: { page: any }) => {
  // Start from homepage
  await page.goto('/')
  
  // Click sign in
  await page.click('text=Sign In')
  
  // Verify on sign in page
  await expect(page).toHaveURL('/auth/signin')
  
  // OAuth buttons should be visible
  await expect(page.locator('text=Continue with GitHub')).toBeVisible()
  await expect(page.locator('text=Continue with Google')).toBeVisible()
})

test('create post flow', async ({ page }: { page: any }) => {
  // Mock authentication
  await page.evaluate(() => {
    window.localStorage.setItem('mock-signed-in', 'true')
  })
  
  await page.goto('/posts/create')
  
  // Fill post form
  await page.fill('input[type="text"]', 'Test Post Title')
  await page.fill('textarea', 'Test post content')
  
  // Upload file
  await page.setInputFiles('input[type="file"]', 'test-files/sample.pdf')
  
  // Submit form
  await page.click('text=Create Post')
  
  // Should redirect to feed
  await expect(page).toHaveURL('/feed')
  
  // New post should be visible
  await expect(page.locator('text=Test Post Title')).toBeVisible()
})