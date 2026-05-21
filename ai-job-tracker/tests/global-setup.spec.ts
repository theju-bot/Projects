import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

setup('seed database and authenticate', async ({ request, page }) => {
  const seedResponse = await request.post(`${BASE_URL}/api/test/seed`, {
    headers: { 'x-test-secret': process.env.TEST_SECRET! },
  })
  if (!seedResponse.ok()) {
    const body = await seedResponse.text()
    throw new Error(`Seed failed (${seedResponse.status()}): ${body}`)
  }

  await page.goto('/login')
  await page.getByPlaceholder(/you@example.com/i).fill('playwright@test.com')
  await page.getByPlaceholder('••••••••').fill('Playwright1')
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL(/\/dashboard/)

  await page.context().storageState({ path: authFile })
})