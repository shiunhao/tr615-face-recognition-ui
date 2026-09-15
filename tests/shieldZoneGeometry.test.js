import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pointInPreview, rectangleBetween, resizeZone, moveZone, nextZoneId, alignZone } from '../src/shieldZoneGeometry.js';

test('drawing in either direction produces the same rectangle', () => {
  const a = { x: 10, y: 30 }, b = { x: 70, y: 90 };
  assert.deepEqual(rectangleBetween(a, b), rectangleBetween(b, a));
  assert.deepEqual(rectangleBetween(a, b), { x: 10, y: 30, width: 60, height: 60 });
});
test('coordinates scale with the preview and stop at its boundaries', () => {
  assert.deepEqual(pointInPreview(500, -10, { left: 100, top: 100, width: 200, height: 100 }), { x: 100, y: 0 });
  assert.deepEqual(pointInPreview(200, 150, { left: 100, top: 100, width: 200, height: 100 }), { x: 50, y: 50 });
});
test('four corner resizing preserves opposite corner and cannot invert or escape', () => {
  const zone = { id: 1, x: 20, y: 20, width: 30, height: 30 };
  for (const corner of ['nw', 'ne', 'sw', 'se']) {
    for (const point of [{ x: -20, y: -20 }, { x: 120, y: 120 }]) {
      const resized = resizeZone(zone, corner, point);
      assert.ok(resized.x >= 0 && resized.y >= 0 && resized.width >= 1 && resized.height >= 1);
      assert.ok(resized.x + resized.width <= 100 && resized.y + resized.height <= 100);
      assert.equal(corner.includes('w') ? resized.x + resized.width : resized.x, corner.includes('w') ? 50 : 20);
      assert.equal(corner.includes('n') ? resized.y + resized.height : resized.y, corner.includes('n') ? 50 : 20);
    }
  }
});
test('moving preserves size and stays in the preview', () => {
  assert.deepEqual(moveZone({ id: 2, x: 10, y: 20, width: 30, height: 40 }, { x: 0, y: 0 }, { x: 200, y: -200 }), { id: 2, x: 70, y: 0, width: 30, height: 40 });
});
test('five-zone limit and deleted name reuse', () => {
  assert.equal(nextZoneId([{ id: 1 }, { id: 3 }]), 2);
  assert.equal(nextZoneId([1, 2, 3, 4, 5].map(id => ({ id }))), undefined);
});

test('bottom resizing snaps precisely to another bottom and spans both zones', () => {
  const raw = { id: 1, x: 10, y: 20, width: 20, height: 39.4 };
  const other = { id: 2, x: 60, y: 40, width: 20, height: 20 };
  const result = alignZone(raw, [raw, other], { width: 1000, height: 500 }, 'se');
  assert.equal(result.zone.y + result.zone.height, 60);
  assert.equal(result.zone.y, 20);
  assert.deepEqual(result.guides, [{ axis: 'y', value: 60, from: 9, to: 81 }]);
  assert.deepEqual(alignZone(raw, [other], { width: 1000, height: 500 }, 'se', true).zone, raw);
  assert.equal(alignZone(raw, [other], { width: 1000, height: 1000 }, 'se').guides.length, 0);
});

test('movement matches centers, preserves size, and picks nearest guide per axis', () => {
  const raw = { id: 1, x: 20.3, y: 30.4, width: 20, height: 20 };
  const other = { id: 2, x: 10, y: 20, width: 40, height: 40 };
  const result = alignZone(raw, [other], { width: 1000, height: 1000 });
  assert.equal(result.zone.x, 20);
  assert.equal(result.zone.y, 30);
  assert.equal(result.zone.width, 20);
  assert.equal(result.guides.length, 2);
});

test('resizing never snaps a stationary edge or breaks preview constraints', () => {
  const raw = { id: 1, x: 10, y: 10, width: 20, height: 20 };
  const other = { id: 2, x: 10.1, y: 10.1, width: 40, height: 40 };
  assert.equal(alignZone(raw, [other], { width: 500, height: 500 }, 'se').guides.length, 0);
  const edge = { id: 3, x: 0, y: 0, width: 100, height: 100 };
  const result = alignZone(edge, [other], { width: 500, height: 500 });
  assert.deepEqual(result.zone, edge);
});
