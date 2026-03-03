import { expect, test } from '@playwright/test';

test('left pane scroll reaches mp4 compare pane', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/ts-scenes/mobjects_basics/basics_layout');
  await expect(page).toHaveURL('/ts-scenes/mobjects_basics/basics_layout');

  const leftScroll = page.getByTestId('ts-left-scroll');
  const mp4Pane = page.getByTestId('mp4-compare-pane');

  await expect(leftScroll).toBeVisible();
  await expect(mp4Pane).toBeVisible();

  const [scrollHeight, clientHeight] = await Promise.all([
    leftScroll.evaluate((el) => el.scrollHeight),
    leftScroll.evaluate((el) => el.clientHeight)
  ]);
  expect(scrollHeight).toBeGreaterThan(clientHeight);

  const initialTop = await leftScroll.evaluate((el) => el.scrollTop);
  await leftScroll.evaluate((el) => {
    el.scrollBy({ top: 600, behavior: 'auto' });
  });

  await expect
    .poll(() => leftScroll.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(initialTop);
});
