# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> authenticated user can access dashboard
- Location: tests/e2e/dashboard.spec.ts:3:5

# Error details

```
SyntaxError: Unexpected end of JSON input
```

# Test source

```ts
  1  | import { test as base, expect, type Page } from '@playwright/test'
  2  | 
  3  | type AuthFixtures = {
  4  |   authenticatedPage: Page
  5  | }
  6  | 
  7  | export const test = base.extend<AuthFixtures>({
  8  |   authenticatedPage: async ({ page }, use) => {
  9  |     const res = await page.request.post('http://localhost:3000/api/test/session')
> 10 |     const { token } = await res.json()
     |                       ^ SyntaxError: Unexpected end of JSON input
  11 | 
  12 |     await page.context().addCookies([
  13 |       {
  14 |         name: 'better-auth.session_token',
  15 |         value: token,
  16 |         domain: 'localhost',
  17 |         path: '/',
  18 |         httpOnly: true,
  19 |         sameSite: 'Lax',
  20 |       },
  21 |     ])
  22 | 
  23 |     await use(page)
  24 |   },
  25 | })
  26 | 
  27 | export { expect }
```