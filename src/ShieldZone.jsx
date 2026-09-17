import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useTrackingAreaEditor from './useTrackingAreaEditor';
import { MAX_SHIELD_ZONES, MIN_ZONE_SIZE, pointInPreview, rectangleBetween, resizeZone, moveZone, nextZoneId, alignZone } from './shieldZoneGeometry';

const emptyZones = [];
const clone = zones => zones.map(zone => ({ ...zone }));

export default function ShieldZone({ enabled, onToggle, saved = emptyZones, onSave, theme: T }) {
  const { editing, anotherEditor, begin, end } = useTrackingAreaEditor();
  const [draft, setDraft] = useState([]);
  const [selected, setSelected] = useState(null);
  const [panel, setPanel] = useState(null);
  const [notice, setNotice] = useState('');
  const [drawing, setDrawing] = useState(null);
  const [guides, setGuides] = useState([]);
  const lastPointer = useRef(null);
  const surface = useRef(null);
  const gesture = useRef(null);
  const draftRef = useRef(draft);
  function updateDraft(zones) { draftRef.current = zones; setDraft(zones); }
  const button = { padding: '5px 12px', border: `1px solid ${T.line2}`, borderRadius: 4, background: '#101216', color: T.text, font: 'inherit', cursor: 'pointer' };
  useEffect(() => { setPanel(document.getElementById('aver-trk-preview-panel')); }, []);
  useEffect(() => {
    if (!editing) { gesture.current = null; setDrawing(null); setGuides([]); lastPointer.current = null; }
  }, [editing]);
  useEffect(() => {
    if (!editing) return;
    const escape = event => {
      if (event.key === 'Escape') { event.preventDefault(); end(); }
      if (event.key === 'Alt' && lastPointer.current && gesture.current) {
        event.preventDefault();
        pointerMove({ ...lastPointer.current, altKey: event.type === 'keydown' });
      }
    };
    window.addEventListener('keydown', escape);
    window.addEventListener('keyup', escape);
    return () => { window.removeEventListener('keydown', escape); window.removeEventListener('keyup', escape); };
  }, [editing, end]);

  function start() {
    updateDraft(clone(saved)); setSelected(null); setNotice(''); setDrawing(null);
    begin();
  }
  function save() {
    if (gesture.current) return;
    const zones = clone(draftRef.current);
    onSave(zones);
    onToggle(zones.length > 0);
    end(); setNotice('Shield zones saved.');
  }
  function clear() {
    if (editing) { updateDraft([]); setSelected(null); setDrawing(null); gesture.current = null; }
    else { onSave([]); onToggle(false); }
    setNotice(editing ? 'All zones removed. Select Save to apply.' : 'Shield zones cleared.');
  }
  function removeSelected() {
    updateDraft(draftRef.current.filter(zone => zone.id !== selected));
    setSelected(null); setNotice('');
  }
  function pointerDown(event, zone = null, corner = null) {
    if (event.button !== 0 || gesture.current) return;
    event.preventDefault(); event.stopPropagation();
    const bounds = surface.current.getBoundingClientRect();
    const startPoint = pointInPreview(event.clientX, event.clientY, bounds);
    if (!zone && draftRef.current.length >= MAX_SHIELD_ZONES) {
      setNotice('Maximum 5 zones. Resize or delete an existing zone to continue.'); return;
    }
    setNotice(''); setGuides([]); setSelected(zone?.id ?? null);
    gesture.current = { start: startPoint, zone: zone && { ...zone }, corner, before: clone(draftRef.current) };
    surface.current.setPointerCapture(event.pointerId);
    if (!zone) setDrawing(rectangleBetween(startPoint, startPoint));
  }
  function pointerMove(event) {
    const active = gesture.current;
    if (!active) return;
    lastPointer.current = { clientX: event.clientX, clientY: event.clientY, altKey: event.altKey };
    const bounds = surface.current.getBoundingClientRect();
    const point = pointInPreview(event.clientX, event.clientY, bounds);
    if (!active.zone) setDrawing(rectangleBetween(active.start, point));
    else {
      const changed = active.corner ? resizeZone(active.zone, active.corner, point) : moveZone(active.zone, active.start, point);
      const aligned = alignZone(changed, active.before, bounds, active.corner, event.altKey);
      setGuides(aligned.guides);
      updateDraft(draftRef.current.map(zone => zone.id === changed.id ? aligned.zone : zone));
    }
  }
  function pointerUp(event) {
    const active = gesture.current;
    if (!active) return;
    pointerMove(event);
    if (!active.zone) {
      const point = pointInPreview(event.clientX, event.clientY, surface.current.getBoundingClientRect());
      const rect = rectangleBetween(active.start, point);
      if (rect.width >= MIN_ZONE_SIZE && rect.height >= MIN_ZONE_SIZE) {
        const id = nextZoneId(draftRef.current);
        if (id !== undefined) { updateDraft([...draftRef.current, { ...rect, id }]); setSelected(id); }
      } else setNotice('Drag a larger rectangle to create a shield zone.');
    }
    gesture.current = null; setDrawing(null); setGuides([]); lastPointer.current = null;
    if (surface.current.hasPointerCapture(event.pointerId)) surface.current.releasePointerCapture(event.pointerId);
  }
  function cancelGesture() {
    if (gesture.current) updateDraft(gesture.current.before);
    gesture.current = null; setDrawing(null); setGuides([]); lastPointer.current = null;
  }
  const visible = editing ? draft : enabled && !anotherEditor ? saved : [];
  const zoneStyle = zone => ({ position: 'absolute', left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.width}%`, height: `${zone.height}%`, boxSizing: 'border-box', background: 'rgba(0,0,0,.48)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', border: `1px solid ${editing && selected === zone.id ? T.blue : 'rgba(255,255,255,.65)'}`, color: '#fff' });
  return <>
    <div aria-label="Shield Zone controls" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, fontSize: 13, width: '100%' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, cursor: 'pointer', whiteSpace: 'nowrap' }}><input className="tracking-checkbox" type="checkbox" checked={enabled} onChange={event => { end(); onToggle(event.target.checked); }} />Shield Zone</label>
      <button type="button" aria-label="Set Shield Zone" onClick={start} style={button}>Set</button>
      <button type="button" aria-label="Clear Shield Zones" onClick={clear} style={button}>Clear</button>
    </div>
    {!editing && notice && <div role="status" style={{ fontSize: 12, color: T.dim }}>{notice}</div>}
    {panel && (editing || visible.length > 0) && createPortal(<>
      <div ref={surface} aria-label={editing ? 'Edit shield zones' : 'Saved shield zones'} onPointerDown={editing ? event => pointerDown(event) : undefined} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={cancelGesture} onLostPointerCapture={cancelGesture}
        style={{ position: 'absolute', inset: 0, zIndex: 5, touchAction: 'none', pointerEvents: editing ? 'auto' : 'none', cursor: editing ? 'crosshair' : 'default' }}>
        {visible.map(zone => <div key={zone.id} data-shield-zone={zone.id} onPointerDown={editing ? event => pointerDown(event, zone) : undefined} style={{ ...zoneStyle(zone), cursor: editing ? 'move' : 'default' }}>
          <span style={{ position: 'absolute', top: 4, left: 5, fontSize: 12, lineHeight: '18px', whiteSpace: 'nowrap', textShadow: '0 1px 3px #000', pointerEvents: 'none' }}>Shield Zone {zone.id}</span>
          {editing && ['nw', 'ne', 'sw', 'se'].map(corner => <button key={corner} type="button" aria-label={`Shield Zone ${zone.id} ${corner} corner`} onPointerDown={event => pointerDown(event, zone, corner)} onKeyDown={event => {
            const offset = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
            if (offset) {
              event.preventDefault(); setSelected(zone.id);
              const point = { x: zone.x + (corner.includes('e') ? zone.width : 0) + offset[0], y: zone.y + (corner.includes('s') ? zone.height : 0) + offset[1] };
              updateDraft(draftRef.current.map(item => item.id === zone.id ? resizeZone(item, corner, point) : item));
            }
          }} style={{ position: 'absolute', [corner.includes('w') ? 'left' : 'right']: -7, [corner.includes('n') ? 'top' : 'bottom']: -7, width: 14, height: 14, padding: 0, border: '2px solid #fff', borderRadius: 3, background: T.blue, cursor: corner === 'nw' || corner === 'se' ? 'nwse-resize' : 'nesw-resize', touchAction: 'none' }} />)}
        </div>)}
        {drawing && <div style={{ ...zoneStyle(drawing), borderStyle: 'dashed', pointerEvents: 'none' }} />}
        {editing && guides.length > 0 && <svg aria-label="Shield Zone alignment guides" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
          {guides.map(guide => <line key={guide.axis} data-alignment-axis={guide.axis} x1={guide.axis === 'x' ? guide.value : guide.from} y1={guide.axis === 'y' ? guide.value : guide.from} x2={guide.axis === 'x' ? guide.value : guide.to} y2={guide.axis === 'y' ? guide.value : guide.to} stroke="#52e5ff" strokeWidth="1.5" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" style={{ filter: 'drop-shadow(0 1px 1px #000)' }} />)}
        </svg>}
      </div>
      {editing && <div role="region" aria-label="Shield Zone editor" style={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 6, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, background: 'rgba(16,18,22,.94)', color: '#fff', padding: '8px 10px', borderRadius: 6, fontSize: 12, boxShadow: '0 2px 10px #0005' }}>
        <div style={{ flex: '1 1 230px' }}><strong>Shield Zone · {draft.length} / 5</strong><div role="status" style={{ marginTop: 3, lineHeight: 1.4 }}>{notice || (draft.length === 5 ? 'Maximum 5 zones. Drag corners to resize; drag a zone to move.' : 'Drag on Live View to draw a rectangle. Drag corners to resize. Select Save to apply.')} Hold Alt to temporarily disable snapping.</div></div>
        <button type="button" onClick={removeSelected} disabled={selected === null} style={{ ...button, opacity: selected === null ? .45 : 1 }}>Delete selected</button>
        <button type="button" onClick={save} style={{ ...button, background: T.blue, color: '#fff' }}>Save</button>
        <button type="button" onClick={() => { end(); setNotice(''); }} style={button}>Cancel</button>
      </div>}
    </>, panel)}
  </>;
}
