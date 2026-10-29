const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const version of ['v4', 'v2']) {
      const page = await browser.newPage({ viewport: { width: 1224, height: 892 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`http://127.0.0.1:5174/?version=${version}&branch=3`);
      await page.locator('#aver-side-menu-tracking').click();
      const panel = page.locator('#aver-trk-tab-content');
      const gesture = () => page.locator('#aver-trk-tab-gesture').click();
      const face = () => page.locator('#aver-trk-tab-face').click();
      const mode = name => page.locator('#aver-sidebar-container').getByRole('radio', { name, exact: true }).click();
      const gestureControl = () => panel.getByRole('combobox', { name: 'Gesture Control', exact: true });
      const faceToggle = page.locator('#aver-tracking-face-enrollment-toggle');
      const faceCaption = faceToggle.locator(':scope > span').first();
      const faceOn = page.locator('#aver-tracking-face-enrollment-on');
      const faceOff = page.locator('#aver-tracking-face-enrollment-off');
      const faceCards = page.locator('[id^="aver-enrolled-face-card-"]');
      const gestureCards = ['tracking', 'fist', 'zoom-in', 'body-size', 'pan-tilt'];
      const enabledGestureCards = {
        off: [],
        tracking: ['tracking', 'fist', 'body-size'],
        ptz: ['fist', 'zoom-in', 'pan-tilt'],
        'tracking-ptz': gestureCards,
      };
      const originalFaceCaptionOpacity = Number(await faceCaption.evaluate(node => getComputedStyle(node).opacity));

      async function assertConfigurationAvailable() {
        assert.equal(await panel.locator('#aver-tracking-feature-unavailable').count(), 0, 'Configuration pages must not have an unavailable overlay');
        assert.equal(await panel.locator('fieldset:disabled').count(), 0, 'Configuration pages must remain editable');
      }
      async function assertGestureMode(value, disabled = false) {
        await assertConfigurationAvailable();
        assert.equal(await gestureControl().isDisabled(), disabled);
        assert.equal(await gestureControl().inputValue(), value);
        assert.equal(await panel.locator('[data-gesture-id]').count(), gestureCards.length);
        for (const id of gestureCards) {
          const card = panel.locator(`[data-gesture-id="${id}"]`);
          const enabled = enabledGestureCards[value].includes(id);
          assert.equal(await card.getAttribute('data-enabled'), String(enabled), `${version}: ${id} availability in ${value}`);
          assert.equal(await card.getAttribute('aria-disabled'), String(!enabled), `${version}: ${id} semantic availability in ${value}`);
        }
        const fist = panel.locator('[data-gesture-id="fist"]');
        const fistTitle = value === 'ptz' ? 'Zoom out' : 'Auto Tracking disable/Zoom out';
        const fistDescription = value === 'ptz'
          ? 'Make a fist beside your face to zoom out.'
          : "Make a fist beside your face to disable Auto Tracking while it's on, otherwise, perform zoom out.";
        assert.equal(await fist.getByText(fistTitle, { exact: true }).isVisible(), true);
        assert.equal(await fist.getByText(fistDescription, { exact: true }).isVisible(), true);
      }
      async function configureAllGestureModes() {
        for (const value of Object.keys(enabledGestureCards)) {
          await gestureControl().selectOption(value);
          await assertGestureMode(value);
        }
      }
      async function assertFaceRuntimeUnavailable() {
        assert.equal(await faceOff.getAttribute('aria-checked'), 'true');
        assert.equal(await faceOn.getAttribute('aria-checked'), 'false');
        assert.equal(await faceOn.getAttribute('aria-disabled'), 'true');
        assert.equal(await faceOff.getAttribute('aria-disabled'), 'true');
        assert.equal(await faceToggle.getAttribute('aria-disabled'), 'true');
        assert.equal(await faceToggle.evaluate(node => getComputedStyle(node).filter.includes('grayscale')), true);
        assert.ok(Number(await faceCaption.evaluate(node => getComputedStyle(node).opacity)) < originalFaceCaptionOpacity, 'The sidebar caption must be dimmed together with the disabled runtime options');
        await faceOn.click({ force: true });
        assert.equal(await faceOff.getAttribute('aria-checked'), 'true', 'Runtime Face Enrollment must stay Off while its configuration remains available');
      }
      async function assertFaceRuntimeAvailable() {
        assert.notEqual(await faceOn.getAttribute('aria-disabled'), 'true');
        assert.notEqual(await faceOff.getAttribute('aria-disabled'), 'true');
        assert.notEqual(await faceToggle.getAttribute('aria-disabled'), 'true');
        assert.equal(await faceOff.getAttribute('aria-checked'), 'true', 'Leaving a conflict must not automatically enable runtime Face Enrollment');
      }
      async function assertPtzUsable() {
        assert.equal(await page.locator('#aver-ptz-zoom-in-button').isEnabled(), true);
        await page.locator('#aver-ptz-zoom-in-button').click();
        assert.equal(await page.locator('#aver-ptz-zoom-out-button').isEnabled(), true);
        assert.equal(await page.locator('#aver-ptz-left-button').isEnabled(), true);
        await page.locator('#aver-ptz-zoom-out-button').click();
        assert.equal(await page.locator('#aver-save-preset-button').isEnabled(), true);
      }
      async function setMicrophone(enabled) {
        await page.locator('#aver-trk-tab-presenter').click();
        if (version === 'v4') {
          const control = panel.getByRole('button', { name: /Handheld Microphone Tracking$/ });
          const checked = (await control.innerText()).includes('✓');
          if (checked !== enabled) await control.click();
        } else {
          await panel.getByRole('group', { name: 'Tracking Target', exact: true }).getByRole('button', { name: enabled ? 'Microphone Holder' : 'Presenter', exact: true }).click();
        }
      }
      async function beginFaceDetection() {
        const resume = page.locator('#aver-face-resume-live-button');
        if (await resume.count()) await resume.click();
        assert.equal(await page.locator('#aver-face-detect-button').isEnabled(), true);
        await page.locator('#aver-face-detect-button').click();
      }
      async function exerciseFaceConfiguration(context) {
        await face();
        await assertConfigurationAvailable();
        await beginFaceDetection();
        await page.locator('#aver-face-add-all-eligible-button').waitFor();
        assert.equal(await page.locator('#aver-face-add-all-eligible-button').isEnabled(), true);
        const before = await faceCards.count();
        await page.locator('#aver-face-box-front-left').click();
        assert.equal(await faceCards.count(), before + 1, 'A detected face must be addable while runtime Face Enrollment is unavailable');
        const newOrder = String(before + 1).padStart(2, '0');
        const newFace = page.locator(`#aver-enrolled-face-card-${newOrder}`);
        const newFaceId = await newFace.getAttribute('data-face-id');
        const name = `${context} configured face`;
        await page.locator(`#aver-enrolled-face-name-${newOrder}`).click();
        await page.locator(`#aver-enrolled-face-name-input-${newOrder}`).fill(name);
        await page.locator(`#aver-enrolled-face-name-input-${newOrder}`).press('Enter');
        assert.equal(await page.locator(`#aver-enrolled-face-name-${newOrder}`).innerText(), name);
        await page.locator('#aver-face-add-all-eligible-button').click();
        const afterAddAll = await faceCards.count();
        assert.ok(afterAddAll > before + 1, 'Add All Faces must remain usable under the conflict');

        // Use real pointer input to verify that configuration reordering is also available.
        await newFace.scrollIntoViewIfNeeded();
        const source = await newFace.boundingBox();
        const target = await page.locator('#aver-enrolled-face-card-02').boundingBox();
        await page.mouse.move(source.x + 30, source.y + 45);
        await page.mouse.down();
        await page.mouse.move(source.x + 38, source.y + 45, { steps: 2 });
        await page.mouse.move(target.x + 30, target.y + 45, { steps: 12 });
        await page.mouse.up();
        assert.equal(await page.locator('#aver-enrolled-face-card-02').getAttribute('data-face-id'), newFaceId, 'Face records must remain reorderable under the conflict');
        assert.equal(await page.locator('#aver-enrolled-face-name-02').innerText(), name);
        await page.locator('#aver-enrolled-face-delete-02').click();
        await page.locator('#aver-face-delete-confirm-button').click();
        assert.equal(await faceCards.count(), afterAddAll - 1, 'Face records must remain deletable under the conflict');
        assert.equal(await page.locator(`[data-face-id="${newFaceId}"]`).count(), 0);
        await assertFaceRuntimeUnavailable();
      }

      // Opening Audience settings must not select its runtime mode or reset Gesture.
      await page.locator('#aver-trk-tab-audience').click();
      await gesture();
      await assertGestureMode('off');
      assert.equal(await gestureControl().getAttribute('id'), 'aver-gesture-control');
      await configureAllGestureModes();
      await page.locator('#aver-trk-tab-audience').click();
      await gesture();
      await assertGestureMode('tracking-ptz');

      // Actual Audience Mode fixes Gesture to Off and disables its selector until the conflict ends.
      for (const value of ['tracking', 'ptz', 'tracking-ptz']) {
        await mode('Presenter');
        await gestureControl().selectOption(value);
        await mode('Audience');
        await assertGestureMode('off', true);
        await mode('Presenter');
        await assertGestureMode('off');
      }
      await gestureControl().selectOption('tracking-ptz');

      // Seed saved faces, then verify that an in-progress detection survives entering Audience Mode.
      await face();
      await beginFaceDetection();
      await page.locator('#aver-face-add-all-eligible-button').waitFor();
      await page.locator('#aver-face-add-all-eligible-button').click();
      const initialFaceCount = await faceCards.count();
      assert.ok(initialFaceCount > 1);
      const storedFaceId = await page.locator('#aver-enrolled-face-card-01').getAttribute('data-face-id');
      await page.locator('#aver-enrolled-face-name-01').click();
      await page.locator('#aver-enrolled-face-name-input-01').fill('Stored presenter');
      await page.locator('#aver-enrolled-face-name-input-01').press('Enter');
      await faceOn.click();
      assert.equal(await faceOn.getAttribute('aria-checked'), 'true');
      await beginFaceDetection();
      await mode('Audience');
      await page.locator('#aver-face-add-all-eligible-button').waitFor();
      assert.ok(await page.locator('[id^="aver-face-box-"]').count() > 0, 'Detection must finish after entering Audience Mode');
      await assertFaceRuntimeUnavailable();
      await assertPtzUsable();
      await exerciseFaceConfiguration('Audience');
      assert.equal(await page.locator(`[data-face-id="${storedFaceId}"]`).locator('[id^="aver-enrolled-face-name-"]').innerText(), 'Stored presenter');
      await page.screenshot({ path: path.join(os.tmpdir(), `tracking-face-configurable-audience-${version}.png`), animations: 'disabled' });
      await gesture();
      await assertGestureMode('off', true);
      await page.screenshot({ path: path.join(os.tmpdir(), `tracking-gesture-off-audience-${version}.png`), animations: 'disabled' });
      await mode('Presenter');
      await assertGestureMode('off');
      await configureAllGestureModes();
      await assertFaceRuntimeAvailable();
      await faceOn.click();
      assert.equal(await faceOn.getAttribute('aria-checked'), 'true');

      // Presenter microphone tracking also keeps face configuration and pending detection available.
      await face();
      await beginFaceDetection();
      await setMicrophone(true);
      await face();
      await page.locator('#aver-face-add-all-eligible-button').waitFor();
      assert.ok(await page.locator('[id^="aver-face-box-"]').count() > 0, 'Detection must finish after enabling microphone tracking');
      await assertFaceRuntimeUnavailable();
      await assertPtzUsable();
      await exerciseFaceConfiguration('Microphone');
      assert.equal(await page.locator(`[data-face-id="${storedFaceId}"]`).locator('[id^="aver-enrolled-face-name-"]').innerText(), 'Stored presenter');
      const configuredFaceCount = await faceCards.count();
      assert.ok(configuredFaceCount > initialFaceCount);
      await gesture();
      await assertGestureMode('off', true);

      // Audience initializes Off even if the microphone conflict was already active.
      await mode('Audience');
      await assertGestureMode('off', true);
      await setMicrophone(false);
      await gesture();
      await assertGestureMode('off', true);
      await assertFaceRuntimeUnavailable();
      await mode('Presenter');
      await assertGestureMode('off');
      await configureAllGestureModes();
      await assertFaceRuntimeAvailable();
      await face();
      assert.equal(await faceCards.count(), configuredFaceCount);
      assert.equal(await page.locator(`[data-face-id="${storedFaceId}"]`).locator('[id^="aver-enrolled-face-name-"]').innerText(), 'Stored presenter');

      // Microphone tracking disables detection editing without changing its saved preset.
      await page.locator('#aver-trk-tab-presenter').click();
      const multiPresenterDetection = panel.getByRole('combobox', { name: 'Multi-Presenter Detection', exact: true });
      const originalDetection = await multiPresenterDetection.inputValue();
      for (const value of ['off', 'preset1', 'preset2']) {
        await multiPresenterDetection.selectOption(value);
        await setMicrophone(true);
        assert.equal(await multiPresenterDetection.inputValue(), value, `${version}: enabling microphone tracking must preserve ${value}`);
        assert.equal(await multiPresenterDetection.isDisabled(), true);
        await setMicrophone(false);
        assert.equal(await multiPresenterDetection.inputValue(), value, `${version}: disabling microphone tracking must preserve ${value}`);
        assert.equal(await multiPresenterDetection.isEnabled(), true);
      }
      await multiPresenterDetection.selectOption(originalDetection);
      assert.deepEqual(errors, []);
      console.log(`${version}: gesture mode matrix, fixed Off and disabled selector under conflicts, face CRUD and detection under conflicts, PTZ availability and saved detection presets passed`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
