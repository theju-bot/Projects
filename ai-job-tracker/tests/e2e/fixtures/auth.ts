import { test as base, expect, type Page } from '@playwright/test'

type AuthFixtures = {
  authenticatedPage: Page
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.request.post('http://localhost:3000/api/test/seed')
    const seedResponse = await page.request.post('/api/test/seed')
    if (!seedResponse.ok()) {
      const body = await seedResponse.text()
      throw new Error(`Seed failed (${seedResponse.status()}): ${body}`)
    }

    await page.goto('/login')
    await page.getByPlaceholder(/you@example.com/i).fill('playwright@test.com')
    await page.getByPlaceholder('••••••••').fill('Playwright1')
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForURL(/\/dashboard/)

    await use(page)
  },
})

export { expect }
