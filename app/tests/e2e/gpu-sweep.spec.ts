import { expect, test } from '@playwright/test';

test('gpu sweep route opens GPU preview scenes', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'GPU sweep' }).click();
  await expect(page).toHaveURL('/gpu-sweep');
  await expect(
    page.getByRole('heading', { name: 'GPU Feature Sweep' })
  ).toBeVisible();

  const sceneSelect = page.locator('label:has-text("GPU scenes") select');
  await sceneSelect.selectOption(
    '/ts-scenes/mobjects_basics/basics_layout'
  );
  await expect(page).toHaveURL(
    '/ts-scenes/mobjects_basics/basics_layout?renderer=gpu'
  );

  await expect(
    page.getByRole('button', { name: 'SVG preview' })
  ).toBeVisible();
  await expect(page.getByRole('img', { name: 'TS scene stage' })).toBeVisible();

  await page.goto('/ts-scenes/text_math_tex/text_math?renderer=gpu');
  await expect(page).toHaveURL('/ts-scenes/text_math_tex/text_math?renderer=gpu');
  const gpuStage = page.getByTestId('webgpu-scene-stage');
  await expect
    .poll(async () => gpuStage.getAttribute('data-renderer'))
    .toMatch(/gpu|fallback/);
  const rendererMode = await gpuStage.getAttribute('data-renderer');
  if (rendererMode === 'gpu') {
    await expect(page.getByRole('img', { name: 'TS scene stage' })).toBeVisible();
    await expect
      .poll(async () =>
        page
          .locator(
            '[data-testid="webgpu-scene-stage"] text,' +
            ' [data-testid="webgpu-scene-stage"] image,' +
            ' [data-testid="webgpu-scene-stage"] foreignObject'
          )
          .count()
      )
      .toBe(0);
  }
});
