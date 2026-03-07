import { expect, test } from '@playwright/test';

test('axes plotting scene renders ticks, labels, and graph', async ({
  page,
}) => {
  await page.goto('/ts-scenes/axes_graphs_and_plotting/axes_plot');
  await expect(page).toHaveURL('/ts-scenes/axes_graphs_and_plotting/axes_plot');

  const stage = page.getByRole('img', { name: 'TS scene stage' });
  await expect(stage).toBeVisible();

  await page.getByRole('button', { name: 'Reset' }).click();

  await expect(stage.locator('#axes_x')).toHaveCount(1);
  await expect(stage.locator('#axes_y')).toHaveCount(1);
  await expect(stage.locator('#axes_x_tick_-4')).toHaveCount(1);
  await expect(stage.locator('#axes_x_label_-4')).toHaveCount(1);
  await expect(stage.locator('#axes_y_tick_6')).toHaveCount(1);
  await expect(stage.locator('#axes_y_label_6')).toHaveCount(1);
  await expect(stage.locator('#graph')).toHaveCount(1);
});
