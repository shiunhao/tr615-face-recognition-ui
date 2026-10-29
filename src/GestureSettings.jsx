import './gesture-settings.css';

const MODES = [['off', 'Off'], ['tracking', 'Tracking'], ['ptz', 'PTZ'], ['tracking-ptz', 'Tracking+PTZ']];

function GestureIcon({ gesture }) {
  const fist = gesture === 'fist';
  const fingers = fist
    ? [[8, 23, 4, 8], [12, 21, 4, 9], [16, 22, 4, 9], [20, 24, 4, 8]]
    : gesture === 'zoom-in'
      ? [[10, 11, 4, 21], [17, 10, 4, 22]]
      : [[7, 16, 3.5, 17], [11.5, 11, 3.5, 21], [16, 10, 3.5, 22], [20.5, 15, 3.5, 18]];
  return <svg className="gesture-guide-icon" viewBox="0 0 72 64" aria-hidden="true" focusable="false">
    <g fill="currentColor">
      <ellipse cx="51" cy="19" rx="12" ry="14" />
      <path d="M44 31h14v7c7 2 12 6 12 13v10H32V51c0-7 5-11 12-13z" />
      <g transform={gesture === 'pan-tilt' ? 'translate(0 5) scale(.88)' : undefined}>
        <rect x="8" y="28" width="16" height="15" rx="6" />
        <path d="M11 40h11l2 11H9z" />
        {fingers.map(([x, y, width, height], index) => <rect key={index} x={x} y={y} width={width} height={height} rx="1.8" />)}
        {(gesture === 'tracking' || gesture === 'pan-tilt')
          ? <path d="m10 39-7-9a2.3 2.3 0 0 1 3.6-2.8l7 8z" />
          : <path d="M9 33c3-2 6-2 9-1v4h-7z" />}
        {fist && <path d="M9 30h13v3H9z" fill="var(--gesture-card-bg)" />}
      </g>
    </g>
    {gesture === 'pan-tilt' && <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2v9m-4-5 4-4 4 4M18 53v9m-4-4 4 4 4-4M1 33h8m-4-4-4 4 4 4M29 33h8m-4-4 4 4-4 4" />
      <path d="M3 17h31" strokeDasharray="1.5 3" />
    </g>}
  </svg>;
}

export default function GestureSettings({ value, onChange, disabled = false, theme: T }) {
  const tracks = value === 'tracking' || value === 'tracking-ptz';
  const ptz = value === 'ptz' || value === 'tracking-ptz';
  const cards = [
    {
      id: 'tracking', enabled: tracks,
      title: 'Auto Tracking enable / Switch Presenter',
      paragraphs: [
        'Raise your hand beside your face (with an open hand) for more than 3 seconds to activate the AutoTracking.',
        'Instruct camera to track the person that holds up hand beside his/her face (only enabled when Auto Tracking is on).',
      ],
    },
    {
      id: 'fist', enabled: tracks || ptz,
      title: value === 'ptz' ? 'Zoom out' : 'Auto Tracking disable/Zoom out',
      paragraphs: [value === 'ptz'
        ? 'Make a fist beside your face to zoom out.'
        : "Make a fist beside your face to disable Auto Tracking while it's on, otherwise, perform zoom out."],
    },
    { id: 'zoom-in', enabled: ptz, title: 'Zoom in', paragraphs: ['Shows two fingers beside your face and put down your hand to stop zoom in.'] },
    { id: 'body-size', enabled: tracks, title: 'Upper/Full body Switch', paragraphs: ['Shows four fingers beside your face to switch upper or full body size.'] },
    { id: 'pan-tilt', enabled: ptz, title: 'Pan/Tilt', paragraphs: ['Shows five fingers beside your shoulder and move camera to desired position. Make a fist to stop camera movement.'] },
  ];

  return <div className="gesture-settings" style={{ '--gesture-line': T.line, '--gesture-line-strong': T.line2, '--gesture-text': T.text, '--gesture-dim': T.dim, '--gesture-icon': '#87919a', '--gesture-card-bg': T.panel2 }}>
    <section className="gesture-control-card" aria-label="Gesture configuration">
      <label className="gesture-control-label" htmlFor="aver-gesture-control">Gesture Control</label>
      <select id="aver-gesture-control" value={value} disabled={disabled} onChange={event => onChange(event.target.value)}>
        {MODES.map(([mode, label]) => <option key={mode} value={mode}>{label}</option>)}
      </select>
    </section>
    <div className="gesture-guide-panel">
      <div className="gesture-guide-grid" aria-label="Gesture instructions">
        {cards.map(({ id, enabled, title, paragraphs }) => <section key={id} className="gesture-guide-card" data-gesture-id={id} data-enabled={String(enabled)} aria-disabled={!enabled} aria-label={title}>
          <div className="gesture-guide-card-content">
            <GestureIcon gesture={id} />
            <div className="gesture-guide-copy">
              <div className="gesture-guide-title">{title}</div>
              {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          </div>
        </section>)}
      </div>
      <p className="gesture-distance-note">* The effective recognized distance of gesture control is 15ft at 1X zoom ratio.</p>
    </div>
  </div>;
}
