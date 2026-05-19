import { test, expect } from './fixtures/auth'

test('authenticated user can access dashboard', async ({ authenticatedPage: page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByText('Playwright Test User')).toBeVisible()
})

test('kanban board renders columns', async ({ authenticatedPage: page }) => {
  await page.goto('/dashboard')
  await expect(page.getByText('Saved')).toBeVisible()
  await expect(page.getByText('Applied')).toBeVisible()
  await expect(page.getByText('Interview')).toBeVisible()
})