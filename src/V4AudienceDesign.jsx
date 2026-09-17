import { useState } from 'react';

function TargetIcon({ kind = 'microphone', compact = false, emphasis = false }) {
  return <svg width={emphasis ? 31 : compact ? 25 : 42} height={emphasis ? 29 : compact ? 23 : 38} viewBox="0 0 60 50" aria-hidden="true" style={{ flexShrink: 0, transform: emphasis ? 'scale(1.16)' : undefined, transformOrigin: 'center' }}><circle cx="27" cy="10" r="6" fill="#b9dff9" /><path d="M17 42V25Q27 16 37 25V42" fill="#91b6d1" />{kind === 'microphone' ? <><path d="M30 30L38 23" stroke="#b9dff9" strokeWidth="4" strokeLinecap="round" /><circle cx="39" cy="22" r="2.5" fill="#b9dff9" /><g transform="rotate(-38 43 17)"><rect x="40" y="9" width="6" height="12" rx="3" fill="#35566f" stroke="#9ab7cb" strokeWidth="1.3" /><path d="M43 21V29" stroke="#35566f" strokeWidth="3" strokeLinecap="round" /></g></> : kind === 'hand' ? <path d="M34 25L45 9V3" stroke="#b9dff9" strokeWidth="5" strokeLinecap="round" /> : <path d="M21 39v9m12-9v9" stroke="#b9dff9" strokeWidth="5" />}</svg>;
}

export function V4Context({ audience, theme: T }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 12px', color: T.text, flexShrink: 0 }}>
    {audience ? <img src="audience-microphone-tracking-v3.png" alt="Standing audience member holding a microphone inside a red tracking frame" style={{ width: 132, height: 82, flexShrink: 0, objectFit: 'cover', objectPosition: 'center', borderRadius: 5, border: `1px solid ${T.line}` }} /> : <svg width="100" height="42" viewBox="0 0 120 50" role="img" aria-label="Camera facing the presenter"><rect x="3" y="18" width="20" height="14" rx="3" fill="#91b6d1" /><path d="M23 21l9-5v18l-9-5M35 25h23m-5-5 5 5-5 5" stroke="#67d7a5" fill="none" strokeWidth="2" /><g><circle cx="90" cy="14" r="5" fill="#b9dff9" /><path d="M84 35V25Q90 18 96 25V35" fill="#91b6d1" /></g></svg>}
    <div><strong>{audience ? 'Audience Settings' : 'Presenter Settings'}</strong><div style={{ fontSize: 12, color: T.dim, lineHeight: 1.4, marginTop: 3 }}>{audience ? 'Audience Mode follows a standing audience member speaking into a microphone.' : 'Configure tracking for a camera facing the presenter.'}</div></div>
  </div>;
}

export default function V4AudienceDesign({ branch, theme: T, header = false, onInfo }) {
  const [open, setOpen] = useState(false);
  const options = [['microphone', 'Microphone Holder'], ['pose', 'Pose (Standing)'], ['hand', 'Hand Raising']];
  const box = { border: `1px solid ${T.line}`, borderRadius: 6, padding: '8px', background: 'rgba(0,0,0,.12)', fontSize: 13 };
  if (branch === 1) return null;
  return <section style={{ ...box, boxSizing: 'border-box', ...(branch === 2 ? { height: '100%' } : {}), ...(header ? { display: 'flex', alignItems: 'center', gap: 12, padding: '4px 10px', minHeight: 40 } : {}) }} aria-label="Audience Tracking Target">
    <div style={{ color: T.dim, fontWeight: 600, marginBottom: header ? 0 : 6, whiteSpace: 'nowrap' }}>Tracking Target</div>
    {branch === 2 && <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><TargetIcon /><strong>Microphone Holder</strong></div><div style={{ marginTop: 9, paddingTop: 8, borderTop: `1px solid ${T.line}`, display: 'flex', alignItems: 'flex-start', gap: 8 }}>{onInfo && <button type="button" aria-label="About Audience Mode" title="About Audience Mode" onClick={onInfo} style={{ width: 28, height: 28, flexShrink: 0, border: 'none', borderRadius: 4, background: 'transparent', color: T.dim, font: 'inherit', fontSize: 17, cursor: 'pointer' }}>ⓘ</button>}<div style={{ color: T.dim, fontSize: 12, lineHeight: 1.45 }}>Audience Mode uses Handheld Microphone Tracking to follow audience members holding a microphone. Configure the tracking area and framing in this tab.</div></div></div>}
    {branch === 3 && <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}><label style={{ display: 'flex', gap: 7, alignItems: 'center', padding: '1px 0', whiteSpace: 'nowrap' }}><input className="tracking-checkbox" type="checkbox" checked disabled readOnly /><TargetIcon kind="microphone" emphasis />Handheld Microphone Tracking</label></div>}
    {branch === 4 && <div style={{ position: 'relative', width: header ? 320 : 'auto' }}>
      <button type="button" aria-label="Tracking Target" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 6, background: '#101216', color: T.text, border: `1px solid ${T.line2}`, borderRadius: 4, padding: header ? '2px 7px' : '2px 7px', minHeight: header ? 30 : undefined, cursor: 'pointer' }}><TargetIcon compact={header} /><span style={{ flex: 1, textAlign: 'left' }}>Microphone Holder</span>▾</button>
      {open && <div role="listbox" aria-label="Tracking Target options" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, background: '#191d22', border: `1px solid ${T.line2}`, borderRadius: 4 }}>{options.map(([kind, label], index) => <button key={kind} type="button" role="option" aria-selected={index === 0} disabled={index !== 0} onClick={() => setOpen(false)} style={{ width: '100%', display: 'flex', gap: 6, alignItems: 'center', border: 0, padding: '2px 7px', background: 'transparent', color: T.text, opacity: index ? .4 : 1 }}><TargetIcon kind={kind} />{label}</button>)}</div>}
    </div>}
    {branch >= 3 && header && onInfo && <button type="button" aria-label="About Audience Mode" title="About Audience Mode" onClick={onInfo} style={{ width: 30, height: 30, marginLeft: 'auto', flexShrink: 0, border: 'none', borderRadius: 4, background: 'transparent', color: T.dim, font: 'inherit', fontSize: 17, cursor: 'pointer' }}>ⓘ</button>}
    {branch >= 3 && !header && <div style={{ color: T.dim, fontSize: 11.5, marginTop: 6 }}>Only Handheld Microphone Tracking is currently supported.</div>}
  </section>;
}
