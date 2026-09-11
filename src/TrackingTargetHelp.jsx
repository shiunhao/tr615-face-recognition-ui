function Scene({ audience = false }) {
  return <svg viewBox="0 0 200 140" role="img" aria-label={audience ? 'Microphone holders in the audience seating area' : 'Speaker tracked on stage'} style={{ width: '100%', display: 'block', background: '#111b24', borderRadius: 7 }}>
    <rect x="12" y="12" width="176" height="54" rx="4" fill="#263a4c" />
    <path d="M12 66H188" stroke="#7890a4" strokeWidth="3" />
    <rect x="86" y="18" width="40" height="21" fill="#435b70" rx="2" />
    <g fill={audience ? '#64788b' : '#b9dff9'}><circle cx="55" cy="28" r="7" /><path d="M45 59V44Q55 34 65 44V59Z" /></g>
    <text x="147" y="57" textAnchor="middle" fill="#b4c6d7" fontSize="9">STAGE</text>
    {[40, 100, 160].map((x,i) => <g key={x}>
      <rect x={x-18} y="108" width="36" height="22" rx="6" fill="#304458" />
      <circle cx={x} cy="86" r="8" fill={audience && i < 2 ? '#b9dff9' : '#64788b'} />
      <path d={`M${x-11} 118V103Q${x} 92 ${x+11} 103V118Z`} fill={audience && i < 2 ? '#91b6d1' : '#4b6175'} />
      {audience && i < 2 && <g stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d={`M${x+6} 107L${x+16} 97L${x+13} 90`} fill="none" /><circle cx={x+12} cy="87" r="3" fill="#fff" /></g>}
    </g>)}
    <rect x={audience ? 22 : 39} y={audience ? 73 : 16} width={audience ? 100 : 33} height={audience ? 54 : 47} rx="4" fill="none" stroke="#47d9a0" strokeWidth="2" />
  </svg>;
}

function ModeScene({ multi }) {
  return <svg viewBox="0 0 140 100" role="img" aria-label={multi ? 'Both microphone holders inside one tracking frame' : 'First detected microphone holder tracked; second outside the frame'} style={{ width: '100%', background: '#111b24', borderRadius: 6, display: 'block' }}>
    {[38, 102].map((x, i) => <g key={x} opacity={multi || i === 0 ? 1 : 0.45}>
      <circle cx={x} cy="36" r="9" fill="#b9dff9" />
      <path d={`M${x-13} 81V59Q${x} 45 ${x+13} 59V81Z`} fill="#91b6d1" />
      <path d={`M${x+5} 63L${x+17} 52L${x+13} 43`} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx={x+12} cy="40" r="4" fill="#fff" />
    </g>)}
    <rect x="19" y="22" width={multi ? 107 : 42} height="64" rx="4" fill="none" stroke="#47d9a0" strokeWidth="2" />
    <text x="70" y="14" textAnchor="middle" fill="#80eac0" fontSize="9">{multi ? 'Both tracked' : '1st detected'}</text>
  </svg>;
}

export default function TrackingTargetHelp({ dialogRef, theme: T }) {
  const close = () => dialogRef.current?.close();
  const row = { display: 'grid', gridTemplateColumns: '180px minmax(0,1fr)', gap: 20, alignItems: 'start' };
  return <dialog ref={dialogRef} aria-labelledby="tracking-target-help-title" onClick={e => { if(e.target === e.currentTarget) close(); }} style={{ width: 'min(660px,calc(100vw - 48px))', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', boxSizing: 'border-box', padding: 24, border: `1px solid ${T.line2}`, borderRadius: 10, background: T.panel, color: T.text, fontSize: 13, lineHeight: 1.6 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}><h2 id="tracking-target-help-title" style={{ margin: 0, fontSize: 17 }}>Tracking Target</h2><button aria-label="Close tracking target help" onClick={close} style={{ border: 'none', background: 'transparent', color: T.text, fontSize: 22, cursor: 'pointer' }}>×</button></div>
    <div className="tracking-help-row" style={row}><Scene /><div style={{ borderLeft: `1px solid ${T.line2}`, paddingLeft: 16, minHeight: 126 }}><h3 style={{ margin: '0 0 6px', fontSize: 14 }}>Presenter</h3><p style={{ margin: 0 }}>Track the speaker on stage.</p></div></div>
    <div className="tracking-help-row" style={{ ...row, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${T.line}` }}><Scene audience /><div style={{ borderLeft: `1px solid ${T.line2}`, paddingLeft: 16, minHeight: 126 }}><h3 style={{ margin: '0 0 6px', fontSize: 14 }}>Microphone Holder</h3><p style={{ margin: '0 0 14px' }}>Track audience members holding a microphone.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[false, true].map(multi => <div key={String(multi)} className="tracking-mode-help-row" style={{ display: 'grid', gridTemplateColumns: '100px minmax(0,1fr)', gap: 12, alignItems: 'start' }}>
          <ModeScene multi={multi} />
          <div><strong>{multi ? 'Multi-person mode' : 'Single-person mode'}</strong><p style={{ margin: '4px 0 0' }}>{multi ? 'When Presenter Mode is set to Multiple People, automatically adjust framing to include multiple microphone holders.' : 'When Presenter Mode is set to Single Person, prioritize the first microphone holder detected by the system.'}</p></div>
        </div>)}
      </div>
    </div></div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}><button onClick={close} style={{ background: T.blue, border: 'none', borderRadius: 5, padding: '7px 16px', color: '#fff', fontSize: 13, cursor: 'pointer' }}>Close</button></div>
    <style>{`@media(max-width:520px){.tracking-help-row{grid-template-columns:1fr !important}.tracking-help-row svg{max-width:180px}}`}</style>
  </dialog>;
}
