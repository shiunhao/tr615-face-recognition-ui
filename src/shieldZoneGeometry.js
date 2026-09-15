export const MAX_SHIELD_ZONES = 5;
export const MIN_ZONE_SIZE = 1;
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
export function pointInPreview(x, y, bounds) {
  return { x: clamp((x - bounds.left) / bounds.width * 100), y: clamp((y - bounds.top) / bounds.height * 100) };
}
export function rectangleBetween(a, b) {
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), width: Math.abs(a.x - b.x), height: Math.abs(a.y - b.y) };
}
export function resizeZone(zone, corner, point) {
  const right = zone.x + zone.width, bottom = zone.y + zone.height;
  const left = corner.includes('w') ? clamp(point.x, 0, right - MIN_ZONE_SIZE) : zone.x;
  const top = corner.includes('n') ? clamp(point.y, 0, bottom - MIN_ZONE_SIZE) : zone.y;
  const nextRight = corner.includes('e') ? clamp(point.x, left + MIN_ZONE_SIZE, 100) : right;
  const nextBottom = corner.includes('s') ? clamp(point.y, top + MIN_ZONE_SIZE, 100) : bottom;
  return { ...zone, x: left, y: top, width: nextRight - left, height: nextBottom - top };
}
export function moveZone(zone, start, point) {
  return { ...zone, x: clamp(zone.x + point.x - start.x, 0, 100 - zone.width), y: clamp(zone.y + point.y - start.y, 0, 100 - zone.height) };
}
export function nextZoneId(zones) {
  return Array.from({ length: MAX_SHIELD_ZONES }, (_, i) => i + 1).find(id => !zones.some(zone => zone.id === id));
}

// Threshold is in screen pixels, independent of preview size or aspect ratio.
export function alignZone(raw, others, bounds, corner = null, disableSnap = false) {
  let zone = { ...raw };
  const matches = [];
  for (const axis of ['x', 'y']) {
    const size = axis === 'x' ? 'width' : 'height';
    const low = axis === 'x' ? 'w' : 'n';
    const high = axis === 'x' ? 'e' : 's';
    const anchors = corner ? [corner.includes(low) ? 0 : 1] : [0, 1, .5];
    const threshold = 5 / bounds[size] * 100;
    let best = null;
    for (const other of others) {
      if (other.id === raw.id) continue;
      for (const anchor of anchors) for (const target of corner ? [0, 1] : [0, 1, .5]) {
        // Centers align with centers; edges align with edges.
        if ((anchor === .5) !== (target === .5)) continue;
        const value = other[axis] + other[size] * target;
        const delta = value - (raw[axis] + raw[size] * anchor);
        if (Math.abs(delta) > threshold || (best && Math.abs(delta) >= Math.abs(best.delta))) continue;
        const nextStart = corner ? (corner.includes(low) ? raw[axis] + delta : raw[axis]) : raw[axis] + delta;
        const nextSize = corner ? raw[size] + (corner.includes(high) ? delta : -delta) : raw[size];
        if (nextStart < 0 || nextSize < MIN_ZONE_SIZE || nextStart + nextSize > 100) continue;
        best = { axis, value, delta, other, nextStart, nextSize };
      }
    }
    if (best) {
      matches.push(best);
      if (!disableSnap) { zone[axis] = best.nextStart; zone[size] = best.nextSize; }
    }
  }
  const guides = matches.map(({ axis, value, other }) => {
    const cross = axis === 'x' ? 'y' : 'x';
    const size = axis === 'x' ? 'height' : 'width';
    return { axis, value, from: Math.max(0, Math.min(zone[cross], other[cross]) - 1), to: Math.min(100, Math.max(zone[cross] + zone[size], other[cross] + other[size]) + 1) };
  });
  return { zone, guides };
}
