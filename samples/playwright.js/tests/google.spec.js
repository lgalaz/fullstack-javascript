import { test, expect } from '@playwright/test';

test('searches google for end to end testing', async ({ page }) => {
  await page.goto('https://www.google.com');

  // Google sometimes shows a consent dialog depending on region.
  const consentButton = page.getByRole('button', { name: /accept|agree|i agree|accept all/i });
  if (await consentButton.isVisible().catch(() => false)) {
    await consentButton.click();
  }

  const searchBox = page.getByRole('textbox', { name: /search/i });
  await searchBox.fill('end to end testing');
  await searchBox.press('Enter');

  await expect(page).toHaveURL(/search/);
  await expect(page.getByRole('heading', { name: /end to end testing/i })).toBeVisible();
});
