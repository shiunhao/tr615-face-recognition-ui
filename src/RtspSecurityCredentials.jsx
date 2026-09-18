import { useEffect, useRef, useState } from 'react';

const ALLOWED_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!$%`()+,-./<=>?@[\\]^_{}~";
const CREDENTIALS_NOTE = 'Note: Username should be 1 to 32 characters. Password should be 8 to 32 characters with at least including alphabetical capital letters, lower case letters, and numbers and cannot be your username. Both username and password can contain numbers (0~9), letters (a~z, A~Z), and special characters (!$%`()+,-./<=>?@[\\]^_{}~).';

function validateCredentials({ username, password }) {
  const errors = [];
  const usesAllowedCharacters = value => [...value].every(character => ALLOWED_CHARACTERS.includes(character));

  if (username.length < 1 || username.length > 32) errors.push('Username must be 1 to 32 characters.');
  if (username && !usesAllowedCharacters(username)) errors.push('Username contains unsupported characters.');
  if (password.length < 8 || password.length > 32) errors.push('Password must be 8 to 32 characters.');
  if (password && !usesAllowedCharacters(password)) errors.push('Password contains unsupported characters.');
  if (!/[A-Z]/.test(password)) errors.push('Password must include at least one uppercase letter.');
  if (!/[a-z]/.test(password)) errors.push('Password must include at least one lowercase letter.');
  if (!/[0-9]/.test(password)) errors.push('Password must include at least one number.');
  if (username && password === username) errors.push('Password cannot be the same as the username.');

  return errors;
}

export default function RtspSecurityCredentials({ enabled, credentials, onSave, theme: T }) {
  const [draft, setDraft] = useState(credentials);
  const [savedNotice, setSavedNotice] = useState(false);
  const validationDialog = useRef(null);

  useEffect(() => {
    setDraft(credentials);
  }, [credentials.username, credentials.password]);

  useEffect(() => {
    if (!enabled) {
      setDraft(credentials);
      setSavedNotice(false);
      validationDialog.current?.close();
    }
  }, [enabled, credentials.username, credentials.password]);

  const update = (key, value) => {
    setDraft(previous => ({ ...previous, [key]: value }));
    setSavedNotice(false);
  };
  const dirty = draft.username !== credentials.username || draft.password !== credentials.password;
  const canSave = enabled && dirty;
  const save = () => {
    const errors = validateCredentials(draft);
    if (errors.length) {
      validationDialog.current?.showModal();
      return;
    }
    onSave(draft);
    setSavedNotice(true);
  };
  const fieldStyle = {
    width: '100%', height: 30, boxSizing: 'border-box', padding: '5px 8px',
    border: `1px solid ${T.line2}`, borderRadius: 4,
    background: enabled ? '#101216' : '#0a0b0c', color: enabled ? T.text : T.faint,
    fontFamily: 'inherit', fontSize: 12.5, outline: 'none',
  };

  return <><div aria-label="RTSP credentials" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gridTemplateRows: 'auto minmax(28px, 1fr)', gap: '6px 8px', flex: '1 1 auto', minHeight: 0, opacity: enabled ? 1 : .5 }}>
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
      <button type="button" disabled={!canSave} onClick={save} style={{ minHeight: 28, padding: '4px 14px', border: `1px solid ${T.line2}`, borderRadius: 4, background: canSave ? T.panel2 : '#0d0f11', color: canSave ? T.text : T.faint, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, cursor: canSave ? 'pointer' : 'not-allowed' }}>Save</button>
    </div>
  </div>
  <dialog ref={validationDialog} aria-labelledby="rtsp-validation-title" aria-describedby="rtsp-validation-note" style={{ width: 'min(520px, calc(100vw - 48px))', boxSizing: 'border-box', padding: 0, border: `1px solid ${T.line2}`, borderRadius: 8, background: T.panel, color: T.text, fontFamily: 'inherit', boxShadow: '0 20px 60px rgba(0,0,0,.58)' }}>
    <div style={{ padding: '16px 18px 12px', borderBottom: `1px solid ${T.line}` }}>
      <h2 id="rtsp-validation-title" style={{ margin: 0, fontSize: 16 }}>RTSP Security</h2>
    </div>
    <div style={{ padding: '14px 18px', fontSize: 13, lineHeight: 1.55 }}>
      <p id="rtsp-validation-note" style={{ margin: 0 }}>{CREDENTIALS_NOTE}</p>
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 18px 14px', borderTop: `1px solid ${T.line}` }}>
      <button type="button" autoFocus onClick={() => validationDialog.current?.close()} style={{ minWidth: 72, minHeight: 30, padding: '4px 16px', border: `1px solid ${T.line2}`, borderRadius: 4, background: '#101216', color: T.text, fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer' }}>OK</button>
    </div>
  </dialog></>;
}
