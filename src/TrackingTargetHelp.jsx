function MicrophoneScene() {
  return <svg viewBox="0 0 200 140" role="img" aria-label="Active microphone speaker inside the tracking frame" style={{ width: '100%', display: 'block', background: '#111b24', borderRadius: 7 }}>
    <rect x="12" y="12" width="176" height="54" rx="4" fill="#263a4c" />
    <path d="M12 66H188" stroke="#7890a4" strokeWidth="3" />
    <rect x="86" y="18" width="40" height="21" fill="#435b70" rx="2" />
    <circle cx="55" cy="28" r="7" fill="#64788b" />
    <path d="M45 59V44Q55 34 65 44V59Z" fill="#4b6175" />
    <text x="147" y="57" textAnchor="middle" fill="#b4c6d7" fontSize="9">STAGE</text>
    {[40, 100, 160].map((x, index) => <g key={x} opacity={index === 0 ? 1 : .48}>
      <rect x={x - 18} y="108" width="36" height="22" rx="6" fill="#304458" />
      <circle cx={x} cy="86" r="8" fill={index === 0 ? '#b9dff9' : '#64788b'} />
      <path d={`M${x - 11} 118V103Q${x} 92 ${x + 11} 103V118Z`} fill={index === 0 ? '#91b6d1' : '#4b6175'} />
      {index === 0 && <g stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d={`M${x + 6} 107L${x + 16} 97L${x + 13} 90`} fill="none" /><circle cx={x + 12} cy="87" r="3" fill="#fff" /></g>}
    </g>)}
    <rect x="22" y="73" width="36" height="54" rx="4" fill="none" stroke="#47d9a0" strokeWidth="2" />
  </svg>;
}

export default function TrackingTargetHelp({ dialogRef, theme: T }) {
  const close = () => dialogRef.current?.close();
  const row = { display: 'grid', gridTemplateColumns: '320px minmax(0,1fr)', gap: 24, alignItems: 'center' };

  return <dialog ref={dialogRef} aria-labelledby="microphone-tracking-help-title" onClick={event => { if (event.target === event.currentTarget) close(); }} style={{ width: 'min(760px,calc(100vw - 48px))', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', boxSizing: 'border-box', padding: 24, border: `1px solid ${T.line2}`, borderRadius: 10, background: T.panel, color: T.text, fontSize: 13, lineHeight: 1.55 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
      <h2 id="microphone-tracking-help-title" style={{ margin: 0, fontSize: 17 }}>Handheld Microphone Tracking</h2>
      <button type="button" aria-label="Close Handheld Microphone Tracking help" onClick={close} style={{ border: 'none', background: 'transparent', color: T.text, fontSize: 22, cursor: 'pointer' }}>×</button>
    </div>

    <div className="tracking-help-row" style={row}>
      <img src="presenter-handheld-microphone-tracking-v2.png" alt="Presenter holding a handheld microphone inside a red tracking frame" style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', objectPosition: 'center', display: 'block', background: '#111b24', borderRadius: 7 }} />
      <div style={{ borderLeft: `1px solid ${T.line2}`, paddingLeft: 16, minHeight: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{ margin: '0 0 6px', fontSize: 14 }}>Handheld Microphone Tracking</h3>
        <p style={{ margin: 0 }}>Presenter Mode is designed specifically for speakers on stage, unlike Audience Mode, which tracks speakers in the audience. It uses Handheld Microphone Tracking to detect and follow a presenter holding a microphone, keeping the active speaker properly framed. Use this tab to configure the tracking area, framing, and tracking behavior.</p>
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}><button type="button" onClick={close} style={{ background: '#101216', border: `1px solid ${T.line2}`, borderRadius: 5, padding: '7px 16px', color: T.text, fontSize: 13, cursor: 'pointer' }}>OK</button></div>
    <style>{`@media(max-width:520px){.tracking-help-row{grid-template-columns:110px minmax(0,1fr) !important}.tracking-help-row img{max-width:110px}}`}</style>
  </dialog>;
}
