import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function Preview({ kind, value }) {
  const x = kind === 'placement' ? ({ Left: 25, Center: 50, Right: 75 }[value]) : 50;
  const y = kind === 'height' && value === 'Height2' ? 29 : 17;
  const scale = kind === 'peopleSize' ? ({ 'Full Body': 0.72, 'Upper Body': 1.25, 'Close Up': 2.2 }[value]) : 1;
  return <svg viewBox="0 0 100 70" aria-hidden="true" style={{ width: '100%', height: '100%', display: 'block', borderRadius: 4, background: '#101820' }}>
    <path d="M33 3V67M67 3V67M3 23H97M3 47H97" stroke="#2a3946" strokeDasharray="2 3" />
    <svg x="3" y="3" width="94" height="64" viewBox="3 3 94 64" overflow="hidden">
      <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#93c8ed">
        <circle cy="7" r="7" /><path d="M-13 42V27Q-13 17 0 17Q13 17 13 27V42Z" /><path d="M-7 40V62M7 40V62" stroke="#93c8ed" strokeWidth="6" />
      </g>
    </svg>
    {kind === 'height' && <path d={`M${x+15} 4V${y}M${x+12} 4H${x+18}M${x+12} ${y}H${x+18}`} fill="none" stroke="#f5be65" strokeWidth="1.5" />}
    <rect x="2" y="2" width="96" height="66" rx="4" fill="none" stroke="#4e7898" strokeWidth="2" />
  </svg>;
}

export default function FramingSelect({ kind, label, value, options, onChange }) {
  const trigger = useRef(null), popup = useRef(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [open, setOpen] = useState(false);
  function show() {
    const box = trigger.current.getBoundingClientRect();
    const width = Math.min(276, window.innerWidth - 24);
    setPosition({ left: Math.max(12, Math.min(box.left, window.innerWidth - width - 12)), top: Math.max(12, box.top - 145), width });
    popup.current.showPopover();
    requestAnimationFrame(() => popup.current.querySelector('[aria-selected="true"]')?.focus());
  }
  return <>
    <button ref={trigger} id={`v2-${kind}`} type="button" aria-label={`${label}: ${value}`} aria-haspopup="listbox" aria-expanded={open} onClick={() => open ? popup.current.hidePopover() : show()} style={{ width: '100%', minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '4px 7px', border: '1px solid #3b4149', borderRadius: 4, background: '#101216', color: '#eee', font: 'inherit', cursor: 'pointer' }}>
      <span style={{ width: 38, height: 27, flexShrink: 0 }}><Preview kind={kind} value={value} /></span><span style={{ flex: 1, textAlign: 'left' }}>{value}</span><span>▾</span>
    </button>
    {createPortal(<div ref={popup} popover="auto" onToggle={e => setOpen(e.newState === 'open')} style={{ position: 'fixed', inset: 'auto', margin: 0, ...position, height: 'auto', maxHeight: 'none', boxSizing: 'border-box', padding: 12, border: '1px solid #4a535f', borderRadius: 8, background: '#20252c', color: '#eee', fontFamily: 'Arial, sans-serif', fontSize: 13, lineHeight: 1.4, boxShadow: '0 12px 36px #0009' }}>
      <div style={{ fontSize: 12, marginBottom: 8 }}>{label}</div>
      <div role="listbox" aria-label={label} style={{ display: 'flex', gap: 8 }} onKeyDown={e => { const buttons = [...e.currentTarget.querySelectorAll('button')]; const i = buttons.indexOf(document.activeElement); if (['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length-1 : (i+(e.key === 'ArrowRight'?1:-1)+buttons.length)%buttons.length; buttons[next].focus(); } }}>
        {options.map(option => <button key={option} type="button" role="option" aria-selected={value === option} onClick={() => { onChange(option); popup.current.hidePopover(); trigger.current.focus(); }} style={{ flex: 1, minWidth: 0, padding: 6, border: `2px solid ${value === option ? '#219cef' : '#444c58'}`, borderRadius: 6, background: '#141a21', color: '#fff', cursor: 'pointer' }}><div style={{ height: 46 }}><Preview kind={kind} value={option} /></div><div style={{ fontSize: 12, marginTop: 6 }}>{option}{value === option ? ' ✓' : ''}</div></button>)}
      </div>
      {kind === 'height' && <div style={{ marginTop: 6, fontSize: 10, color: '#aab5c0' }}>Headroom illustration</div>}
    </div>, document.body)}
  </>;
}
