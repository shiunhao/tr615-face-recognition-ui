const AUDIO_THEME = {
  panel: "#1a1d21",
  panel2: "#212529",
  line: "#2c3138",
  line2: "#3a4048",
  text: "#e8eaec",
  dim: "#8e959c",
  faint: "#5e656d",
  blue: "#1e9bf0",
  green: "#37d67a",
};

const UI_FONT = "'Segoe UI','Noto Sans TC',system-ui,sans-serif";

export function createAudioIntegratedState() {
  return {
    micIp: "",
    micBrand: "Shure",
    micConnected: false,
    autoReturn: "Off",
    returningPreset: "Preset 0",
    triggerTimer: "0.5 sec",
    channels: Array.from({ length: 8 }, (_, index) => ({
      id: index + 1,
      camera: "Off",
      tracking: "Off",
      scene: "Off",
    })),
  };
}

export default function AudioIntegratedPanel({ value, onChange, onNotify }) {
  const T = AUDIO_THEME;
  const update = (key, nextValue) => onChange((previous) => ({ ...previous, [key]: nextValue }));
  const updateChannel = (index, key, nextValue) => onChange((previous) => ({
    ...previous,
    channels: previous.channels.map((channel, channelIndex) => channelIndex === index ? { ...channel, [key]: nextValue } : channel),
  }));
  const notify = (message) => onNotify?.(message);

  const section = {
    width: "100%",
    padding: 8,
    boxSizing: "border-box",
    background: T.panel,
    border: `1px solid ${T.line}`,
    borderRadius: 6,
  };
  const card = {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: `1px solid ${T.line}`,
    borderRadius: 4,
    background: "#0d0f12",
  };
  const head = {
    minHeight: 25,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    background: T.panel2,
    borderBottom: `1px solid ${T.line}`,
    color: T.dim,
    fontSize: 12.5,
    lineHeight: 1.2,
    fontWeight: 600,
  };
  const body = { padding: "8px 10px 10px", display: "flex", flexDirection: "column", gap: 7 };
  const label = { color: T.dim, fontSize: 11.5, fontWeight: 600, marginBottom: 4 };
  const control = {
    width: "100%",
    height: 30,
    boxSizing: "border-box",
    padding: "5px 8px",
    border: `1px solid ${T.line2}`,
    borderRadius: 4,
    outline: "none",
    background: "#101216",
    color: T.text,
    fontFamily: UI_FONT,
    fontSize: 13,
  };
  const button = (disabled = false) => ({
    minHeight: 30,
    padding: "5px 14px",
    border: `1px solid ${T.line2}`,
    borderRadius: 4,
    background: disabled ? "#0d0f11" : "#1a1d21",
    color: disabled ? T.faint : T.text,
    fontFamily: UI_FONT,
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
  });
  const choiceButton = (selected) => ({
    minWidth: 0,
    height: 30,
    padding: "4px 8px",
    border: `1px solid ${selected ? T.blue : T.line2}`,
    borderRadius: 6,
    background: selected ? T.blue : "#f0f1f2",
    color: selected ? "#fff" : "#111418",
    fontFamily: UI_FONT,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  });
  const compactSelect = { ...control, height: 27, padding: "3px 7px", fontSize: 12 };
  const channelColumns = "86px 44px repeat(3, minmax(78px, 1fr)) 86px";

  return (
    <div id="aver-audio-integrated-wrapper" style={{ width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", overflowY: "auto", paddingRight: 8, boxSizing: "border-box", fontFamily: UI_FONT }}>
      <div style={{ ...section, display: "grid", gridTemplateColumns: "minmax(230px, 1fr) minmax(0, 2.25fr)", gap: 10, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          <div style={card}>
            <div style={head}>Mic Settings</div>
            <div style={body}>
              <div>
                <div style={{ ...label, display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span>MIC IP</span>
                  <span style={{ color: value.micConnected ? T.green : T.faint }}>{value.micConnected ? "Connected" : "Disconnected"}</span>
                </div>
                <input aria-label="MIC IP" value={value.micIp} onChange={(event) => update("micIp", event.target.value)} style={control} />
              </div>
              <div>
                <div style={label}>MIC Brand</div>
                <select aria-label="MIC Brand" value={value.micBrand} onChange={(event) => update("micBrand", event.target.value)} style={control}>
                  <option>Shure</option>
                  <option>Sennheiser</option>
                  <option>Audio-Technica</option>
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button type="button" disabled={value.micConnected} onClick={() => { update("micConnected", true); notify("Microphone connection started"); }} style={button(value.micConnected)}>Start</button>
                <button type="button" disabled={!value.micConnected} onClick={() => { update("micConnected", false); notify("Microphone disconnected"); }} style={button(!value.micConnected)}>Stop</button>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={head}>No Audio Detected, Returning To Preset.</div>
            <div style={body}>
              <div>
                <div style={label}>Auto Return Timer</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 7 }}>
                  {["Off", "3 sec", "6 sec", "9 sec"].map((option) => <button key={option} type="button" onClick={() => update("autoReturn", option)} style={choiceButton(value.autoReturn === option)}>{option}</button>)}
                </div>
              </div>
              <div>
                <div style={label}>Returning Preset</div>
                <select aria-label="Returning Preset" value={value.returningPreset} onChange={(event) => update("returningPreset", event.target.value)} style={control}>
                  {Array.from({ length: 10 }, (_, index) => <option key={index}>Preset {index}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={head}>Audio Trigger Timer</div>
            <div style={body}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 7 }}>
                {["0.5 sec", "1 sec", "2 sec", "3 sec"].map((option) => <button key={option} type="button" onClick={() => update("triggerTimer", option)} style={choiceButton(value.triggerTimer === option)}>{option}</button>)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...card, alignSelf: "stretch" }}>
          <div style={head}>Microphone Channels</div>
          <div style={{ padding: 8, overflowX: "auto" }}>
            <div style={{ minWidth: 500 }}>
              <div style={{ display: "grid", gridTemplateColumns: channelColumns, gap: 6, alignItems: "center", padding: "2px 6px 7px", color: T.text, fontSize: 11.5, fontWeight: 600 }}>
                <span>Microphone</span><span style={{ textAlign: "center" }}>State</span><span>Camera</span><span>Tracking</span><span>Scenes</span><span style={{ textAlign: "center" }}>Edit Scenes</span>
              </div>
              {value.channels.map((channel, index) => (
                <div key={channel.id} style={{ display: "grid", gridTemplateColumns: channelColumns, gap: 6, alignItems: "center", minHeight: 38, padding: "5px 6px", borderTop: `1px solid ${T.line}` }}>
                  <span style={{ color: T.text, fontSize: 12.5, fontWeight: 600 }}>Channel {channel.id}</span>
                  <span aria-label={`Channel ${channel.id} ${value.micConnected ? "ready" : "disconnected"}`} style={{ display: "flex", justifyContent: "center" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: value.micConnected ? T.green : T.faint, boxShadow: value.micConnected ? `0 0 6px ${T.green}` : "none" }} /></span>
                  <select aria-label={`Channel ${channel.id} Camera`} value={channel.camera} onChange={(event) => updateChannel(index, "camera", event.target.value)} style={compactSelect}>
                    <option>Off</option>{Array.from({ length: 4 }, (_, cameraIndex) => <option key={cameraIndex + 1}>Camera {cameraIndex + 1}</option>)}
                  </select>
                  <select aria-label={`Channel ${channel.id} Tracking`} value={channel.tracking} onChange={(event) => updateChannel(index, "tracking", event.target.value)} style={compactSelect}><option>Off</option><option>On</option></select>
                  <select aria-label={`Channel ${channel.id} Scenes`} value={channel.scene} onChange={(event) => updateChannel(index, "scene", event.target.value)} style={compactSelect}>
                    <option>Off</option>{Array.from({ length: 8 }, (_, sceneIndex) => <option key={sceneIndex + 1}>Scene {sceneIndex + 1}</option>)}
                  </select>
                  <button type="button" onClick={() => notify(`Editing scenes for Channel ${channel.id}`)} style={{ ...button(false), minHeight: 27, padding: "3px 8px", fontSize: 11.5 }}>Edit Scenes</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
