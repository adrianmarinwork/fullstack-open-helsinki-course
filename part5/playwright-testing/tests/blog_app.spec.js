const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    const title = page.getByText('Log in to application');
    expect(title).toBeDefined();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // ...
    });

    test('fails with wrong credentials', async ({ page }) => {
      // ...
    });
  });
});
