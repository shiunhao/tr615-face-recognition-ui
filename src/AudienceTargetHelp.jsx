function AudienceScene({ type }) {
  const active = '#b9dff9';
  const activeBody = '#91b6d1';
  const muted = '#64788b';
  const mutedBody = '#42576a';

  const Person = ({ x, selected = false, standing = false }) => {
    const headY = standing ? 35 : 60;
    const bodyTop = standing ? 43 : 69;
    const bodyBottom = standing ? 91 : 94;
    return <g>
      <circle cx={x} cy={headY} r="7" fill={selected ? active : muted} />
      <path d={`M${x - 11} ${bodyBottom}V${bodyTop + 9}Q${x} ${bodyTop - 3} ${x + 11} ${bodyTop + 9}V${bodyBottom}Z`} fill={selected ? activeBody : mutedBody} />
      {standing && <path d={`M${x - 5} 89L${x - 7} 105M${x + 5} 89L${x + 7} 105`} stroke={selected ? active : muted} strokeWidth="5" strokeLinecap="round" />}
    </g>;
  };

  return <svg viewBox="0 0 180 112" role="img" aria-label={`${type} audience tracking example`} style={{ width: '100%', display: 'block', borderRadius: 7, background: '#111b24' }}>
    <rect x="12" y="10" width="156" height="22" rx="3" fill="#263a4c" />
    <text x="90" y="24" textAnchor="middle" fill="#91a9bc" fontSize="8">FRONT OF ROOM</text>
    <path d="M13 100H167" stroke="#31485b" strokeWidth="2" />
    <Person x={42} />
    <Person x={90} selected standing={type === 'pose'} />
    <Person x={138} />
    {type === 'microphone' && <g stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M98 81L111 68L107 57" fill="none" /><circle cx="106" cy="54" r="3" fill="#fff" /></g>}
    {type === 'hand' && <g stroke={active} strokeWidth="5" strokeLinecap="round" fill="none"><path d="M99 76L112 58L112 38" /><path d="M108 40V34M113 40V33M118 42V36" strokeWidth="2" /></g>}
    <rect x={type === 'pose' ? 74 : 73} y={type === 'pose' ? 23 : 46} width={type === 'pose' ? 32 : 51} height={type === 'pose' ? 85 : 53} rx="4" fill="none" stroke="#47d9a0" strokeWidth="2" />
  </svg>;
}

export default function AudienceTargetHelp({ dialogRef, theme: T }) {
  const close = () => dialogRef.current?.close();
  const items = [
    { type: 'microphone', title: 'Handheld Microphone Tracking', text: 'Audience Mode is designed specifically for speakers in the audience, unlike Presenter Mode, which tracks speakers on stage. It uses Handheld Microphone Tracking to detect and follow audience members holding a microphone. Use this tab to configure the tracking area, framing, and tracking behavior.' },
  ];

  return <dialog ref={dialogRef} aria-labelledby="audience-target-help-title" onClick={event => { if (event.target === event.currentTarget) close(); }} style={{ width: 'min(820px, calc(100vw - 48px))', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', boxSizing: 'border-box', padding: 24, border: `1px solid ${T.line2}`, borderRadius: 10, background: T.panel, color: T.text, fontSize: 13, lineHeight: 1.6 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
      <h2 id="audience-target-help-title" style={{ margin: 0, fontSize: 17 }}>About Audience Mode</h2>
      <button type="button" aria-label="Close audience tracking help" onClick={close} style={{ border: 'none', background: 'transparent', color: T.text, fontSize: 22, cursor: 'pointer' }}>×</button>
    </div>
    <div style={{ marginTop: 18 }}>
      {items.map((item, index) => <div key={item.type} className="audience-help-row" style={{ display: 'grid', gridTemplateColumns: '360px minmax(0, 1fr)', gap: 24, alignItems: 'center', padding: '18px 0', borderTop: `1px solid ${T.line}` }}>
        <img src="audience-microphone-tracking-v3.png" alt="Audience member holding a handheld microphone inside a red tracking frame" style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', objectPosition: 'center', display: 'block', borderRadius: 7, background: '#111b24' }} />
        <div style={{ borderLeft: `1px solid ${T.line2}`, paddingLeft: 16, minHeight: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: 14 }}>{item.title}</h3>
          <p style={{ margin: 0 }}>{item.text}</p>
        </div>
      </div>)}
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}><button type="button" onClick={close} style={{ background: '#101216', border: `1px solid ${T.line2}`, borderRadius: 5, padding: '7px 16px', color: T.text, fontSize: 13, cursor: 'pointer' }}>OK</button></div>
    <style>{`@media(max-width:520px){.audience-help-row{grid-template-columns:1fr !important}.audience-help-row img{max-width:180px}.audience-help-row>div{border-left:0 !important;padding-left:0 !important}}`}</style>
  </dialog>;
}
