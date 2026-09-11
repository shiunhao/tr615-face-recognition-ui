import { useEffect, useState } from 'react';

const INSPECTABLE = [
  'button', 'input', 'select', 'textarea', 'label', 'section', 'dialog',
  '[role]', '[aria-label]', '[id]', '.tracking-mode-bar',
  '.presenter-v2-columns', '.audience-columns',
  '.presenter-compact-section', '.audience-card',
  '.presenter-form-row', '.audience-row',
  '.presenter-card-body', '.audience-card-body',
].join(',');

const pct = (value, total) => total > 0 ? `${(value / total * 100).toFixed(1)}%` : '—';
const round = value => Math.round(value * 10) / 10;

function nameOf(node) {
  if (!node) return 'Viewport';
  const aria = node.getAttribute?.('aria-label');
  if (aria) return aria;
  if (node.id) return `#${node.id}`;
  const heading = node.matches?.('section, .audience-card, .presenter-compact-section') ? node.querySelector('h1,h2,h3')?.textContent?.trim() : '';
  if (heading) return heading;
  const text = node.matches?.('button,label') ? node.textContent?.replace(/\s+/g, ' ').trim() : '';
  if (text) return `${node.tagName.toLowerCase()} “${text.slice(0, 34)}${text.length > 34 ? '…' : ''}”`;
  const className = typeof node.className === 'string' ? node.className.trim().split(/\s+/)[0] : '';
  return className ? `.${className}` : node.tagName?.toLowerCase() || 'element';
}

