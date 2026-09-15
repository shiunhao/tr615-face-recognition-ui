import { useState } from 'react';
import { createPortal } from 'react-dom';
import useTrackingAreaEditor from './useTrackingAreaEditor';

const initialPoints = [[50, 15], [80, 38], [70, 85], [30, 85], [20, 38]];

export default function EffectiveTrackingArea({ enabled, onToggle, color, saved, onSave }) {
  const [points, setPoints] = useState(saved?.points || initialPoints);
  const [draft, setDraft] = useState(initialPoints);
  const { editing, begin, end, saveGuard } = useTrackingAreaEditor();
  const [thumbnail, setThumbnail] = useState(saved?.thumbnail || null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const panel = document.getElementById('aver-trk-preview-panel');
  const polygon = (values) => values.map(p => p.join(',')).join(' ');
  function move(event, index) {
    const svg = event.currentTarget.ownerSVGElement;
    const rect = svg.getBoundingClientRect();
    const point = [Math.max(1, Math.min(99, (event.clientX - rect.left) / rect.width * 100)), Math.max(1, Math.min(99, (event.clientY - rect.top) / rect.height * 100))];
    setDraft(previous => previous.map((p, i) => i === index ? point : p));
  }
  async function save() {
    const canSave = saveGuard();
    setSaving(true);
    setError('');
    try {
      const background = panel.querySelector('[data-tracking-background]');
      const style = getComputedStyle(background);
      const image = new Image();
      image.src = new URL('modern_white_meeting_room.png', document.baseURI).href;
      await image.decode();
      if (!canSave()) return;
      const width = panel.clientWidth, height = panel.clientHeight;
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, width, height);
      const scale = Math.max(width / image.width, height / image.height);
      const matrix = new DOMMatrix(style.transform);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
      ctx.drawImage(image, -image.width * scale / 2, -image.height * scale / 2, image.width * scale, image.height * scale);
      ctx.restore();
      ctx.beginPath();
      draft.forEach(([x, y], i) => ctx[i ? 'lineTo' : 'moveTo'](x * width / 100, y * height / 100));
      ctx.closePath(); ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 3; ctx.stroke();
      const snapshot = canvas.toDataURL('image/png');
      setThumbnail(snapshot);
      onSave({ points: draft.map(p => [...p]), thumbnail: snapshot });
      setPoints(draft.map(p => [...p]));
      end();
    } catch {
      if (canSave()) setError('Unable to capture Live View. Please try Save again.');
    } finally { setSaving(false); }
  }
  return <>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', flex: 1 }}>
        <input type="checkbox" checked={enabled} onChange={onToggle} style={{ accentColor: color }} />
        Effective Tracking Area
      </label>
      <div title="Saved tracking area" style={{ width: 60, height: 40, background: '#000', flexShrink: 0 }}>
        {thumbnail ? <img alt="Saved Live View and tracking boundary" src={thumbnail} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> :
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points={polygon(points)} fill="none" stroke="#ff3333" strokeWidth="2" /></svg>}
      </div>
      <button type="button" disabled={saving} onClick={() => editing ? save() : (setDraft(points.map(p => [...p])), setError(''), begin())} style={{ padding: '5px 12px', border: '1px solid #444', borderRadius: 4, background: editing ? color : '#101216', color: '#fff', cursor: 'pointer' }}>{saving ? 'Saving…' : editing ? 'Save' : 'Set'}</button>
      {editing && <button type="button" onClick={end} style={{ padding: '5px 8px', border: '1px solid #444', borderRadius: 4, background: '#101216', color: '#fff', cursor: 'pointer' }}>Cancel</button>}
      <span title="Only people inside this area are tracked when enabled. Select Set, drag the five red points in Live View, then Save." aria-label="Tracking area information">ⓘ</span>
    </div>
    {error && <div role="alert" style={{ color: '#ff7777', fontSize: 12 }}>{error}</div>}
    {editing && panel && createPortal(<>
      <svg aria-label="Edit tracking area" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', touchAction: 'none', zIndex: 5 }}>
        <polygon points={polygon(draft)} fill="rgba(255,30,30,0.08)" stroke="#ff3333" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {draft.map(([x, y], index) => <ellipse key={index} cx={x} cy={y} rx="1.3" ry="2" fill="#ff3333" stroke="#fff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" tabIndex={0} role="button" aria-label={`Tracking area point ${index + 1}`} style={{ cursor: 'grab' }}
          onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerMove={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e, index); }}
          onPointerUp={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }}
          onKeyDown={e => { const offset = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (offset) { e.preventDefault(); setDraft(old => old.map((p, i) => i === index ? p.map((v, axis) => Math.max(1, Math.min(99, v + offset[axis]))) : p)); } }} />)}
      </svg>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 6, background: '#111d', color: '#fff', padding: '6px 10px', fontSize: 12, pointerEvents: 'none' }}>Drag the five red points, then select Save.</div>
    </>, panel)}
  </>;
}
