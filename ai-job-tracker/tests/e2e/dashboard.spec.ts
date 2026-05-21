import { test, expect } from '@playwright/test'

test('authenticated user can access dashboard', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByText('Playwright Test User')).toBeVisible()
})

test('kanban board renders columns', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.getByText('Saved').first()).toBeVisible()
  await expect(page.getByText('Applied').first()).toBeVisible()
  await expect(page.getByText('Interview').first()).toBeVisible()
})
