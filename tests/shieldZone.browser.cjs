// Run with PLAYWRIGHT_MODULE pointing to an installed Playwright module, or install Playwright locally.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const version of ['v1', 'v2', 'v3']) for (const mode of ['Presenter', 'Audience']) {
      const page = await browser.newPage({ viewport: { width: 1329, height: 920 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`http://127.0.0.1:5174/?version=${version}`);
      await page.getByText('Tracking Settings', { exact: true }).click();
      await page.locator('#aver-trk-tab-bar').getByRole('button', { name: mode, exact: true }).click();
      const effective = page.getByRole('checkbox', { name: 'Effective Tracking Area', exact: true }).locator('..').locator('..');
      const setShield = () => page.getByRole('button', { name: 'Set Shield Zone', exact: true }).click();
      const editor = page.getByRole('region', { name: 'Shield Zone editor' });
      const zones = page.locator('[data-shield-zone]');
      const shape = () => zones.evaluateAll(nodes => nodes.map(node => ({ id: node.dataset.shieldZone, left: node.style.left, top: node.style.top, width: node.style.width, height: node.style.height })));
      async function draw(x, y, w, h) {
        const box = await page.locator('[aria-label="Edit shield zones"]').boundingBox();
        await page.mouse.move(box.x + x * box.width, box.y + y * box.height);
        await page.mouse.down();
        await page.mouse.move(box.x + (x + w) * box.width, box.y + (y + h) * box.height, { steps: 8 });
        await page.mouse.up();
      }
      // Switching away from an effective-area draft discards it.
      await effective.getByRole('button', { name: 'Set', exact: true }).click();
      const polygon = page.locator('[aria-label="Edit tracking area"] polygon');
      const original = await polygon.getAttribute('points');
      await page.getByRole('button', { name: 'Tracking area point 1', exact: true }).press('ArrowRight');
      assert.notEqual(await polygon.getAttribute('points'), original);
      await setShield();
      assert.equal(await polygon.count(), 0);
      await effective.getByRole('button', { name: 'Set', exact: true }).click();
      assert.equal(await editor.count(), 0);
      assert.equal(await polygon.getAttribute('points'), original);
      await setShield();
      if (version === 'v2' && mode === 'Presenter') {
        // In-flight thumbnail saves must not commit after ownership changes.
        await effective.getByRole('button', { name: 'Set', exact: true }).click();
        await page.getByRole('button', { name: 'Tracking area point 1', exact: true }).press('ArrowRight');
        await page.evaluate(() => {
          const decode = HTMLImageElement.prototype.decode;
          HTMLImageElement.prototype.decode = async function () {
            await new Promise(resolve => setTimeout(resolve, 500));
            return decode.call(this);
          };
        });
        await effective.getByRole('button', { name: 'Save', exact: true }).click();
        await setShield();
        await page.waitForTimeout(650);
        assert.equal(await effective.locator('img').count(), 0);
        await effective.getByRole('button', { name: 'Set', exact: true }).click();
        assert.equal(await polygon.getAttribute('points'), original);
        await setShield();
      }
      // Reverse drawing, five-zone limit, and handles.
      await draw(.24, .48, -.16, -.16);
      await draw(.40, .32, .16, .16);
      await draw(.72, .32, .16, .16);
      await draw(.08, .70, .16, .16);
      await draw(.40, .70, .16, .16);
      assert.equal(await zones.count(), 5);
      assert.equal(await page.getByRole('button', { name: /Shield Zone \d (nw|ne|sw|se) corner/ }).count(), 20);
      await draw(.72, .70, .16, .16);
      assert.equal(await zones.count(), 5);
      assert.match(await editor.innerText(), /Maximum 5/);
      await editor.getByRole('button', { name: 'Delete selected', exact: true }).click();
      assert.equal(await zones.count(), 4);
      await draw(.40, .70, .16, .16);
      const saved = await shape();
      await editor.getByRole('button', { name: 'Save', exact: true }).click();
      assert.equal(await editor.count(), 0);
      assert.equal(await page.getByRole('checkbox', { name: 'Shield Zone', exact: true }).isChecked(), true);
      assert.deepEqual(await shape(), saved);
      // Toggle off/on keeps saved data.
      await page.getByRole('checkbox', { name: 'Shield Zone', exact: true }).uncheck();
      assert.equal(await zones.count(), 0);
      await page.getByRole('checkbox', { name: 'Shield Zone', exact: true }).check();
      assert.deepEqual(await shape(), saved);
      // Resize by mouse; Cancel restores saved dimensions.
      await setShield();
      const handle = await page.getByRole('button', { name: 'Shield Zone 1 se corner', exact: true }).boundingBox();
      await page.mouse.move(handle.x + 7, handle.y + 7);
      await page.mouse.down(); await page.mouse.move(handle.x + 28, handle.y + 20, { steps: 5 }); await page.mouse.up();
      assert.notDeepEqual(await shape(), saved);
      await editor.getByRole('button', { name: 'Cancel', exact: true }).click();
      assert.deepEqual(await shape(), saved);
      // Clear during editing is also a draft; switching editor discards it.
      await setShield();
      await page.getByRole('button', { name: 'Clear Shield Zones', exact: true }).click();
      assert.equal(await zones.count(), 0);
      await effective.getByRole('button', { name: 'Set', exact: true }).click();
      await setShield();
      assert.deepEqual(await shape(), saved);
      // Navigation cancels a draft, but keeps saved data in the parent panel.
      assert.equal(await editor.getByRole('button', { name: 'Delete selected', exact: true }).isDisabled(), true);
      await page.locator('#aver-trk-tab-bar').getByRole('button', { name: mode === 'Presenter' ? 'Audience' : 'Presenter', exact: true }).click();
      assert.equal(await editor.count(), 0);
      await page.locator('#aver-trk-tab-bar').getByRole('button', { name: mode, exact: true }).click();
      assert.deepEqual(await shape(), saved);
      await setShield();
      if (version === 'v2' && mode === 'Presenter') {
        await page.screenshot({ path: path.join(os.tmpdir(), 's311-shield-zones.png') });
        await page.setViewportSize({ width: 957, height: 920 });
        assert.deepEqual(await shape(), saved);
        await page.screenshot({ path: path.join(os.tmpdir(), 's311-shield-zones-narrow.png') });
      }
      await page.keyboard.press('Escape');
      assert.equal(await editor.count(), 0);
      await page.getByRole('button', { name: 'Clear Shield Zones', exact: true }).click();
      assert.equal(await zones.count(), 0);
      assert.equal(await page.getByRole('checkbox', { name: 'Shield Zone', exact: true }).isChecked(), false);
      assert.deepEqual(errors, []);
      console.log(`PASS ${version} ${mode}: draw, limit, resize, save, cancel, toggle, clear, editor switching, navigation`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
