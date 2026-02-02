import { test, expect } from '@playwright/test';

test('creates company and blocks invalid task relationship', async ({ page }) => {
  await page.goto('/');

  const companiesPanel = page.getByTestId('companies-panel');
  await companiesPanel.locator('input[placeholder="Company name"]').fill('Atlas Dynamics');
  await companiesPanel.locator('input[placeholder="company.example"]').fill('atlas.example');
  await companiesPanel.locator('input[type="number"]').first().fill('55');
  await companiesPanel.getByRole('button', { name: 'Create company' }).click();

  await expect(companiesPanel.getByRole('cell', { name: 'Atlas Dynamics' })).toBeVisible();

  const taskPanel = page.getByTestId('tasks-panel');
  await taskPanel.locator('input').first().fill('Cross-company invalid task');
  await taskPanel.locator('select').nth(0).selectOption('prj_1');
  await taskPanel.locator('select').nth(1).selectOption('usr_3');
  await taskPanel.locator('select').nth(2).selectOption('high');
  await taskPanel.locator('select').nth(3).selectOption('todo');
  await taskPanel.locator('input[type="number"]').fill('8');
  await taskPanel.locator('input[type="date"]').fill('2026-03-10');

  await page.getByRole('button', { name: 'Create task' }).click();

  await expect(page.getByTestId('notice')).toHaveText(
    'Task assignee must belong to the same company as the project.'
  );
});
