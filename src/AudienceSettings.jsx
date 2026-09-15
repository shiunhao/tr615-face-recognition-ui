import AudienceModeBar from "./AudienceModeBar";
import { useState } from 'react';
import EffectiveTrackingArea from './EffectiveTrackingArea';
import ShieldZone from './ShieldZone';
import FramingSelect from './FramingSelect';

export default function AudienceSettings({ settings, onChange, theme: T, visualTargets = false }) {
  const [notice, setNotice] = useState('');
  const update = (key, value) => onChange(previous => ({ ...previous, [key]: value }));
  const button = { padding: '6px 12px', border: `1px solid ${T.line2}`, borderRadius: 4, background: '#101216', color: T.text, font: 'inherit', cursor: 'pointer' };
  const input = { width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '5px 8px', background: '#101216', border: `1px solid ${T.line2}`, borderRadius: 4, color: T.text, font: 'inherit' };
  const check = (key, label) => <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', whiteSpace: 'nowrap' }}><input type="checkbox" checked={settings[key]} onChange={e => update(key, e.target.checked)} style={{ accentColor: T.blue }} />{label}</label>;
  return <div id="aver-tracking-audience-panel" aria-label="Audience Tracking" style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 8, color: T.text, fontSize: 13 }}>
    <AudienceModeBar settings={settings} onChange={onChange} theme={T} visualTargets={visualTargets} />
    <div className="audience-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gap: 10, flex: 1, minHeight: 0 }}>
    <section className="audience-card" aria-label="Audience Tracking Area">
      <h3>Tracking Area</h3><div className="audience-card-body">
        <EffectiveTrackingArea enabled={settings.effectiveArea} onToggle={() => update('effectiveArea', !settings.effectiveArea)} saved={settings.savedArea} onSave={value => update('savedArea', value)} color={T.blue} />
        <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
          <ShieldZone enabled={settings.shieldZone} onToggle={value => update('shieldZone', value)} saved={settings.shieldZones} onSave={value => update('shieldZones', value)} theme={T} />
        </div>
      </div>
    </section>
    <section className="audience-card" aria-label="Audience Framing">
      <h3>Framing</h3><div className="audience-card-body">
        <div className="audience-row"><label htmlFor="audience-preset">Tracking Point</label><div style={{ display: 'flex', gap: 6, minWidth: 0 }}><input id="audience-preset" aria-label="Audience Tracking Point" value={settings.presetPoint} onChange={e => update('presetPoint', e.target.value)} style={input} /><button style={button} onClick={() => { update('savedPoint', { preset: settings.presetPoint, peopleSize: settings.peopleSize, placement: settings.placement, height: settings.height }); setNotice('Tracking point saved.'); }}>Save</button></div></div>

        {[
          ['peopleSize', 'People Size', ['Upper Body', 'Full Body', 'Close Up']],
          ['placement', 'Placement', ['Center', 'Left', 'Right']],
          ['height', 'Height', ['Height1', 'Height2']],
        ].map(([key, label, options]) => <div className="audience-row" key={key}><label htmlFor={`v2-${key}`}>{label}</label><FramingSelect kind={key} label={label} value={settings[key]} options={options} onChange={value => update(key, value)} /></div>)}
        {notice && <div role="status" style={{ fontSize: 12, color: T.dim }}>{notice}</div>}
      </div>
    </section>
    <section className="audience-card" aria-label="Audience Tracking Behavior">
      <h3>Tracking Behavior</h3><div className="audience-card-body">
        {[
          ['sensitivity', 'Sensitivity', 'Tracking Sensitivity', 1, 3],
          ['returnTime', 'Return Time', 'Time of Return to Tracking Point', 3, 10],
        ].map(([key, label, full, min, max]) => <div className="audience-row" key={key}><label htmlFor={`audience-${key}`} title={full}>{label}</label><div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}><span style={{ fontSize: 11, color: T.faint }}>{min}</span><input id={`audience-${key}`} aria-label={full} type="range" min={min} max={max} value={settings[key]} onChange={e => update(key, Number(e.target.value))} className="tr-sl" style={{ '--p': (settings[key]-min)/(max-min)*100+'%', flex: 1, minWidth: 0, margin: 0 }} /><span style={{ fontSize: 11, color: T.faint }}>{max}</span><output style={{ color: T.blue, minWidth: 18, textAlign: 'right' }}>{settings[key]}</output></div></div>)}
      </div>
    </section>
    </div>
    <style>{`.audience-card { display:flex; flex-direction:column; min-width:0; min-height:0; overflow:hidden; border:1px solid ${T.line}; border-radius:6px; background:rgba(0,0,0,.12); } .audience-card h3 { flex-shrink:0; margin:0; padding:8px 10px; border-bottom:1px solid ${T.line}; font-size:12.5px; font-weight:600; color:${T.dim}; } .audience-card-body { display:flex; flex-direction:column; gap:10px; min-height:0; padding:10px; overflow-y:auto; scrollbar-width:thin; } .audience-row { display:grid; grid-template-columns:96px minmax(0,1fr); gap:8px; align-items:center; min-height:28px; font-size:12px; }`}</style>
  </div>;
}
