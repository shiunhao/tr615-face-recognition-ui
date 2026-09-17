export default function AudienceModeBar({ settings, onChange, theme: T }) {
  const group = { display: 'flex', alignItems: 'center', gap: 8 };
  const tray = { display: 'flex', gap: 4, padding: 3, background: '#101216', borderRadius: 7 };
  const choice = selected => ({ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 8px', border: 'none', borderRadius: 5, background: selected ? T.blue : 'transparent', color: selected ? '#fff' : T.dim, cursor: 'pointer', whiteSpace: 'nowrap', font: 'inherit', fontSize: 13, fontWeight: 600 });
  return <div className="tracking-mode-bar" style={{ ...group, justifyContent: 'flex-start', flexWrap: 'wrap', gap: 18, padding: '4px 0', borderBottom: `1px solid ${T.line2}`, flexShrink: 0 }}>
    <div role="group" aria-label="Presenter Mode" style={group}>
      <span className="tracking-mode-title" style={{ color: T.dim }}>Presenter Mode</span>
      <div style={tray}>{[[false, 'Single Person'], [true, 'Multiple People']].map(([value, label]) => <button key={label} type="button" aria-pressed={settings.multiPresenterTracking === value} onClick={() => onChange(previous => ({ ...previous, multiPresenterTracking: value }))} style={choice(settings.multiPresenterTracking === value)}>{label}</button>)}</div>
    </div>
  </div>;
}
