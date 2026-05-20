import { test as base, expect, type Page } from '@playwright/test'

type AuthFixtures = {
  authenticatedPage: Page
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.request.post('http://localhost:3000/api/test/seed')

    await page.goto('/login')
    await page.getByPlaceholder(/you@example.com/i).fill('playwright@test.com')
    await page.getByPlaceholder('••••••••').fill('Playwright1')
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForURL(/\/dashboard/)

    await use(page)
  },
})

export { expect }