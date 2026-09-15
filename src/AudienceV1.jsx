import { useRef, useState } from 'react';
import EffectiveTrackingArea from './EffectiveTrackingAreaV1';
import AudienceTargetHelp from './AudienceTargetHelp';
import ShieldZone from './ShieldZone';

export default function AudienceV1({ settings: s, onChange, theme: T }) {
  const info = useRef(null);
  const [saved, setSaved] = useState(false);
  const update = (key, value) => onChange(old => ({ ...old, [key]: value }));
  const box = { border: `1px solid ${T.line}`, borderRadius: 6, padding: '8px 10px', background: 'rgba(0,0,0,.12)', display: 'flex', flexDirection: 'column', gap: 6 };
  const column = { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, minHeight: 0, overflowY: 'auto', scrollbarWidth: 'thin' };
  const title = { fontSize: 12.5, fontWeight: 600, color: T.dim };
  const button = { border: `1px solid ${T.line2}`, borderRadius: 4, padding: '6px 12px', background: '#101216', color: T.text, font: 'inherit', cursor: 'pointer' };
  const field = { width: '100%', minWidth: 0, boxSizing: 'border-box', background: '#101216', color: T.text, border: `1px solid ${T.line2}`, borderRadius: 4, padding: '5px 8px', font: 'inherit' };
  const check = (key, label) => <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><input type="checkbox" checked={s[key]} onChange={e => update(key, e.target.checked)} style={{ accentColor: T.blue }} />{label}</label>;
  return <div id="aver-v1-audience-panel" style={{ height: '100%', minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, fontSize: 13, color: T.text }}>
    <div style={column}>
      {[[ 'sensitivity', 'Tracking Sensitivity', 1, 3 ], ['returnTime', 'Time of Return to Tracking Point', 3, 10]].map(([key,label,min,max]) => <div key={key} style={box}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><label htmlFor={`v1-audience-${key}`} style={title}>{label}</label><output style={{ color: T.blue }}>{s[key]}</output></div><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>{min}</span><input id={`v1-audience-${key}`} type="range" min={min} max={max} value={s[key]} onChange={e => update(key,Number(e.target.value))} className="tr-sl" style={{ '--p': (s[key]-min)/(max-min)*100+'%', flex: 1, minWidth: 0 }} /><span>{max}</span></div></div>)}
      <div style={box}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={title}>Tracking Target</span><button style={{ ...button, border: 'none', padding: 0, background: 'transparent' }} aria-label="Audience tracking target information" onClick={() => info.current?.showModal()}>ⓘ</button></div>
        {check('microphone', 'Microphone Tracking')}{check('pose','Pose (Standing)')}{check('hand','Hand Raising')}
      </div>
      <div style={box}>{check('multiPresenterTracking','Multi-Presenter Tracking')}</div>
      <div style={box}><EffectiveTrackingArea enabled={s.effectiveArea} onToggle={() => update('effectiveArea',!s.effectiveArea)} saved={s.savedArea} onSave={value => update('savedArea',value)} color={T.blue} /></div>
    </div>
    <div style={column}>
      <div style={box}><label htmlFor="v1-audience-preset" style={title}>Tracking Point</label><div style={{ display: 'flex', gap: 8 }}><input id="v1-audience-preset" value={s.presetPoint} onChange={e => update('presetPoint',e.target.value)} style={field} /><button style={button} onClick={() => { update('savedPoint',{preset:s.presetPoint,peopleSize:s.peopleSize,placement:s.placement,height:s.height});setSaved(true); }}>Save</button></div>{saved && <span role="status" style={title}>Tracking point saved.</span>}</div>
      <div style={{ ...box, display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }}>{[['peopleSize','People Size',['Upper Body','Full Body','Close Up']],['placement','Placement',['Center','Left','Right']],['height','Height',['Height1','Height2']]].map(([key,label,options]) => <div key={key}><label htmlFor={`v1-audience-${key}`} style={title}>{label}</label><select id={`v1-audience-${key}`} value={s[key]} onChange={e => update(key,e.target.value)} style={{ ...field, marginTop: 6 }}>{options.map(value => <option key={value}>{value}</option>)}</select></div>)}</div>
    </div>
    <div style={column}><div style={box}><ShieldZone enabled={s.shieldZone} onToggle={value => update('shieldZone',value)} saved={s.shieldZones} onSave={value => update('shieldZones',value)} theme={T} /></div></div>
    <AudienceTargetHelp dialogRef={info} theme={T} />
  </div>;
}
