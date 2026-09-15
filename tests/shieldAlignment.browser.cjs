const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const version of ['v1', 'v2', 'v3']) {
      const page = await browser.newPage({ viewport: { width: 1329, height: 920 } });
      await page.goto(`http://127.0.0.1:5174/?version=${version}`);
      await page.getByText('Tracking Settings', { exact: true }).click();
      await page.locator('#aver-trk-tab-presenter').click();
      await page.getByRole('button', { name: 'Set Shield Zone', exact: true }).click();
      const bounds = await page.locator('[aria-label="Edit shield zones"]').boundingBox();
      async function draw(x, y, w, h) {
        await page.mouse.move(bounds.x + x * bounds.width, bounds.y + y * bounds.height);
        await page.mouse.down();
        await page.mouse.move(bounds.x + (x + w) * bounds.width, bounds.y + (y + h) * bounds.height, { steps: 5 });
        await page.mouse.up();
      }
      await draw(.15, .35, .2, .2);
      await draw(.6, .4, .2, .3);
      const bottom = id => page.locator(`[data-shield-zone="${id}"]`).evaluate(node => parseFloat(node.style.top) + parseFloat(node.style.height));
      const other = await page.locator('[data-shield-zone="2"]').boundingBox();
      const handle = await page.getByRole('button', { name: 'Shield Zone 1 se corner', exact: true }).boundingBox();
      await page.mouse.move(handle.x + 7, handle.y + 7);
      await page.mouse.down();
      await page.mouse.move(handle.x + 7, other.y + other.height - 3, { steps: 8 });
      assert.ok(Math.abs(await bottom(1) - await bottom(2)) < .01);
      assert.equal(await page.locator('[data-alignment-axis="y"]').count(), 1);
      await page.keyboard.down('Alt');
      assert.ok(Math.abs(await bottom(1) - await bottom(2)) > .1);
      await page.keyboard.up('Alt');
      assert.ok(Math.abs(await bottom(1) - await bottom(2)) < .01);
      await page.mouse.move(handle.x + 7, other.y + other.height + 25);
      assert.equal(await page.locator('[data-alignment-axis="y"]').count(), 0);
      await page.mouse.move(handle.x + 7, other.y + other.height - 3);
      if (version === 'v2') await page.screenshot({ path: path.join(os.tmpdir(), 's311-shield-alignment.png') });
      await page.mouse.up();
      assert.equal(await page.locator('[data-alignment-axis]').count(), 0);
      assert.ok(Math.abs(await bottom(1) - await bottom(2)) < .01);
      await page.getByRole('region', { name: 'Shield Zone editor' }).getByRole('button', { name: 'Save', exact: true }).click();
      assert.ok(Math.abs(await bottom(1) - await bottom(2)) < .01);
      console.log(`PASS ${version}: bottom snap, dashed guide, immediate Alt override, distance cutoff, release and Save`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
