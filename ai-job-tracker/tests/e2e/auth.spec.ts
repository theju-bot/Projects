import { test, expect } from '@playwright/test'

test('sign in page loads', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByText('Welcome Back')).toBeVisible()
  await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible()
})

test('redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})