function boxOf(rect) {
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

function inspect(node) {
  if (!node?.isConnected) return null;
  const rect = node.getBoundingClientRect();
  const style = getComputedStyle(node);
  const parent = node.parentElement;
  const parentRect = parent?.getBoundingClientRect() || { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
  const parentStyle = parent ? getComputedStyle(parent) : null;
  const isFlexContainer = style.display === 'flex' || style.display === 'inline-flex';
  const isGridContainer = style.display === 'grid' || style.display === 'inline-grid';
  const parentIsFlex = parentStyle && (parentStyle.display === 'flex' || parentStyle.display === 'inline-flex');

  const flexChildren = isFlexContainer ? [...node.children].filter(child => {
    const childRect = child.getBoundingClientRect();
    return childRect.width > 0 && childRect.height > 0;
  }).map(child => {
    const childRect = child.getBoundingClientRect();
    const childStyle = getComputedStyle(child);
    return {
      name: nameOf(child),
      flex: `${childStyle.flexGrow} / ${childStyle.flexShrink} / ${childStyle.flexBasis}`,
      width: pct(childRect.width, rect.width),
      height: pct(childRect.height, rect.height),
    };
  }) : [];

  return {
    node,
    name: nameOf(node),
    parentName: nameOf(parent),
    rect: boxOf(rect),
    parentRect: boxOf(parentRect),
    widthPercent: pct(rect.width, parentRect.width),
    heightPercent: pct(rect.height, parentRect.height),
    display: style.display,
    position: style.position,
    margin: style.margin,
    padding: style.padding,
    borderRadius: style.borderRadius,
    parentIsFlex,
    parentFlexDirection: parentStyle?.flexDirection,
    flexGrow: style.flexGrow,
    flexShrink: style.flexShrink,
    flexBasis: style.flexBasis,
    isFlexContainer,
    flexDirection: style.flexDirection,
    justifyContent: style.justifyContent,
    alignItems: style.alignItems,
    gap: style.gap,
    flexChildren,
    isGridContainer,
    gridColumns: style.gridTemplateColumns,
    gridRows: style.gridTemplateRows,
  };
}

function DataRow({ label, children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', gap: 8, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}><span style={{ color: '#8294a6' }}>{label}</span><span style={{ color: '#eef7ff', overflowWrap: 'anywhere' }}>{children}</span></div>;
}

export default function LayoutInspector() {
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = 'crosshair';

    const selectElement = event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || target.closest('#aver-layout-inspector, #aver-layout-inspector-toggle')) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const node = target.closest(INSPECTABLE) || target.closest('div') || target;
      setSelection(inspect(node));
    };
    const refresh = () => setSelection(current => current?.node ? inspect(current.node) : current);
    const keyDown = event => { if (event.key === 'Escape') setSelection(null); };
    document.addEventListener('click', selectElement, true);
    window.addEventListener('resize', refresh);
    window.addEventListener('scroll', refresh, true);
    window.addEventListener('keydown', keyDown);
    return () => {
      document.body.style.cursor = previousCursor;
      document.removeEventListener('click', selectElement, true);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('scroll', refresh, true);
      window.removeEventListener('keydown', keyDown);
    };
  }, []);

  const outline = (rect, color, dashed = false) => rect && <div aria-hidden="true" style={{ position: 'fixed', left: Math.max(1, rect.left), top: Math.max(1, rect.top), width: Math.max(0, rect.width - 2), height: Math.max(0, rect.height - 2), boxSizing: 'border-box', border: `${dashed ? 1 : 2}px ${dashed ? 'dashed' : 'solid'} ${color}`, background: dashed ? 'transparent' : `${color}0b`, boxShadow: dashed ? 'none' : `0 0 0 1px #0008, inset 0 0 0 1px #0008`, pointerEvents: 'none' }} />;

  return <div id="aver-layout-inspector" style={{ position: 'fixed', inset: 0, zIndex: 999999, pointerEvents: 'none', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
    {selection ? <>
      {outline(selection.parentRect, '#ffb85c', true)}
      {outline(selection.rect, '#5edfff')}
      <div style={{ position: 'fixed', left: Math.max(4, Math.min(window.innerWidth - 250, selection.rect.left)), top: Math.max(4, selection.rect.top - 26), maxWidth: 246, padding: '3px 7px', borderRadius: 4, border: '1px solid #5edfff', background: 'rgba(6,9,13,.94)', color: '#5edfff', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxShadow: '0 3px 12px #0008' }}>{selection.name}</div>
      <aside aria-label="Selected element layout data" style={{ position: 'fixed', top: 54, right: 12, width: 310, maxHeight: 'calc(100vh - 70px)', overflowY: 'auto', boxSizing: 'border-box', padding: 12, border: '1px solid #5edfff', borderRadius: 7, background: 'rgba(8,12,17,.96)', color: '#eef7ff', fontSize: 10.5, lineHeight: 1.45, boxShadow: '0 12px 34px #000a', pointerEvents: 'auto', scrollbarWidth: 'thin' }}>
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 8, marginBottom: 7 }}><div><strong style={{ display: 'block', color: '#5edfff', fontSize: 12 }}>UI LAYOUT DATA</strong><span style={{ color: '#a9b9c8' }}>Selected: {selection.name}</span></div><button type="button" aria-label="Clear selected layout element" onClick={() => setSelection(null)} style={{ width: 22, height: 22, padding: 0, border: '1px solid #506272', borderRadius: 4, background: '#111820', color: '#dbe7f1', cursor: 'pointer' }}>×</button></div>
        <DataRow label="Parent">{selection.parentName}</DataRow>
        <DataRow label="Size">{round(selection.rect.width)} × {round(selection.rect.height)} px</DataRow>
        <DataRow label="Parent share">W {selection.widthPercent} · H {selection.heightPercent}</DataRow>
        <DataRow label="Display">{selection.display}</DataRow>
        <DataRow label="Position">{selection.position}</DataRow>
        <DataRow label="Margin">{selection.margin}</DataRow>
        <DataRow label="Padding">{selection.padding}</DataRow>
        <DataRow label="Radius">{selection.borderRadius}</DataRow>
        {selection.parentIsFlex && <div style={{ marginTop: 9, padding: 8, border: '1px solid rgba(255,184,92,.36)', borderRadius: 5, background: 'rgba(255,184,92,.06)' }}>
          <strong style={{ color: '#ffb85c' }}>FLEX ITEM</strong>
          <DataRow label="Parent flow">{selection.parentFlexDirection}</DataRow>
          <DataRow label="grow / shrink">{selection.flexGrow} / {selection.flexShrink}</DataRow>
          <DataRow label="basis">{selection.flexBasis}</DataRow>
        </div>}
        {selection.isFlexContainer && <div style={{ marginTop: 9, padding: 8, border: '1px solid rgba(94,223,255,.36)', borderRadius: 5, background: 'rgba(94,223,255,.05)' }}>
          <strong style={{ color: '#5edfff' }}>FLEX CONTAINER</strong>
          <DataRow label="Direction">{selection.flexDirection}</DataRow>
          <DataRow label="Justify">{selection.justifyContent}</DataRow>
          <DataRow label="Align">{selection.alignItems}</DataRow>
          <DataRow label="Gap">{selection.gap}</DataRow>
          {selection.flexChildren.length > 0 && <div style={{ marginTop: 7 }}><strong style={{ color: '#a9b9c8' }}>DIRECT CHILDREN</strong>{selection.flexChildren.map((child, index) => <div key={`${child.name}-${index}`} style={{ marginTop: 5, padding: 6, borderRadius: 4, background: '#101820' }}><div style={{ color: '#fff' }}>{index + 1}. {child.name}</div><div style={{ color: '#8fa6b8' }}>flex {child.flex} · W {child.width} · H {child.height}</div></div>)}</div>}
        </div>}
        {selection.isGridContainer && <div style={{ marginTop: 9, padding: 8, border: '1px solid rgba(198,255,115,.35)', borderRadius: 5, background: 'rgba(198,255,115,.05)' }}><strong style={{ color: '#c6ff73' }}>GRID CONTAINER</strong><DataRow label="Columns">{selection.gridColumns}</DataRow><DataRow label="Rows">{selection.gridRows}</DataRow><DataRow label="Gap">{selection.gap}</DataRow></div>}
        <div style={{ marginTop: 9, color: '#718596' }}>Click another UI element to inspect it. Press Esc to clear.</div>
      </aside>
    </> : <div style={{ position: 'fixed', top: 8, left: '50%', transform: 'translateX(-50%)', padding: '6px 10px', border: '1px solid #5edfff', borderRadius: 5, background: 'rgba(8,12,17,.94)', color: '#dff7ff', fontSize: 10.5, boxShadow: '0 4px 16px #0008' }}>Click a UI element to inspect its size, parent share, and Flex / Grid data.</div>}
  </div>;
}
