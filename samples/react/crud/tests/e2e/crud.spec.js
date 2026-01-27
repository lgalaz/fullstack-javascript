import { test, expect } from '@playwright/test';

test('can add, edit, and delete a user', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Name').fill('Marie Curie');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('Marie Curie')).toBeVisible();

  const luisRow = page.getByRole('row', { name: /luis/i });
  await luisRow.getByRole('button', { name: 'Edit' }).click();
  await page.getByLabel('Edit name').fill('Luis Updated');
  await luisRow.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Luis Updated')).toBeVisible();

  const fernandoRow = page.getByRole('row', { name: /fernando/i });
  await fernandoRow.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('Fernando')).not.toBeVisible();
});
