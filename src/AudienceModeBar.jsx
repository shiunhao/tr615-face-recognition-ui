import { useRef } from 'react';
import AudienceTargetHelp from './AudienceTargetHelp';

function TargetIcon({ type }) {
  if (type === 'microphone') return <svg viewBox="0 0 28 28" aria-hidden="true"><rect x="2.5" y="2.5" width="23" height="23" rx="4" fill="none" stroke="currentColor" opacity=".35" /><circle cx="10" cy="9" r="3" fill="currentColor" /><path d="M5.5 22v-6.5c0-3 2-4.5 4.5-4.5s4.5 1.5 4.5 4.5V22" fill="currentColor" opacity=".72" /><path d="m14 16 6-5m-1-2 3 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
  if (type === 'pose') return <svg viewBox="0 0 28 28" aria-hidden="true"><rect x="2.5" y="2.5" width="23" height="23" rx="4" fill="none" stroke="currentColor" opacity=".35" /><circle cx="14" cy="7" r="3" fill="currentColor" /><path d="M14 11v8m-5-5 5-3 5 3M14 19l-4 6m4-6 4 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  return <svg viewBox="0 0 28 28" aria-hidden="true"><rect x="2.5" y="2.5" width="23" height="23" rx="4" fill="none" stroke="currentColor" opacity=".35" /><circle cx="13" cy="10" r="3" fill="currentColor" /><path d="M7.5 23v-6c0-2.7 2.4-4.3 5.5-4.3s5.5 1.6 5.5 4.3v6" fill="currentColor" opacity=".72" /><path d="m17 15 4-5V4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /><path d="M18.5 5V2.8M21 5V2.5M23.5 5.5V3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;
}

export default function AudienceModeBar({ settings, onChange, theme: T, visualTargets = false }) {
  const info = useRef(null);
  const options = [['microphone', 'Microphone Holder'], ['pose', 'Pose (Standing)'], ['hand', 'Hand Raising']];
  const targets = settings.targets || { microphone: true, pose: false, hand: false };
  const group = { display: 'flex', alignItems: 'center', gap: 8 };
  const tray = { display: 'flex', gap: 4, padding: 3, background: '#101216', borderRadius: 7 };
  const choice = selected => ({ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 8px', border: 'none', borderRadius: 5, background: selected ? T.blue : 'transparent', color: selected ? '#fff' : T.dim, cursor: 'pointer', whiteSpace: 'nowrap', font: 'inherit', fontSize: 13, fontWeight: 600 });
  const updateTarget = (key, checked) => onChange(previous => ({ ...previous, targets: { ...targets, ...previous.targets, [key]: checked } }));
  return <div className="tracking-mode-bar" style={{ ...group, justifyContent: 'flex-start', flexWrap: 'wrap', gap: 18, padding: '4px 0', borderBottom: `1px solid ${T.line2}`, flexShrink: 0 }}>
    <div role="group" aria-label="Tracking Target" style={group}>
      <span className="tracking-mode-title" style={{ color: T.dim }}>Tracking Target</span>
      <div style={tray}>{options.map(([key, label]) => visualTargets ? (
        <label key={key} title={label} style={{ position: 'relative', height: 32, minWidth: key === 'microphone' ? 118 : 96, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '2px 8px 2px 5px', border: `1px solid ${targets[key] ? T.blue : T.line2}`, borderRadius: 5, background: targets[key] ? 'rgba(30,155,240,0.16)' : 'transparent', color: targets[key] ? '#dceeff' : T.dim, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 11.5, fontWeight: 600 }}>
          <input type="checkbox" aria-label={label} checked={targets[key]} onChange={e => updateTarget(key, e.target.checked)} style={{ margin: 0, appearance: 'none', width: 14, height: 14, flexShrink: 0, border: '1px solid #b8c9dd', borderRadius: 3, backgroundColor: 'transparent', backgroundImage: targets[key] ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'%3E%3Cpath d='M3 7l3 3 5-6' fill='none' stroke='%23f0f6ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")" : 'none', cursor: 'pointer' }} />
          <span style={{ width: 24, height: 24, flexShrink: 0, color: targets[key] ? '#8bd2ff' : T.faint }}><TargetIcon type={key} /></span>
          <span>{label}</span>
        </label>
      ) : <label key={key} style={{ ...choice(targets[key]), padding: '5px 7px', border: `1px solid ${targets[key] ? T.blue : 'transparent'}`, background: targets[key] ? 'rgba(30,155,240,0.12)' : 'transparent', color: targets[key] ? '#dceeff' : T.dim }}><input type="checkbox" checked={targets[key]} onChange={e => updateTarget(key, e.target.checked)} style={{ margin: 0, appearance: 'none', width: 14, height: 14, flexShrink: 0, border: '1px solid #b8c9dd', borderRadius: 3, backgroundColor: 'transparent', backgroundImage: targets[key] ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'%3E%3Cpath d='M3 7l3 3 5-6' fill='none' stroke='%23f0f6ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")" : 'none', cursor: 'pointer' }} />{label}</label>)}</div>
      <button type="button" aria-label="Audience tracking target information" onClick={() => info.current?.showModal()} style={{ border: 'none', background: 'transparent', color: T.dim, cursor: 'pointer', padding: 0 }}>ⓘ</button>
    </div>
    <div role="group" aria-label="Presenter Mode" style={{ ...group, paddingLeft: 18, borderLeft: `1px solid ${T.line2}` }}>
      <span className="tracking-mode-title" style={{ color: T.dim }}>Presenter Mode</span>
      <div style={tray}>{[[false, 'Single Person'], [true, 'Multiple People']].map(([value, label]) => <button key={label} type="button" aria-pressed={settings.multiPresenterTracking === value} onClick={() => onChange(previous => ({ ...previous, multiPresenterTracking: value }))} style={choice(settings.multiPresenterTracking === value)}>{label}</button>)}</div>
    </div>
    <AudienceTargetHelp dialogRef={info} theme={T} />
  </div>;
}
