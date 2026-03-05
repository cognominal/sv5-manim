import { expect, test } from '@playwright/test';

test('ts scene split layout persists across reload at same viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1360, height: 900 });
  await page.goto('/ts-scenes/mobjects_basics/basics_layout');
  await expect(page).toHaveURL('/ts-scenes/mobjects_basics/basics_layout');

  const mainPane = page.locator(
    'svelte-split-pane[data-pane="ts-main-split"]'
  );
  const codePane = page.locator(
    'svelte-split-pane[data-pane="ts-code-split"]'
  );
  const leftScroll = page.getByTestId('ts-left-scroll');

  await expect(mainPane).toBeVisible();
  await expect(codePane).toBeVisible();
  await expect(leftScroll).toBeVisible();

  const mainDivider = mainPane.locator('> svelte-split-pane-divider');
  const codeDivider = codePane.locator('> svelte-split-pane-divider');

  const leftBefore = await leftScroll.boundingBox();
  expect(leftBefore).not.toBeNull();

  const mainBox = await mainPane.boundingBox();
  expect(mainBox).not.toBeNull();

  await mainDivider.hover();
  await page.mouse.down();
  await page.mouse.move(
    (mainBox?.x ?? 0) + (mainBox?.width ?? 0) * 0.38,
    (mainBox?.y ?? 0) + (mainBox?.height ?? 0) * 0.5
  );
  await page.mouse.up();

  const codeBox = await codePane.boundingBox();
  expect(codeBox).not.toBeNull();

  await codeDivider.hover();
  await page.mouse.down();
  await page.mouse.move(
    (codeBox?.x ?? 0) + (codeBox?.width ?? 0) * 0.5,
    (codeBox?.y ?? 0) + (codeBox?.height ?? 0) * 0.35
  );
  await page.mouse.up();

  const topCodeSection = page.locator(
    'svelte-split-pane[data-pane="ts-code-split"] > ' +
      'svelte-split-pane-section:nth-of-type(1)'
  );
  const leftAfterDrag = await leftScroll.boundingBox();
  const topAfterDrag = await topCodeSection.boundingBox();
  expect(leftAfterDrag).not.toBeNull();
  expect(topAfterDrag).not.toBeNull();

  expect(Math.abs((leftAfterDrag?.width ?? 0) - (leftBefore?.width ?? 0)))
    .toBeGreaterThan(40);

  await page.reload();
  await expect(page).toHaveURL('/ts-scenes/mobjects_basics/basics_layout');
  await expect(leftScroll).toBeVisible();

  const leftAfterReload = await leftScroll.boundingBox();
  const topAfterReload = await topCodeSection.boundingBox();
  expect(leftAfterReload).not.toBeNull();
  expect(topAfterReload).not.toBeNull();

  expect(Math.abs((leftAfterReload?.width ?? 0) - (leftAfterDrag?.width ?? 0)))
    .toBeLessThan(6);
  expect(Math.abs((topAfterReload?.height ?? 0) - (topAfterDrag?.height ?? 0)))
    .toBeLessThan(6);
});
