import { expect, test } from '@playwright/test';

test('ts sweep route and ts scene rendering work from top nav', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'ts sweep' }).click();
  await expect(page).toHaveURL('/ts-sweep');
  await expect(
    page.getByRole('heading', { name: 'TS-Based Feature Sweep' })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Toggle to regular scenes' })
  ).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Toggle to TS scenes' })
  ).toHaveCount(0);

  const tsSelect = page.locator('label:has-text("TS scenes") select');
  await tsSelect.selectOption('/ts-scenes/regression_golden_frames/golden_seed');
  await expect(page).toHaveURL('/ts-scenes/regression_golden_frames/golden_seed');

  await page.getByRole('link', { name: 'ts sweep' }).click();
  await page
    .getByRole('link', { name: '01 Mobjects Basics / Basics Layout' })
    .click();
  await expect(page).toHaveURL('/ts-scenes/mobjects_basics/basics_layout');

  const stage = page.getByRole('img', { name: 'TS scene stage' });
  await expect(stage).toBeVisible();

  const title = stage.locator('#title');
  const square = stage.locator('#square');
  const circle = stage.locator('#circle');
  const mode = page.locator('#mode');
  const slider = page.getByLabel('Time slider');

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(mode).toHaveValue('normal');
  await expect(title).toHaveCount(0);
  await expect(square).toHaveCount(0);
  await expect(circle).toHaveCount(0);

  await slider.fill('720');
  await expect(mode).toHaveValue('time-wrap');
  await expect(title).toHaveCount(1);
  await expect(square).toHaveCount(0);
  await expect(circle).toHaveCount(0);

  await slider.fill('850');
  await expect(title).toHaveCount(1);
  await expect(square).toHaveCount(0);
  await expect(circle).toHaveCount(0);

  await slider.fill('1710');
  await expect(square).toHaveCount(1);
  await expect(circle).toHaveCount(1);

  await slider.fill('2000');
  await expect(circle).toHaveCount(1);

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(mode).toHaveValue('normal');
  await expect(title).toHaveCount(0);
});
