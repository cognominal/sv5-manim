import { expect, test, type Locator } from '@playwright/test';

function cxFromEllipse(markup: string | null): number {
  const match = markup?.match(/\bcx="([^"]+)"/);
  return match ? Number(match[1]) : Number.NaN;
}

async function readCx(dot: Locator): Promise<number> {
  return cxFromEllipse(await dot.evaluate((node) => node.outerHTML));
}

async function setSliderValue(
  slider: Locator,
  value: number
): Promise<void> {
  await slider.evaluate((node, nextValue) => {
    const input = node as HTMLInputElement;
    input.value = String(nextValue);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

test('rate function scene goes out and back over the animation', async ({
  page,
}) => {
  await page.goto('/ts-scenes/rate_functions_and_timing/timing_demo');
  await expect(page).toHaveURL(
    '/ts-scenes/rate_functions_and_timing/timing_demo'
  );

  const stage = page.getByRole('img', { name: 'TS scene stage' });
  const dot = stage.locator('#dot');
  const slider = page.getByRole('slider', { name: 'Time slider' });
  const timeLabel = page.locator(
    'div.w-32.text-right.text-sm.tabular-nums.text-cyan-300'
  );

  await expect(dot).toHaveCount(1);
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(timeLabel).toContainText('0.00 sec');

  const startCx = await readCx(dot);

  await setSliderValue(slider, 1);
  await expect(timeLabel).toContainText('1.00 sec');
  await expect.poll(() => readCx(dot)).toBeGreaterThan(startCx + 150);
  const midCx = await readCx(dot);

  await setSliderValue(slider, 2);
  await expect(timeLabel).toContainText('2.00 sec');
  await expect.poll(() => readCx(dot)).toBeLessThan(startCx + 5);
  const endCx = await readCx(dot);

  expect(Number.isFinite(startCx)).toBe(true);
  expect(Number.isFinite(midCx)).toBe(true);
  expect(Number.isFinite(endCx)).toBe(true);
  expect(midCx).toBeGreaterThan(startCx + 150);
  expect(Math.abs(endCx - startCx)).toBeLessThan(5);
});
