import { useEffect, useState } from 'react';

export default function RtspSecurityCredentials({ enabled, credentials, onSave, theme: T }) {
  const [draft, setDraft] = useState(credentials);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setDraft(credentials);
  }, [credentials.username, credentials.password]);

  useEffect(() => {
    if (!enabled) {
      setDraft(credentials);
      setSavedNotice(false);
    }
  }, [enabled, credentials.username, credentials.password]);

  const update = (key, value) => {
    setDraft(previous => ({ ...previous, [key]: value }));
    setSavedNotice(false);
  };
  const dirty = draft.username !== credentials.username || draft.password !== credentials.password;
  const valid = Boolean(draft.username.trim() && draft.password);
  const canSave = enabled && dirty && valid;
  const fieldStyle = {
    width: '100%', height: 30, boxSizing: 'border-box', padding: '5px 8px',
    border: `1px solid ${T.line2}`, borderRadius: 4,
    background: enabled ? '#101216' : '#0a0b0c', color: enabled ? T.text : T.faint,
    fontFamily: 'inherit', fontSize: 12.5, outline: 'none',
  };

  return <div aria-label="RTSP credentials" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gridTemplateRows: 'auto minmax(28px, 1fr)', gap: '6px 8px', flex: '1 1 auto', minHeight: 0, opacity: enabled ? 1 : .5 }}>
    <div>
      <label htmlFor="rtsp-security-username" style={{ display: 'block', marginBottom: 3, color: T.dim, fontSize: 12, fontWeight: 600 }}>Username</label>
      <input id="rtsp-security-username" value={draft.username} disabled={!enabled} autoComplete="off" onChange={event => update('username', event.target.value)} style={{ ...fieldStyle, paddingRight: 9 }} />
    </div>
    <div>
      <label htmlFor="rtsp-security-password" style={{ display: 'block', marginBottom: 3, color: T.dim, fontSize: 12, fontWeight: 600 }}>Password</label>
      <input id="rtsp-security-password" type="password" value={draft.password} disabled={!enabled} autoComplete="new-password" onChange={event => update('password', event.target.value)} style={fieldStyle} />
    </div>
    <div style={{ gridColumn: '1 / -1', minHeight: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
      <span role="status" aria-live="polite" style={{ color: '#67d7a5', fontSize: 11.5 }}>{savedNotice ? 'RTSP credentials saved.' : ''}</span>
      <button type="button" disabled={!canSave} onClick={() => { onSave(draft); setSavedNotice(true); }} style={{ minHeight: 28, padding: '4px 14px', border: `1px solid ${canSave ? T.blue : T.line2}`, borderRadius: 4, background: canSave ? T.blue : '#0d0f11', color: canSave ? '#fff' : T.faint, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, cursor: canSave ? 'pointer' : 'not-allowed' }}>Save</button>
    </div>
  </div>;
}
