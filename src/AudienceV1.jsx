import { useRef, useState } from 'react';
import EffectiveTrackingArea from './EffectiveTrackingAreaV1';
import AudienceTargetHelp from './AudienceTargetHelp';
import ShieldZone from './ShieldZone';
import V4AudienceDesign, { V4Context } from './V4AudienceDesign';

export default function AudienceV1({ settings: s, onChange, theme: T, designBranch = 0 }) {
  const info = useRef(null);
  const [saved, setSaved] = useState(false);
  const update = (key, value) => onChange(old => ({ ...old, [key]: value }));
  const box = { border: `1px solid ${T.line}`, borderRadius: 6, padding: '6px 8px', background: 'rgba(0,0,0,.12)', display: 'flex', flexDirection: 'column', gap: 4, boxSizing: 'border-box' };
  const alignedBox = { ...box, padding: '8px 10px', gap: 6 };
  const column = { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, minHeight: 0, overflow: 'visible' };
  const title = { fontSize: 12.5, fontWeight: 600, color: T.dim };
  const button = { border: `1px solid ${T.line2}`, borderRadius: 4, padding: '6px 12px', background: '#101216', color: T.text, font: 'inherit', cursor: 'pointer' };
  const field = { width: '100%', minWidth: 0, boxSizing: 'border-box', background: '#101216', color: T.text, border: `1px solid ${T.line2}`, borderRadius: 4, padding: '5px 8px', font: 'inherit' };
  const check = (key, label) => <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input className="tracking-checkbox" type="checkbox" checked={s[key]} onChange={e => update(key, e.target.checked)} />{label}</label>;
  const shifted = designBranch === 1 || designBranch === 2;
  const headerTarget = designBranch === 3 || designBranch === 4;
  const firstDetailRow = headerTarget ? 2 : 1;
  const trackingPointCard = extraStyle => <div style={{ ...box, ...extraStyle }}><label htmlFor="v1-audience-preset" style={title}>Tracking Point</label><div style={{ display: 'flex', gap: 8 }}><input id="v1-audience-preset" value={s.presetPoint} onChange={e => update('presetPoint',e.target.value)} style={field} /><button style={button} onClick={() => { update('savedPoint',{preset:s.presetPoint,peopleSize:s.peopleSize,placement:s.placement,height:s.height});setSaved(true); }}>Save</button></div>{saved && <span role="status" style={title}>Tracking point saved.</span>}</div>;
  const peopleSizeCard = extraStyle => <div style={{ ...box, display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, ...extraStyle }}>{[['peopleSize','People Size',['Upper Body','Full Body','Close Up']],['placement','Placement',['Center','Left','Right']],['height','Height',['Height1','Height2']]].map(([key,label,options]) => <div key={key}><label htmlFor={`v1-audience-${key}`} style={title}>{label}</label><select id={`v1-audience-${key}`} value={s[key]} onChange={e => update(key,e.target.value)} style={{ ...field, marginTop: 6 }}>{options.map(value => <option key={value}>{value}</option>)}</select></div>)}</div>;
  return <div id="aver-v1-audience-panel" style={{ height: '100%', minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gridTemplateRows: headerTarget ? 'auto repeat(2,minmax(0,1fr)) 49.265625px 67.96875px' : designBranch === 2 ? 'repeat(2,minmax(0,1fr)) auto auto' : 'repeat(2,minmax(0,1fr)) auto minmax(0,1fr)', alignContent: 'stretch', gap: headerTarget ? 8 : 6, columnGap: 8, fontSize: 13, color: T.text }}>
    {headerTarget && <div style={{ gridColumn: '1 / 4', gridRow: 1 }}><V4AudienceDesign key={designBranch} branch={designBranch} theme={T} header onInfo={() => info.current?.showModal()} /></div>}
    {designBranch === 1 && <div style={{ ...box, gridColumn: 1, gridRow: '1 / 3', justifyContent: 'center' }}><V4Context audience theme={T} /></div>}
    {designBranch === 2 && <div style={{ gridColumn: 1, gridRow: '1 / 3', height: '100%' }}><V4AudienceDesign key={designBranch} branch={designBranch} theme={T} onInfo={() => info.current?.showModal()} /></div>}
    {[[ 'sensitivity', 'Tracking Sensitivity', 1, 3 ], ['returnTime', 'Time of Return to Tracking Point', 3, 10]].map(([key,label,min,max], index) => <div key={key} style={{ ...box, gridColumn: shifted ? 2 : 1, gridRow: firstDetailRow + index, justifyContent: 'center', ...(headerTarget ? { padding: '4px 8px', gap: 2 } : {}) }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><label htmlFor={`v1-audience-${key}`} style={title}>{label}</label><output style={{ color: T.blue }}>{s[key]}</output></div><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>{min}</span><input id={`v1-audience-${key}`} type="range" min={min} max={max} value={s[key]} onChange={e => update(key,Number(e.target.value))} className="tr-sl" style={{ '--p': (s[key]-min)/(max-min)*100+'%', flex: 1, minWidth: 0 }} /><span>{max}</span></div></div>)}
    <div style={{ ...(headerTarget ? alignedBox : box), gridColumn: 1, gridRow: firstDetailRow + 2, justifyContent: 'center' }}>{check('multiPresenterTracking','Multi-Presenter Tracking')}</div>
    <div style={{ ...(headerTarget ? alignedBox : box), gridColumn: 1, gridRow: firstDetailRow + 3, justifyContent: 'center' }}><EffectiveTrackingArea enabled={s.effectiveArea} onToggle={() => update('effectiveArea',!s.effectiveArea)} saved={s.savedArea} onSave={value => update('savedArea',value)} color={T.blue} /></div>
    {headerTarget ? <div style={{ gridColumn: 2, gridRow: `${firstDetailRow} / ${firstDetailRow + 2}`, alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
      {trackingPointCard()}
      {peopleSizeCard()}
    </div> : <>
      {trackingPointCard({ gridColumn: 2, gridRow: shifted ? 3 : firstDetailRow, alignSelf: 'start' })}
      {peopleSizeCard({ gridColumn: 2, gridRow: shifted ? 4 : firstDetailRow + 1, alignSelf: 'start' })}
    </>}
    <div style={{ ...column, gridColumn: 3, gridRow: `${firstDetailRow} / ${firstDetailRow + 4}` }}>
      <div style={headerTarget ? alignedBox : box}><ShieldZone enabled={s.shieldZone} onToggle={value => update('shieldZone',value)} saved={s.shieldZones} onSave={value => update('shieldZones',value)} theme={T} /></div>
      {designBranch === 0 && <div style={{ ...box, alignItems: 'flex-start' }}><button type="button" onClick={() => info.current?.showModal()} style={{ border: 'none', padding: '4px 2px', background: 'transparent', color: T.dim, font: 'inherit', fontSize: 12.5, cursor: 'pointer' }}>ⓘ About Audience Mode</button></div>}
    </div>
    <AudienceTargetHelp dialogRef={info} theme={T} />
  </div>;
}
