import { test, expect } from '@playwright/test'

test('register page loads', async ({ page }) => {
  await page.goto('/register')
  await expect(page.getByText('Create an account')).toBeVisible()
  await expect(page.getByPlaceholder('Your Name')).toBeVisible()
  await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
})

test('shows validation errors on empty submit', async ({ page }) => {
  await page.goto('/register')
  await page.getByRole('button', { name: /create account/i }).click()
  await expect(page.getByText('Name is required')).toBeVisible()
  await expect(page.getByText('Email is required')).toBeVisible()
  await expect(page.getByText('Password must be at least 8 characters')).toBeVisible()
})

test('shows password mismatch error', async ({ page }) => {
  await page.goto('/register')
  await page.getByPlaceholder('Your Name').fill('Theju')
  await page.getByPlaceholder(/you@example.com/i).fill('theju@example.com')
  const passwordFields = page.getByPlaceholder('••••••••')
  await passwordFields.first().fill('Password1')
  await passwordFields.last().fill('Password2')
  await page.getByRole('button', { name: /create account/i }).click()
  await expect(page.getByText('Password do not match')).toBeVisible()
})

test('navigates to login from register page', async ({ page }) => {
  await page.goto('/register')
  await page.getByRole('link', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/login/)
})