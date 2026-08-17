/* ============================================================================
 * AVer TR615 — Camera & Paint/Look WEB UI 原型  (V6)
 * ----------------------------------------------------------------------------
 * 用途:Pro AV PTZ 攝影機 TR615 之 WEB UI「Paint/Look」色彩調校介面原型。
 *       此為 UX/UI 設計原型 (React 單檔),非最終工程交付。色彩運算為前端 JS 模擬,
 *       實機由韌體 DSP 處理;原型的示波器/畫面僅供互動展示。
 *
 * 【V5 主要設計決策與變更摘要】(供接手者快速理解)
 *  1. Scene File(Scenes):
 *     - 升級為「場景庫」:原廠 Standard 卡(不可刪/不佔額度)+ 使用者Custom Scene(名稱/備註/縮圖,上限16)。
 *     - 與 Live View 整合為 filmstrip;場景條為「純取用層」(載入/編輯/Delete),
 *       「儲存/另存」動作放在調整區,符合「調完才存」的工作流。
 *     - dirty(已修改)採整個 st 狀態深度比對 → block 的 on/off 也算修改(理由見該處註解)。
 *  2. Multi-Matrix 提供三種 UX 呈現 (供設計比較,可切換):
 *     - Radar Wheel:選擇態(16軸等分環)↔ 聚焦態(只留選中軸、整環變該色相)。
 *     - 推桿台:16 Axes × S/H 雙直立推桿(混音台風格,命中區大、適合大幅塑形)。
 *     - 色卡矩陣:2×8 卡片密集網格(數值精確、總覽)。
 *  3. 16 Axes色相:等分 22.5°(已查證,見 AXIS_HUE 註解);全域 AXIS_HUE 與環顯示一致,
 *     影響範圍 falloff 亦對齊 22.5°。各軸「精確相位角」待韌體定義。
 *  4. 監看(示波器)三種:向量 / 波形 / 直方圖。向量鏡與波形為真實廣播工具
 *     (向量鏡含 75% 色靶概念與膚色線、波形為 0–100 IRE),但本原型的繪製為「示意級」,
 *     非儀器級精確視覺 —— 最終視覺需另開規格或接韌體 scope 輸出。
 *  5. 效能:畫面內部運算 1280×720;拖曳滑桿時自動切 320×180 低解析度 (baseCanvasDragRef/useDrag),
 *     放開回全解析度 → 兼顧靜止清晰與拖曳流暢。
 *  6. OFF 狀態:block 關閉時,內部控制項用真正的 disabled(非僅 CSS 變淡),
 *     避免鍵盤 Tab+方向鍵仍可調整的漏洞。
 *  7. 預覽圖:優先載入 /meeting_room.png,失敗則用程式繪製的 fallback 場景(可攜性)。
 *
 * 【待 PM / 韌體釐清】(散見各處 [PM] 標記)
 *  - Multi-Matrix 16 Axes各自的精確相位角與涵蓋範圍(以韌體為準)。
 *  - Scene dirty 是否須以「實際影響畫面的有效值」為準(目前 on/off 即算修改)。
 *  - Standard 是獨立原廠預設還是佔 Scene File 第 1 槽(韌體規格寫 1-16)。
 *  - 雙重 Saturation(Image Process 與 Multi-Matrix)疊加順序。
 *  - 示波器的儀器級視覺規格;Video & Audio 頁欄位值的規格依據。
 * ========================================================================== */

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";

// ============================================================================
// 1. 色彩與信號處理引擎 (Color & Signal Processing Engine)
// 這些函數模擬了攝影機內部 DSP 晶片的訊號處理流程。
// ============================================================================

/**
 * 數值限幅函數 (Clamp)，將數值限制在 0-255 之間
 */
const c255 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

/**
 * RGB 轉 HSV 色彩空間
 */
function rgb2hsv(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, mx === 0 ? 0 : d / mx, mx];
}

/**
 * HSV 轉 RGB 色彩空間
 */
function hsv2rgb(h, s, v) {
  h = ((h % 360) + 360) % 360;
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [r + m, g + m, b + m];
}

/**
 * 旋轉 RGB 顏色向量的色相 (Hue Rotate)
 */
function hueRotate(r, g, b, deg) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return [
    r * (0.213 + c * 0.787 - s * 0.213) + g * (0.715 - c * 0.715 - s * 0.715) + b * (0.072 - c * 0.072 + s * 0.928),
    r * (0.213 - c * 0.213 + s * 0.143) + g * (0.715 + c * 0.285 + s * 0.14) + b * (0.072 - c * 0.072 - s * 0.283),
    r * (0.213 - c * 0.213 - s * 0.787) + g * (0.715 - c * 0.715 + s * 0.715) + b * (0.072 + c * 0.928 + s * 0.072),
  ];
}

// 根據 Sony 廣播級攝影機標準定義 of 16 Axes色彩順序
// [2026-06-16 修改] 色相環選擇顏色Set從 12/16 Axes改為 6 Axes，移除過渡軸，僅保留 R, YL, G, CY, B, MG 6 個經典顏色。
const AXIS16 = ["R", "YL", "G", "CY", "B", "MG"];
const AXIS_NAME = { R: "Red", YL: "Yellow", G: "Green", CY: "Cyan", B: "Blue", MG: "Magenta" };

// 6 Axes對應的基礎色相角度 (0-360)。
// [設計決策 / 已查證] 6 Axes「等分」於色相環,每軸間隔 60° (360°÷6)。
// [變更歷史] 先前曾誤用非均勻的 HSL 近似值，現已更正為等分計算。
const AXIS_HUE = (() => {
  const o = {}; const idxR = AXIS16.indexOf("R");
  AXIS16.forEach((a, i) => { o[a] = ((i - idxR) * 60 + 360) % 360; });
  return o;
})();

/**
 * 應用 User Matrix 色彩矩陣調整
 * 模擬矩陣係數相互擠壓、色彩飽和度(level)與整體色相(phase)的線性變換
 */
function applyMatrix(R, G, B, m) {
  // 1. 套用 Phase (整體色相旋轉，範圍為 +/- 30 度)
  if (m.phase !== 0) [R, G, B] = hueRotate(R, G, B, (m.phase / 99) * 30);
  
  // 2. 套用六色混合矩陣 (R-G, R-B, G-R, G-B, B-R, B-G 色差擠壓)
  const k = 0.75; // 混合強度增益係數
  const nR = R + k * ((m.rg / 100) * (R - G) + (m.rb / 100) * (R - B));
  const nG = G + k * ((m.gr / 100) * (G - R) + (m.gb / 100) * (G - B));
  const nB = B + k * ((m.br / 100) * (B - R) + (m.bg / 100) * (B - G));
  R = nR; G = nG; B = nB;
  
  // 3. 套用 Level (整體飽和度調整)
  if (m.level !== 0) {
    const sat = 1 + m.level / 120;
    const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B; // Rec. 709 亮度公式
    R = Y + (R - Y) * sat;
    G = Y + (G - Y) * sat;
    B = Y + (B - Y) * sat;
  }
  return [R, G, B];
}

/**
 * 應用 16 Axes Multi-Matrix 局部色彩調整
 * 僅對最接近的兩個色相區間做平滑插值(Interpolation)調整，不影響其他色區
 */
function applyMulti(R, G, B, axes) {
  let [h, s, v] = rgb2hsv(R, G, B);
  if (s < 0.05) return [R, G, B]; // 忽略極低飽和度區（接近灰色/黑白的像素）

  // 尋找色相距離最近 of 16 Axes節點
  let best = 0, bd = 999;
  AXIS16.forEach((a, i) => {
    let d = Math.abs(((AXIS_HUE[a] - h + 540) % 360) - 180);
    if (d < bd) { bd = d; best = i; }
  });

  const ax = axes[AXIS16[best]];
  if (!ax || (ax.hue === 0 && ax.sat === 0)) return [R, G, B];

  // [2026-06-16 修改] 影響範圍 (半寬) 改與 6 Axes間距 60° 對齊，即半寬 30°；最大偏轉角度調整為約 30°
  const w = Math.max(0, 1 - bd / 30);
  h += (ax.hue / 99) * 30 * w;
  s *= 1 + (ax.sat / 99) * 0.85 * w;
  
  return hsv2rgb(h, Math.min(1, s), v);
}

/**
 * 應用色調與伽馬曲線控制 (Tone / Knee / Black Level)
 * - Black Level (黑位準): 對暗部進行提升或壓低
 * - Knee Point & Slope (高光壓縮): 針對高光部分做壓縮以保留過曝層次
 */
function applyTone(R, G, B, p) {
  // 取得黑電平微調值 (Master Black, R Black, B Black)
  const master = (p.masterBlack ?? 0) / 50 * 0.12;
  const rOffset = (p.rBlack ?? 0) / 50 * 0.12;
  const bOffset = (p.bBlack ?? 0) / 50 * 0.12;

  // 決定 Auto Knee 或手動 Knee 的 Point 和 Slope 參數
  let kp, slope;
  if (p.autoKnee) {
    kp = 85 / 109;       // 約 78% 起點
    slope = 0.35;        // 中度壓縮
  } else {
    kp = p.kneePoint / 109;
    slope = 0.5 + (p.kneeSlope + 5) / 20;
  }

  // 對個別通道進行黑位處理與 Knee
  const processChannel = (v, channelOffset) => {
    const bl = master + channelOffset;
    // 套用黑位補償
    v = v + bl * (1 - v);
    // Knee 總開關開啟時才套用高光壓縮曲線
    if (p.kneeOn && v > kp) {
      v = kp + (v - kp) * slope;
    }
    return v;
  };

  return [
    processChannel(R, rOffset),
    processChannel(G, 0),
    processChannel(B, bOffset)
  ];
}

/**
 * 應用輪廓細節增強 (Detail Level)
 * 模擬硬體內部的 3x3 拉普拉斯(Laplacian)邊緣檢測高頻濾波器
 */
function applyDetail(data, W, H, level) {
  if (level === 0) return data;
  const out = new Uint8ClampedArray(data);
  const amt = level / 7 * 0.6; // 調整強度係數

  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = (y * W + x) * 4;
      for (let c = 0; c < 3; c++) {
        // 拉普拉斯運算元 (邊緣高頻分量)
        const lap = 4 * data[i + c] - data[i - 4 + c] - data[i + 4 + c] - data[i - W * 4 + c] - data[i + W * 4 + c];
        out[i + c] = c255(data[i + c] + lap * amt);
      }
    }
  }
  return out;
}

// [設計決策 / 效能] 內部運算解析度維持 1280×720 以保畫面清晰。
//   逐像素 JS 色彩運算在高解析度下拖曳會卡,故採「動態降採樣」:拖曳滑桿時切到 320×180
//   低解析度即時預覽 (見 baseCanvasDragRef / useDrag),放開後回到全解析度。
//   → 兼顧「靜止清晰」與「拖曳流暢」,優於單純全程降解析度。實機由韌體處理,無此限制。
const SW = 1280, SH = 720;

/**
 * 備用繪製函數 (Fallback Draw)
 * 當外部圖片 /meeting_room.png 載入失敗時，以程式畫布渲染一個高品質的影音對談直播間。
 */
function drawFallbackScene(ctx) {
  // 1. 溫暖與日光色溫的簡約冷灰底牆漸層
  let g = ctx.createLinearGradient(0, 0, SW, SH);
  g.addColorStop(0, "rgb(155, 162, 170)"); 
  g.addColorStop(1, "rgb(98, 105, 114)");  
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SW, SH);

  // 2. 模擬來自左側的柔和日照光線
  const rg = ctx.createRadialGradient(SW * 0.2, SH * 0.2, 20, SW * 0.2, SH * 0.2, SW * 0.45);
  rg.addColorStop(0, "rgba(255, 252, 245, 0.9)");
  rg.addColorStop(1, "rgba(255, 252, 245, 0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, SW, SH);

  // 3. 繪製簡約的現代訪談長桌
  ctx.fillStyle = "rgb(42, 45, 48)";
  ctx.beginPath();
  ctx.moveTo(SW * 0.15, SH * 0.8);
  ctx.lineTo(SW * 0.85, SH * 0.8);
  ctx.lineTo(SW * 0.9, SH);
  ctx.lineTo(SW * 0.1, SH);
  ctx.closePath();
  ctx.fill();

  // 4. 繪製左、右兩側極簡現代設計師椅子的剪影
  // 左椅
  ctx.fillStyle = "rgb(30, 32, 35)";
  ctx.beginPath();
  ctx.moveTo(SW * 0.25, SH * 0.8);
  ctx.lineTo(SW * 0.35, SH * 0.8);
  ctx.lineTo(SW * 0.38, SH * 0.55);
  ctx.lineTo(SW * 0.22, SH * 0.55);
  ctx.closePath();
  ctx.fill();
  // 右椅
  ctx.fillStyle = "rgb(30, 32, 35)";
  ctx.beginPath();
  ctx.moveTo(SW * 0.65, SH * 0.8);
  ctx.lineTo(SW * 0.75, SH * 0.8);
  ctx.lineTo(SW * 0.78, SH * 0.55);
  ctx.lineTo(SW * 0.62, SH * 0.55);
  ctx.closePath();
  ctx.fill();

  // 5. 繪製桌上的專業直播麥克風
  ctx.strokeStyle = "rgb(20, 20, 20)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(SW * 0.5, SH * 0.8);    
  ctx.lineTo(SW * 0.48, SH * 0.7);   
  ctx.lineTo(SW * 0.52, SH * 0.62);  
  ctx.stroke();
  
  ctx.fillStyle = "rgb(50, 50, 50)";
  ctx.beginPath();
  ctx.arc(SW * 0.52, SH * 0.6, 10, 0, Math.PI * 2);
  ctx.fill();

  // 6. 底部標準色度參考色塊
  const colors = ["rgb(200, 50, 50)", "rgb(230, 160, 40)", "rgb(60, 150, 80)", "rgb(50, 110, 200)"];
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(SW - 130 + i * 28, SH - 36, 22, 22);
  });
}

// ============================================================================
// 2. UI 主題配色與樣式常數 (AVer UI Theme Colors)
// ============================================================================
const T = {
  page: "#0d0e10",       
  side: "#16181b",       
  sideActive: "#1e6fd9", 
  sideHover: "#202328",  
  panel: "#1a1d21",      
  panel2: "#212529",     
  line: "#2c3138",       
  line2: "#3a4048",      
  text: "#e8eaec",       
  dim: "#8e959c",        
  faint: "#5e656d",      
  blue: "#1e9bf0",       
  blueDark: "#1670b8",   
  green: "#37d67a",      
  amber: "#f5a623",      
};

const fUI = "'Segoe UI','Noto Sans TC',system-ui,sans-serif";
const fMono = "'Consolas','Courier New',monospace";

// ===== AVer Grid System v1(嵌入版)=====
// 24 欄 / gutter 16 / 邊距 24 / 容器 1350;8pt 間距刻度
// 版面寬度一律取格數:colW(N);間距一律取 SP 刻度
const GRIDSYS = { columns: 24, gutter: 16, margin: 24, containerMax: 1350 };
const SP = { 1: 4, 2: 8, 3: 16, 4: 24, 5: 32, 6: 48, 7: 64 };
const colW = (span, containerWidth = GRIDSYS.containerMax) => {
  const inner = containerWidth - GRIDSYS.margin * 2;
  const c = (inner - GRIDSYS.gutter * (GRIDSYS.columns - 1)) / GRIDSYS.columns;
  return Math.round(c * span + GRIDSYS.gutter * (span - 1));
};
// 常用格數寬(1350 容器):3格=149 4格=204 5格=259 6格=314 8格=423 12格=643
// [定案] 滿版格線為唯一基準(24 欄 fluid、gutter16、邊距24,含 sidebar):
//   內容面板佔 C5–C22(18 格):左緣壓 C5 起點、右緣壓 C22 終點
//   wrapper 寬 = calc(75vw - 40px);相對 stage 的 marginLeft = calc(16.6667vw - 225.33px)(clamp 0)
//   元件寬度 colW(N) 仍以 1350 基準溝通;容器對格、內容 hug。

// 主要功能選單區塊定義
const BLOCKS = [
  ["matrix", "Matrix", "Matrix Color Matrix"],
  // 2026-06-16 修改註記：將 Multi-Matrix 描述由 16 Axes改為 6 Axes
  ["multi", "Multi-Matrix", "6-Axis Color Correction"],
  // 2026-06 [PM 定案] 移除 Detail 分頁(render 分支與 applyDetail 效果保留為無作用 dead code,st.detail 維持預設 0)
  ["knee", "Knee", "Highlight Compression"],
  ["black", "Black Level", "Black Level"],
];

// Matrix 六色軸係數鍵值與中文提示
const MATRIX_KEYS = [
  ["level", "Level", ""],
  ["phase", "Phase", ""],
  ["rg", "R-G", ""],
  ["rb", "R-B", ""],
  ["gr", "G-R", ""],
  ["gb", "G-B", ""],
  ["br", "B-R", ""],
  ["bg", "B-G", ""]
];

const DEF_AXES = () => {
  const o = {};
  AXIS16.forEach((a) => (o[a] = { hue: 0, sat: 0 }));
  return o;
};

// 預設的標準原廠Set值 (Standard / Neutral Preset)
const DEF = {
  matrixOn: false, level: 0, phase: 0, rg: 0, rb: 0, gr: 0, gb: 0, br: 0, bg: 0,
  multiOn: false, axes: DEF_AXES(),
  detailOn: false, detail: 0,
  kneeOn: false, autoKnee: false, kneeSens: "Mid", kneePoint: 95, kneeSlope: 0,
  masterBlack: 0, rBlack: 0, bBlack: 0,
};

// ============================================================================
// 3. React 共用子組件 (Atoms Components)
// ============================================================================

/**
 * 數值滑動輸入組件 (Slider)
 */
function Slider({ k, label, hint, min, max, val, onChange, neutral = 0, onStartDrag, onEndDrag, disabled = false, dense = false, accent }) {
  return (
    <div style={{ marginBottom: dense ? 4 : 14, opacity: disabled ? 0.4 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: dense ? 2 : 5 }}>
        <span style={{ fontSize: 14, color: T.text }}>
          {label}
          {hint ? <span style={{ color: T.faint, fontSize: 14 }}> · {hint}</span> : null}
        </span>
        <span style={{ fontFamily: fMono, fontSize: 14, color: val === neutral ? T.faint : T.blue }}>
          {val > 0 && min < 0 ? "+" + val : val}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: fMono, fontSize: 14, color: T.faint, width: 24, textAlign: "right" }}>{min}</span>
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={val} 
          disabled={disabled}
          onChange={(e) => onChange(parseInt(e.target.value))} 
          onMouseDown={onStartDrag}
          onTouchStart={onStartDrag}
          onMouseUp={onEndDrag}
          onTouchEnd={onEndDrag}
          className="tr-sl" 
          style={{
            "--p": ((val - min) / (max - min)) * 100 + "%",
            cursor: disabled ? "not-allowed" : "pointer",
            background: accent ? `linear-gradient(90deg, ${accent} var(--p), #33393f var(--p))` : undefined
          }} 
        />
        <span style={{ fontFamily: fMono, fontSize: 14, color: T.faint, width: 24 }}>{max}</span>
      </div>
    </div>
  );
}

// ===== Matrix 迷你色相羅盤 (方案 B) =====
function mcPolar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}
function hexLerp(a, b, t) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
// 每條參數的視覺Set:type=shift(來源X→目標Y偏移) / intensity(向外擴張) / rotate(繞圈)
const MATRIX_VIS = {
  level: { type: "intensity" },
  phase: { type: "rotate" },
  rg: { type: "shift", x: "#ff3b30", y: "#34c759", ang: 120 },
  rb: { type: "shift", x: "#ff3b30", y: "#3b82f6", ang: 240 },
  gr: { type: "shift", x: "#34c759", y: "#ff3b30", ang: 0 },
  gb: { type: "shift", x: "#34c759", y: "#3b82f6", ang: 240 },
  br: { type: "shift", x: "#3b82f6", y: "#ff3b30", ang: 0 },
  bg: { type: "shift", x: "#3b82f6", y: "#34c759", ang: 120 },
};
function MatrixSwatch({ keyId, value }) {
  const cfg = MATRIX_VIS[keyId];
  if (!cfg) return null;
  const t = Math.min(1, Math.abs(value) / 99);
  let col;
  if (cfg.type === "shift") {
    // 平常顯示來源色 X(=這條在處理哪個顏色),調整時混向目標色 Y;負值往灰移(減去該成分)
    col = value >= 0 ? hexLerp(cfg.x, cfg.y, t * 0.9) : hexLerp(cfg.x, "#5a5f66", t * 0.75);
  } else if (cfg.type === "intensity") {
    // Level:整體濃度 — 由灰(低)漸變到飽和(高)
    col = hexLerp("#8a8f96", "#f0a93a", t);
  } else {
    // Phase:色相旋轉 — 色塊的色相隨值轉動
    col = `hsl(${(((value / 99) * 150) + 20 + 360) % 360} 78% 56%)`;
  }
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: col,
      border: "1px solid rgba(255,255,255,0.18)",
      boxShadow: `0 0 14px ${col}66, inset 0 1px 2px rgba(255,255,255,0.15)`,
      transition: "background .25s cubic-bezier(.16,1,.3,1), box-shadow .25s"
    }} />
  );
}

// ===== Matrix 色相環視覺化 (對齊 Multi-Matrix 樣式) =====
// 大色相環反映整體調整:Phase 旋轉色相、Level 改變飽和、串擾把 R/G/B 三個主標記沿環推移。
// [2026-06 改版] 改為隨容器 100% 縮放的響應式元件,並對齊 Multi-Matrix 的視覺語彙:
//   厚色環 + 緩轉虛線圈 + 圓形彩色節點徽章(白框/陰影/標籤) + 中央深色控制盤。
// 全部以 viewBox 0-100 座標系繪製節點/連線,色環與中央盤用百分比 inset → 容器多大就多大。
function MatrixRing({ level, phase, rg, rb, gr, gb, br, bg }) {
  const C = 50;          // viewBox 中心
  const Rn = 41;         // 節點所在半徑(落在色環帶上)
  const sat = Math.max(0.25, 1 + (level / 99) * 0.85);
  const rot = (phase / 99) * 45;
  // 三個主色的位移色相(被串擾推移)
  const prim = [
    { label: "R", base: 0, hue: 0 + (rg / 99) * 44 - (rb / 99) * 44 },
    { label: "G", base: 120, hue: 120 - (gr / 99) * 44 + (gb / 99) * 44 },
    { label: "B", base: 240, hue: 240 + (br / 99) * 44 - (bg / 99) * 44 },
  ];
  const place = (hueDeg, r) => {
    const rad = ((hueDeg + rot) * Math.PI) / 180;
    return [C + r * Math.sin(rad), C - r * Math.cos(rad)];
  };
  const anyMoved = prim.some((p) => Math.abs(p.hue - p.base) > 0.5);
  return (
    <div style={{ width: "100%", height: "100%", aspectRatio: "1", position: "relative", flexShrink: 0 }}>
      {/* 彩色圓環(conic + 徑向遮罩做甜甜圈) */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "conic-gradient(from 0deg, hsl(0,90%,55%), hsl(60,90%,55%), hsl(120,90%,55%), hsl(180,90%,55%), hsl(240,90%,55%), hsl(300,90%,55%), hsl(360,90%,55%))",
        filter: `hue-rotate(${rot}deg) saturate(${sat})`,
        WebkitMask: "radial-gradient(circle, transparent 42%, #000 44%)",
        mask: "radial-gradient(circle, transparent 42%, #000 44%)",
        boxShadow: "0 0 10px rgba(255,255,255,0.10)",
        transition: "filter .3s cubic-bezier(.16,1,.3,1)"
      }} />
      {/* 緩慢旋轉的虛線圈(沿用 Multi-Matrix 的 mmspin) */}
      <div style={{ position: "absolute", inset: "13%", borderRadius: "50%", border: "1.2px dashed rgba(255,255,255,0.16)", animation: "mmspin 35s linear infinite", pointerEvents: "none" }} />
      {/* 串擾位移連線 + 圓形節點徽章(viewBox SVG,隨容器縮放) */}
      <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
        <defs>
          <filter id="mtxNodeShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="0.6" stdDeviation="1.1" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>
        {prim.map((p) => {
          const [bx, by] = place(p.base, Rn);
          const [hx, hy] = place(p.hue, Rn);
          const nodeHue = (p.hue + rot + 360) % 360;
          const col = `hsl(${nodeHue} 85% 55%)`;
          const [r, g, b] = hsv2rgb(nodeHue, 0.85, 0.95);
          const moved = Math.abs(hx - bx) > 0.25 || Math.abs(hy - by) > 0.25;
          return (
            <g key={p.label} style={{ transition: "all .3s cubic-bezier(.16,1,.3,1)" }}>
              {moved && <line x1={bx} y1={by} x2={hx} y2={hy} stroke={col} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />}
              {moved && <circle cx={bx} cy={by} r="1.6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" />}
              <circle cx={hx} cy={hy} r="7" fill={`rgb(${r * 255},${g * 255},${b * 255})`} stroke="#fff" strokeWidth="1.4" filter="url(#mtxNodeShadow)" />
              <text x={hx} y={hy} textAnchor="middle" dominantBaseline="central" fontSize="6.2" fontWeight="800" fill="#fff" style={{ fontFamily: "monospace" }}>{p.label}</text>
            </g>
          );
        })}
      </svg>
      {/* 中央深色控制盤(對齊 Multi-Matrix 中央樣式) */}
      <div style={{ position: "absolute", inset: "22%", borderRadius: "50%", background: "radial-gradient(circle at 38% 30%, #181c21, #0e1114)", border: `1px solid ${anyMoved ? "rgba(30,155,240,0.4)" : "rgba(255,255,255,0.12)"}`, boxShadow: "inset 0 0 18px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, transition: "border-color .4s ease" }}>
        <span style={{ fontSize: 13, letterSpacing: 1.5, color: "rgba(255,255,255,0.42)", fontFamily: "monospace" }}>Matrix</span>
        <span style={{ fontSize: 23, fontWeight: 700, color: "rgba(255,255,255,0.88)", lineHeight: 1.1, marginTop: 1 }}>RGB</span>
        <span style={{ fontSize: 12, color: anyMoved ? "#f5a623" : "rgba(255,255,255,0.32)", fontFamily: "monospace", marginTop: 2 }}>{anyMoved ? "● Adjusted" : "3 Primary Crosstalk"}</span>
      </div>
    </div>
  );
}

// ===== Camera Settings 常數 =====
// 快門速度清單 (慢→快),index 對映滑桿
const SHUTTER_LIST = ["1/1", "1/2", "1/4", "1/8", "1/15", "1/30", "1/60", "1/100", "1/125", "1/250", "1/500", "1/1000", "1/2000", "1/4000", "1/10000"];
// 光圈清單 (關閉→最大),index 對映滑桿;左端標 0、右端標 F1.6
const IRIS_LIST = ["Close", "F14", "F11", "F9.6", "F8", "F6.8", "F5.6", "F4.8", "F4", "F3.4", "F2.8", "F2.4", "F2", "F1.8", "F1.6"];
const EXP_MODES = [
  ["auto", "Full Auto"],
  ["iris", "Iris Priority"],
  ["shutter", "Shutter Priority"],
  ["manual", "Manual"],
  ["bright", "Bright"],
];
// 各曝光模式下,哪些控制項可調 (1) / 變灰禁用 (0)
const EXP_ENABLED = {
  auto:    { ev: 1, shutter: 0, iris: 0, gain: 0, gainLimit: 1, blc: 1, slow: 1, wdr: 1, bright: 0 },
  iris:    { ev: 1, shutter: 0, iris: 1, gain: 0, gainLimit: 1, blc: 1, slow: 1, wdr: 1, bright: 0 },
  shutter: { ev: 1, shutter: 1, iris: 0, gain: 0, gainLimit: 1, blc: 1, slow: 0, wdr: 1, bright: 0 },
  manual:  { ev: 0, shutter: 1, iris: 1, gain: 1, gainLimit: 0, blc: 1, slow: 0, wdr: 1, bright: 0 },
  bright:  { ev: 0, shutter: 0, iris: 0, gain: 0, gainLimit: 0, blc: 1, slow: 1, wdr: 1, bright: 1 },
};
const CAM_DEFAULTS = {
  tab: "exp", expMode: "auto",
  ev: 0, shutterIdx: 6, irisIdx: 9, gain: 24, gainLimit: 24, blc: 0, ndFilter: "clear",
  slowShutter: false, wdr: "off", brightVal: 25,
  saturation: 5, sharpness: 2, contrast: 2,
  wbMode: "auto", rGain: 59, bGain: 102,
  noiseFilter: "off", mirror: false, flip: false, ldc: false,
};

// 曝光/影像處理用滑桿:支援字串端點標籤與字串數值顯示
function ExpSlider({ label, leftLabel, rightLabel, valueText, min, max, val, onChange, disabled, accent, id }) {
  const ac = accent || T.blue;
  return (
    <div style={{
      width: "100%",
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.10)",
      borderRadius: 8,
      padding: "10px 12px",
      boxSizing: "border-box",
      opacity: disabled ? 0.4 : 1
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 12.5, color: T.text, fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: fMono, fontSize: 12.5, color: disabled ? T.faint : ac }}>{valueText}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: fMono, fontSize: 11, color: T.faint, minWidth: 26, textAlign: "right" }}>{leftLabel}</span>
        <input id={id} type="range" min={min} max={max} value={val} disabled={disabled}
          onChange={(e) => onChange(parseInt(e.target.value))} className="tr-sl"
          style={{ "--p": ((val - min) / (max - min)) * 100 + "%", cursor: disabled ? "not-allowed" : "pointer", flex: 1 }} />
        <span style={{ fontFamily: fMono, fontSize: 11, color: T.faint, minWidth: 38 }}>{rightLabel}</span>
      </div>
    </div>
  );
}

// 方塊勾選框 (Slow Shutter / WDR / Mirror / Flip)
function CamCheck({ label, checked, onChange, disabled, id }) {
  return (
    <div id={id} onClick={() => { if (!disabled) onChange(!checked); }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid rgba(255, 255, 255, 0.10)",
        background: "rgba(255, 255, 255, 0.03)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        userSelect: "none",
        boxSizing: "border-box",
        flex: 1
      }}>
      <span style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${checked ? T.blue : T.line2}`, background: checked ? T.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1 }}>✓</span>}
      </span>
      <span style={{ fontSize: 12.5, color: T.text }}>{label}</span>
    </div>
  );
}

// 單選 (Tracking Control 用)
function CamRadio({ label, checked, onChange, id }) {
  return (
    <label id={id} onClick={onChange} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: checked ? T.text : T.dim, userSelect: "none" }}>
      <span style={{ width: 13, height: 13, borderRadius: "50%", border: `1.5px solid ${checked ? T.blue : T.line2}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {checked && <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue }} />}
      </span>
      {label}
    </label>
  );
}

// ===== 弧形量錶 (Colour Gauge) =====
// 角度約定:0°=頂端,順時針遞增
function gaugePolar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
}
function gaugeArc(cx, cy, r, startDeg, endDeg) {
  const [sx, sy] = gaugePolar(cx, cy, r, startDeg);
  const [ex, ey] = gaugePolar(cx, cy, r, endDeg);
  const large = (endDeg - startDeg) % 360 > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}
// 單一色彩弧形量錶:外圈光弧 = Gain(可拖曳),中央發光色盤,下方 Hue 細滑桿
function ColorGauge({ label, gain, hue, col, disabled, onGain, onHue, startDrag, endDrag }) {
  const ref = useRef(null);
  const dragRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 30); return () => clearTimeout(t); }, []);
  const START = 225, SWEEP = 270, C = 60, R = 46;
  const f = mounted ? (gain + 99) / 198 : 0;   // 進場時從 0 掃到目前值
  const endDeg = START + f * SWEEP;
  const [tx, ty] = gaugePolar(C, C, R, endDeg);
  const gid = "gg-" + label;
  const apply = (e) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    let ang = (Math.atan2(dx, -dy) * 180) / Math.PI;
    ang = (ang + 360) % 360;
    let sweep = (ang - START + 360) % 360;
    if (sweep > SWEEP) sweep = sweep > SWEEP + (360 - SWEEP) / 2 ? 0 : SWEEP;
    onGain(Math.round((sweep / SWEEP) * 198 - 99));
  };
  // 拖曳時即時跟手(無過渡);其餘變動(含進場掃針)用流暢緩動
  const tr = dragging ? "none" : "all 0.55s cubic-bezier(0.16,1,0.3,1)";
  // 外圈細刻度
  const ticks = [];
  for (let i = 0; i <= 12; i++) {
    const [x1, y1] = gaugePolar(C, C, R + 8, START + (i / 12) * SWEEP);
    const [x2, y2] = gaugePolar(C, C, R + 11, START + (i / 12) * SWEEP);
    ticks.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" strokeLinecap="round" />);
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg ref={ref} viewBox="0 0 120 120"
        onPointerDown={disabled ? undefined : (e) => { dragRef.current = true; setDragging(true); try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) {} startDrag && startDrag(); apply(e); }}
        onPointerMove={disabled ? undefined : (e) => { if (dragRef.current) apply(e); }}
        onPointerUp={disabled ? undefined : (e) => { dragRef.current = false; setDragging(false); try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (x) {} endDrag && endDrag(); }}
        style={{ touchAction: "none", cursor: disabled ? "default" : "pointer", display: "block", overflow: "visible", width: "100%", maxWidth: 128, height: "auto", aspectRatio: "1 / 1" }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="100%" stopColor={col} />
          </linearGradient>
          <filter id={gid + "-glow"} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id={gid + "-glowS"} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation={dragging ? 5 : 3.5} result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {ticks}
        <path d={gaugeArc(C, C, R, START, START + SWEEP)} fill="none" stroke="#23272d" strokeWidth="9" strokeLinecap="round" />
        <path d={gaugeArc(C, C, R, START, endDeg)} fill="none" stroke={`url(#${gid})`} strokeWidth="9" strokeLinecap="round" filter={`url(#${gid}-glow)`} style={{ transition: tr }} />
        <circle cx={C} cy={C} r="24" fill={col} filter={`url(#${gid}-glow)`} style={{ transition: "fill 0.3s ease" }} />
        <circle cx={C} cy={C} r="24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <text x={C} y={C + Math.min(6, 80 / label.length * 0.34)} textAnchor="middle" fontSize={Math.min(17, 84 / label.length)} fontWeight="800" fill="#fff">{label}</text>
        {dragging && <circle cx={tx} cy={ty} fill="none" stroke="#fff" strokeWidth="1.5" className="aver-gauge-pulse" />}
        <circle cx={tx} cy={ty} r={dragging ? 9 : 7} fill="#fff" filter={`url(#${gid}-glowS)`} style={{ transition: tr + ", r 0.18s ease" }} />
        <circle cx={tx} cy={ty} r="3.2" fill={col} style={{ transition: tr }} />
      </svg>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: -6 }}>
        <span style={{ fontSize: 11, color: T.faint, letterSpacing: 0.5 }}>GAIN</span>
        <span style={{ fontSize: 16, fontWeight: 700, fontFamily: fMono, color: gain !== 0 ? T.blue : T.dim, transition: "color .25s" }}>{gain > 0 ? "+" + gain : gain}</span>
      </div>
      <div style={{ width: "84%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, marginBottom: 1 }}>
          <span style={{ color: T.faint }}>HUE</span>
          <span style={{ color: hue !== 0 ? T.amber : T.faint, fontFamily: fMono, fontWeight: 600, transition: "color .25s" }}>{hue > 0 ? "+" + hue : hue}</span>
        </div>
        <input type="range" min={-99} max={99} value={hue} disabled={disabled}
          onChange={(e) => onHue(parseInt(e.target.value))}
          onMouseDown={startDrag} onTouchStart={startDrag} onMouseUp={endDrag} onTouchEnd={endDrag}
          className="tr-sl"
          style={{ "--p": ((hue + 99) / 198) * 100 + "%", height: 3, width: "100%", cursor: disabled ? "not-allowed" : "pointer", background: `linear-gradient(90deg, ${T.amber} ${((hue + 99) / 198) * 100}%, #33393f ${((hue + 99) / 198) * 100}%)` }} />
      </div>
    </div>
  );
}

/**
 * 開關按鈕組件 (Switch / Toggle)
 */
function Toggle({ on, onChange, label }) {
  // 2026-06-16 修改註記：為了解決 ON / OFF 寬度不同與 button:active 造成 UI 跳動的問題，
  // 將 button 標籤改為 div，並為 ON / OFF Set固定寬度 (32px)
  const isOnOff = label === "ON" || label === "OFF";
  const labelStyle = isOnOff
    ? { fontSize: 14, color: on ? T.text : T.dim, width: 32, display: "inline-block", textAlign: "left" }
    : { fontSize: 14, color: on ? T.text : T.dim };

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={() => onChange(!on)} 
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onChange(!on); } }}
      style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, userSelect: "none" }}
    >
      <span style={{ width: 34, height: 18, borderRadius: 9, background: on ? T.blue : T.line2, position: "relative", transition: "background .3s ease" }}>
        <span style={{ position: "absolute", top: 2, left: on ? 18 : 2, width: 14, height: 14, borderRadius: 7, background: "#fff", transition: "left .3s cubic-bezier(.34,1.56,.64,1)" }} />
      </span>
      {label && <span style={labelStyle}>{label}</span>}
    </div>
  );
}

/**
 * 區塊標題組件 (Block Header)
 */
function BlockHeader({ title, sub, right }) {
  return (
    // 2026-06-16 修改註記：配合 Chrome 100% 下防裁切，將 marginBottom 由 14 縮小為 6
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 10 }}>
      <div>
        <div style={{ fontSize: 17, fontWeight: 600, color: T.text }}>{title}</div>
        <div style={{ fontSize: 14, color: T.faint, marginTop: 2 }}>{sub}</div>
      </div>
      {right}
    </div>
  );
}

/**
 * 迷你按鈕組件 (Mini Button)
 */
function MiniBtn({ children, onClick, primary, disabled }) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      style={{ 
        flex: 1, width: "100%", boxSizing: "border-box", margin: 0, padding: "4px 0", fontSize: 14, cursor: disabled ? "default" : "pointer", 
        borderRadius: 5, border: `1px solid ${primary ? T.blueDark : T.line2}`, 
        background: primary ? "rgba(30,155,240,0.12)" : "transparent", 
        color: disabled ? T.faint : primary ? T.blue : T.dim, 
        opacity: disabled ? 0.45 : 1, fontFamily: fUI 
      }}
    >
      {children}
    </button>
  );
}

/**
 * 說明提示組件 (Note)
 */
function Note({ children }) {
  return (
    <div style={{ fontSize: 14, color: T.faint, lineHeight: 1.6, marginTop: 6, paddingTop: 8, borderTop: `1px solid ${T.line}` }}>
      {children}
    </div>
  );
}

/**
 * 警示提示組件 (Cross Hint)
 */
function CrossHint({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 10px", borderRadius: 7, background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.25)", fontSize: 14, color: "#d9b06a", lineHeight: 1.5 }}>
      <span style={{ fontSize: 14 }}>⚠</span>{children}
    </div>
  );
}

/**
 * 生成各參數狀態的單行摘要文字，供快照記錄與比較
 */
function summarize(d) {
  return (
    <>
      <div>Matrix {d.matrixOn ? "ON" : "OFF"} · LVL{d.level >= 0 ? "+" : ""}{d.level} PH{d.phase >= 0 ? "+" : ""}{d.phase}</div>
      <div>RG{d.rg >= 0 ? "+" : ""}{d.rg} RB{d.rb >= 0 ? "+" : ""}{d.rb} GR{d.gr >= 0 ? "+" : ""}{d.gr} GB{d.gb >= 0 ? "+" : ""}{d.gb} BR{d.br >= 0 ? "+" : ""}{d.br} BG{d.bg >= 0 ? "+" : ""}{d.bg}</div>
      <div>Multi {d.multiOn ? "ON" : "OFF"} · Detail {d.detailOn ? (d.detail >= 0 ? "+" : "") + d.detail : "OFF"} · Knee {d.kneeOn ? (d.autoKnee ? "AUTO" : `P${d.kneePoint}/S${d.kneeSlope >= 0 ? "+" : ""}${d.kneeSlope}`) : "OFF"} · BLK{d.black >= 0 ? "+" : ""}{d.black}</div>
    </>
  );
}

/**
 * 設置面板卡片 (Config Card)
 */
function ConfigCard({ title, children }) {
  return (
    <div style={{
      background: T.panel,
      border: `1px solid ${T.line}`,
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 10,
      width: "100%",
      boxSizing: "border-box"
    }}>
      {/* 標題欄 */}
      <div style={{
        background: "rgba(0, 0, 0, 0.22)",
        padding: "10px 16px",
        fontSize: 14,
        fontWeight: 600,
        color: "#fff",
        borderBottom: `1px solid ${T.line}`,
        fontFamily: fUI
      }}>
        {title}
      </div>
      {/* 內容區 */}
      <div style={{
        padding: "16px 20px",
        fontFamily: fUI
      }}>
        {children}
      </div>
    </div>
  );
}

/**
 * 垂直排列單選框組件 (Vertical Radio Button - 圓點在上，文字在下)
 */
function VerticalRadio({ label, checked, onChange, disabled }) {
  return (
    <label style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      cursor: disabled ? "not-allowed" : "pointer",
      userSelect: "none",
      minWidth: 70,
      opacity: disabled ? 0.45 : 1
    }}>
      <input 
        type="radio" 
        checked={checked} 
        onChange={disabled ? undefined : onChange} 
        style={{ display: "none" }} 
      />
      {/* 圓圈 */}
      <span style={{ 
        width: 14, 
        height: 14, 
        borderRadius: "50%", 
        border: checked ? `2px solid #fff` : `2px solid ${T.faint}`, 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        transition: "all 0.15s"
      }}>
        {checked && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
      </span>
      {/* 文字 */}
      <span style={{
        fontSize: 14,
        color: checked ? "#fff" : T.dim,
        fontWeight: checked ? 600 : 400,
        fontFamily: fUI
      }}>
        {label}
      </span>
    </label>
  );
}

/**
 * 下拉選擇框組件 (Select)
 */
function Select({ val, options, onChange, disabled, style }) {
  return (
    <select
      value={val}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        background: "#101216",
        border: `1px solid ${T.line2}`,
        borderRadius: 6,
        color: disabled ? T.faint : T.text,
        fontSize: 14,
        padding: "8px 12px",
        outline: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        width: "100%",
        maxWidth: 320,
        fontFamily: fUI,
        opacity: disabled ? 0.6 : 1,
        transition: "border-color 0.15s",
        boxSizing: "border-box",
        ...style
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt} style={{ background: "#1a1d21", color: T.text }}>
          {opt}
        </option>
      ))}
    </select>
  );
}

/**
 * 帶有 Header 標題的設置單元格 (Form Field Card Box)
 */
function FormField({ label, children, rightLabel, style }) {
  return (
    <div style={{
      border: `1.5px solid ${T.line}`,
      borderRadius: 4,
      background: "#08090a", // 完全黑色背景，與 AVer 設計稿保持一致
      display: "flex",
      flexDirection: "column",
      minHeight: 84, // 統一控制高度以利網格對齊
      boxSizing: "border-box",
      width: "100%",
      ...style
    }}>
      {/* 小 Header 標籤 */}
      <div style={{
        background: "#22252a", // 灰色小 Header 背景
        padding: "4px 12px",
        fontSize: 14,
        fontWeight: 600,
        color: T.dim,
        borderBottom: `1.5px solid ${T.line}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: fUI
      }}>
        <span>{label}</span>
        {rightLabel !== undefined && <span style={{ color: T.blue, fontFamily: fMono }}>{rightLabel}</span>}
      </div>
      {/* 內容 Control 區域 */}
      <div style={{
        padding: "8px 12px",
        flex: 1,
        display: "flex",
        alignItems: "center",
        background: "#08090a",
        fontFamily: fUI,
        boxSizing: "border-box"
      }}>
        {children}
      </div>
    </div>
  );
}

/**
 * 用於 FormField 內置的滑動條組件 (Body Slider)
 */
function BodySlider({ val, min, max, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "0 6px", boxSizing: "border-box" }}>
      <span style={{ fontSize: 13, color: T.faint, width: 14, textAlign: "right", fontFamily: fMono }}>{min}</span>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={val} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="tr-sl" 
        style={{ 
          "--p": ((val - min) / (max - min)) * 100 + "%",
          flex: 1,
          height: 4,
          borderRadius: 2
        }} 
      />
      <span style={{ fontSize: 13, color: T.faint, width: 14, fontFamily: fMono }}>{max}</span>
    </div>
  );
}

// [2026-06 Task3] 「AVer 原廠預設」卡片改用固定示意圖,不從 live 畫面擷取。
// RD 疑慮:原廠卡縮圖無明確擷取時機(開機抓?哪個時間點?),不合理;故以一張固定設計圖示意。
// 其餘使用者場景仍於「Save as New Scene」當下擷取 live 畫面。此為設計用占位圖,實作時可換成 RD 提供的正式素材。
const STD_FIXED_THUMB = "aver_default_meeting_room.png";

/**
 * 右側Scenes的小方塊縮圖按鈕 (Scene Select Grid Tile)
 */
function SceneTile({ thumb, name, remark, active, dirty, factory, onLoad, onEdit, onDelete }) {
  return (
    <div className="aver-pop" style={{ 
      padding: "0px", 
      boxSizing: "border-box", 
      width: "100%"
    }}>
      <div style={{ 
        position: "relative", 
        width: "100%", 
        borderRadius: 8, 
        overflow: "hidden", 
        background: T.panel2, 
        border: `1.5px solid ${T.line}`, 
        boxSizing: "border-box",
        transition: "all 0.15s ease"
      }}>
        {/* 藍色選擇框 — 位於圖層最上面 (zIndex: 9999)，粗細為 3px，使用內側 3px 確保圓角與邊緣絕無裁切問題 */}
        {active && (
          <div style={{
            position: "absolute",
            inset: 0,
            border: `3px solid ${T.blue}`,
            borderRadius: 8,
            pointerEvents: "none", // 點擊穿透，不影響使用者操作卡片內的按鈕
            zIndex: 9999, // 圖層最上層
            boxSizing: "border-box"
          }} />
        )}
        
        <div onClick={onLoad} title={remark || name} style={{ cursor: "pointer" }}>
          {/* [2026-06 Task2] 縮圖高度由 16/9 比例改為固定 50px,讓Scenes面板完整高度可一次容納約 6 張卡。
              標題列與編輯/Delete按鈕維持原尺寸(不再縮小)。 */}
          <div style={{ position: "relative", height: 50, background: "#0a0c0e" }}>
            {thumb ? (
              <img 
                src={thumb} 
                alt="" 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover", 
                  display: "block"
                }} 
              />
            ) : (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%", 
                color: T.faint, 
                fontSize: 14
              }}>
                No Thumbnail
              </div>
            )}
            {/* Cancel藍色勾勾：只在 active 且有修改未儲存 (dirty) 時，才在最上層顯示黃色的驚嘆號警告標記 */}
            {active && dirty && (
              <span style={{ 
                position: "absolute", 
                right: 8, 
                top: 8, 
                width: 18, 
                height: 18, 
                borderRadius: "50%", 
                background: T.amber, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
                border: "1px solid #fff",
                fontSize: 12,
                fontWeight: "bold",
                color: "#fff",
                zIndex: 10000 // 高於 5px 選擇框，確保正常疊放
              }}>
                !
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 8px 7px", background: "transparent" }}>
            <span style={{ 
              flex: 1, 
              fontSize: 14, 
              fontWeight: active ? 700 : 500, 
              color: active ? "#fff" : T.text, 
              whiteSpace: "nowrap", 
              overflow: "hidden", 
              textOverflow: "ellipsis" 
            }}>
              {name}
            </span>
            {!factory && (
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(); }} 
                  title="Edit Name and Note" 
                  style={{ 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer", 
                    color: T.dim, 
                    fontSize: 14, 
                    padding: "2px", 
                    lineHeight: 1,
                    opacity: 0.7,
                    transition: "opacity 0.2s"
                  }}
                >
                  ✎
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                  title="Delete" 
                  style={{ 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer", 
                    color: T.dim, 
                    fontSize: 14, 
                    padding: "2px", 
                    lineHeight: 1,
                    opacity: 0.7,
                    transition: "opacity 0.2s"
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. React App 主要元件 (Main Application Component)
// ============================================================================
const FACE_ENROLLMENT_DEMO_IMAGE = "face-enrollment-demo-tech-office-v6.png";
const FACE_ENROLLMENT_DEMO_SIZE = { width: 1672, height: 941 };
const LIVE_PRESET_COUNT = 256;
const LIVE_PRESETS_PER_PAGE = 12;
const LIVE_PRESET_PAGE_COUNT = Math.ceil(LIVE_PRESET_COUNT / LIVE_PRESETS_PER_PAGE);
const FACE_ENROLLMENT_CANDIDATES = [
  { id: "front-left", status: "eligible", label: "Enrolled", crop: { x: 276, y: 397, size: 154 } },
  { id: "front-center", status: "eligible", label: "Enrolled", crop: { x: 585, y: 108, size: 138 } },
  { id: "front-right", status: "eligible", label: "Enrolled", crop: { x: 1007, y: 399, size: 170 } },
  { id: "side-profile", status: "side-angle", label: "Side angle", crop: { x: 1404, y: 330, size: 186 } },
  { id: "blurred-distance", status: "low-quality", label: "Low quality", crop: { x: 1174, y: 157, size: 158 } },
];

function FaceEnrollmentCrop({ candidateId, label, recaptured = false }) {
  const candidate = FACE_ENROLLMENT_CANDIDATES.find((item) => item.id === candidateId) || FACE_ENROLLMENT_CANDIDATES[0];
  const { x, y, size } = candidate.crop;
  const recaptureInset = recaptured ? size * 0.08 : 0;
  const cropSize = size - recaptureInset * 2;
  return (
    <svg role="img" aria-label={label} viewBox={`${x + recaptureInset} ${y + recaptureInset} ${cropSize} ${cropSize}`} preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <image href={FACE_ENROLLMENT_DEMO_IMAGE} x="0" y="0" width={FACE_ENROLLMENT_DEMO_SIZE.width} height={FACE_ENROLLMENT_DEMO_SIZE.height} preserveAspectRatio="none" />
    </svg>
  );
}

export default function App() {
  const [st, setSt] = useState(JSON.parse(JSON.stringify(DEF)));
  const [block, setBlock] = useState("matrix");
  const [selAxis, setSelAxis] = useState(null);
  // [2026-06] 拖曳色彩控制項時,在 Multi-Matrix 色相環上放一個「由內而外、一閃而過」的光圈(沿用Radar Wheel focus 進場語彙)。
  // { axis, key },key 遞增以每次拖曳重播動畫。
  const [wheelFlash, setWheelFlash] = useState(null);
  const triggerWheelFlash = (axis) => setWheelFlash((b) => ({ axis, key: (b?.key || 0) + 1 }));
  const [scenes, setScenes] = useState([]);            
  const [activeScene, setActiveScene] = useState("std"); 
  
  // 深度比對當前狀態與載入場景資料，以即時判定Set是否被修改過 (isDirty)
  const getActiveSceneData = () => {
    if (activeScene === "std") return DEF;
    const curSc = scenes.find((x) => x.id === activeScene);
    return curSc ? curSc.data : DEF;
  };
  // [設計決策] dirty 採「整個 st 狀態深度比對」，因此 block 的 on/off 切換也會被算為「已修改」，
  // 即使數值仍為中性 (例如 Matrix on 但所有值為 0)。這是刻意的，不是疏漏，理由：
  //   1. Scene File 儲存/還原的是「完整狀態」，含所有 on/off 開關。若 on/off 不算 dirty，
  //      使用者打開某功能卻不被提示儲存，該開關狀態就會在未存檔時遺失，造成場景無法完整重現。
  //   2. 「打開某功能」本身即是一種使用者意圖的表達，值得被納入場景。
  // 取捨：唯一可議的邊界是「on 了但值全中性、輸出實際未變」仍標記 dirty，目前接受此行為。
  // 若 PM 定義「修改」須以『實際影響畫面的有效值』為準，可改用 blockActive() 系列做有效性判定。
  const isDirty = JSON.stringify(st) !== JSON.stringify(getActiveSceneData());

  const [saveOpen, setSaveOpen] = useState(false);
  const [libOpen, setLibOpen] = useState(false);
  const [scName, setScName] = useState("");
  const [scRemark, setScRemark] = useState("");
  const [editingScene, setEditingScene] = useState(null); 
  const [edName, setEdName] = useState("");
  const [edRemark, setEdRemark] = useState("");
  const [stdThumb, setStdThumb] = useState(null);
  const [scope, setScope] = useState("vector");
  const [showScope, setShowScope] = useState(false);
  const [bypass, setBypass] = useState(false);
  const [colorBars, setColorBars] = useState(false); // Live 預覽切換為 SMPTE 彩條測試圖
  // Network 頁面狀態
  const [net, setNet] = useState({
    dhcp: "on", hostname: "TR315-11c96d", ntp: "off",
    ip: "192.168.1.168", netmask: "255.255.255.0", gateway: "192.168.1.254", dns: "8.8.8.8",
    ntpServer: "pool.ntp.org",
    rtmpUrl: "", rtmpKey: "", rtspSec: "off", rtspAudio: "off", hlsUrl: "",
    srtIp: "", srtPort: "8889", srtEnc: "None", srtLatency: "1000", srtPass: "",
    https: "off", sshd: "off", viscaMode: "Default", viscaPort: "52381",
  });
  const updNet = (k, v) => setNet((p) => ({ ...p, [k]: v }));
  // Tracking Settings 頁面狀態
  const [trk, setTrk] = useState({
    tab: "face",
    sensitivity: 2, returnTime: 3, presetPoint: "1",
    peopleSize: "Upper Body", placement: "Center", height: "Height1",
    effectiveArea: false, autoZoom: true, autoTilt: true, autoZoomPreset: "Preset 1",
    multiPresenterTracking: false, multiPresenter: "off", shieldZone: false,
    zoneId: "Zone 1", zoneResponse: "Auto", zoneTransition: 5, zoneEnabled: true, zoneTrackingPoint: "Preset 6",
    hybridPriority: "Presenter", hybridFallback: "Zone 1", hybridHoldTime: 5,
    framingMode: "Auto Framing", framingSize: "Medium", framingSpeed: 5, groupFraming: true,
    gestureEnabled: false, gestureTimeout: 5, gestureFeedback: true,
    faceEnrollment: false, faceSelection: "Auto", faceAction: "Track selected face",
    faceCaptureState: "idle", faceBatchResult: null, enrolledFaces: [],
  });
  const updTrk = (k, v) => setTrk((p) => ({ ...p, [k]: v }));
  const [draggedFaceId, setDraggedFaceId] = useState(null);
  const [faceDragOverlay, setFaceDragOverlay] = useState(null);
  const [faceDeleteTarget, setFaceDeleteTarget] = useState(null);
  const [faceEnrollmentNoDataDialogOpen, setFaceEnrollmentNoDataDialogOpen] = useState(false);
  const [faceLibraryFullDialogOpen, setFaceLibraryFullDialogOpen] = useState(false);
  const [editingFaceId, setEditingFaceId] = useState(null);
  const [editingFaceName, setEditingFaceName] = useState("");
  const [faceEnrollmentTourOpen, setFaceEnrollmentTourOpen] = useState(false);
  const [faceSelectFlow, setFaceSelectFlow] = useState({ stage: "ready", candidateId: null });
  const [faceSelectCoachmarkVisible, setFaceSelectCoachmarkVisible] = useState(false);
  const [faceSelectCoachmarkDismissed, setFaceSelectCoachmarkDismissed] = useState(false);
  const [hoveredFaceCandidateId, setHoveredFaceCandidateId] = useState(null);
  const faceEnrollTimerRef = useRef(null);
  const faceSelectTimersRef = useRef([]);
  const faceDraggingIdRef = useRef(null);
  const faceDragOverRef = useRef(null);
  const facePointerDragRef = useRef(null);
  const faceCardPositionsRef = useRef(new Map());
  const captureFaceCardPositions = () => {
    const positions = new Map();
    document.querySelectorAll("[data-face-id]").forEach((card) => {
      positions.set(card.getAttribute("data-face-id"), card.getBoundingClientRect());
    });
    faceCardPositionsRef.current = positions;
  };
  const resequenceFaces = (faces) => faces.map((face, index) => ({ ...face, priority: index + 1 }));
  const reorderEnrolledFaces = (sourceId, targetId) => {
    captureFaceCardPositions();
    setTrk((p) => {
      const fromIndex = p.enrolledFaces.findIndex((face) => face.id === sourceId);
      const targetIndex = p.enrolledFaces.findIndex((face) => face.id === targetId);
      if (fromIndex < 0 || targetIndex < 0 || fromIndex === targetIndex) return p;
      const nextFaces = [...p.enrolledFaces];
      const [movingFace] = nextFaces.splice(fromIndex, 1);
      nextFaces.splice(targetIndex, 0, movingFace);
      return { ...p, enrolledFaces: resequenceFaces(nextFaces) };
    });
  };
  const startFaceDrag = (event, faceId) => {
    faceDraggingIdRef.current = faceId;
    setDraggedFaceId(faceId);
    faceDragOverRef.current = null;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(faceId));
  };
  const moveFaceDuringDrag = (event, targetId) => {
    event.preventDefault();
    const sourceId = faceDraggingIdRef.current;
    if (sourceId == null || sourceId === targetId || faceDragOverRef.current === targetId) return;
    faceDragOverRef.current = targetId;
    reorderEnrolledFaces(sourceId, targetId);
  };
  const finishFaceDrag = () => {
    faceDraggingIdRef.current = null;
    setDraggedFaceId(null);
    faceDragOverRef.current = null;
  };
  const startFacePointerDrag = (event, faceId) => {
    if (event.button !== 0 || event.target.closest("button, input")) return;
    const cardRect = event.currentTarget.getBoundingClientRect();
    facePointerDragRef.current = {
      faceId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - cardRect.left,
      offsetY: event.clientY - cardRect.top,
      active: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const moveFacePointerDrag = (event) => {
    const pointerDrag = facePointerDragRef.current;
    if (!pointerDrag) return;
    const distance = Math.hypot(event.clientX - pointerDrag.startX, event.clientY - pointerDrag.startY);
    if (!pointerDrag.active && distance < 6) return;
    if (!pointerDrag.active) {
      pointerDrag.active = true;
      faceDraggingIdRef.current = pointerDrag.faceId;
      setDraggedFaceId(pointerDrag.faceId);
    }
    event.preventDefault();
    setFaceDragOverlay({
      faceId: pointerDrag.faceId,
      x: event.clientX - pointerDrag.offsetX,
      y: event.clientY - pointerDrag.offsetY,
    });
    const targetCard = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-face-id]");
    const targetId = targetCard ? Number(targetCard.getAttribute("data-face-id")) : null;
    if (targetId == null || targetId === pointerDrag.faceId || faceDragOverRef.current === targetId) return;
    faceDragOverRef.current = targetId;
    reorderEnrolledFaces(pointerDrag.faceId, targetId);
  };
  const finishFacePointerDrag = (event) => {
    if (facePointerDragRef.current?.active) event.preventDefault();
    facePointerDragRef.current = null;
    setFaceDragOverlay(null);
    finishFaceDrag();
  };
  const startInlineFaceNameEdit = (face) => {
    setEditingFaceId(face.id);
    setEditingFaceName(face.name || "");
  };
  const finishInlineFaceNameEdit = (save = true) => {
    if (editingFaceId == null) return;
    if (save) {
      setTrk((p) => ({
        ...p,
        enrolledFaces: p.enrolledFaces.map((face) => face.id === editingFaceId ? { ...face, name: editingFaceName.trim() } : face),
      }));
    }
    setEditingFaceId(null);
    setEditingFaceName("");
  };
  const confirmFaceDelete = () => {
    if (!faceDeleteTarget) return;
    captureFaceCardPositions();
    setTrk((p) => {
      const deletedFace = p.enrolledFaces.find((face) => face.id === faceDeleteTarget.id);
      const remainingFaces = p.enrolledFaces.filter((face) => face.id !== faceDeleteTarget.id);
      const candidateStillExists = deletedFace?.candidateId
        ? remainingFaces.some((face) => face.candidateId === deletedFace.candidateId)
        : false;
      const nextBatchResult = p.faceBatchResult
        ? {
            ...p.faceBatchResult,
            enrolled: Math.max(0, (p.faceBatchResult.enrolled ?? 0) - 1),
            addedCandidateIds: deletedFace?.candidateId && !candidateStillExists
              ? (p.faceBatchResult.addedCandidateIds ?? []).filter((candidateId) => candidateId !== deletedFace.candidateId)
              : (p.faceBatchResult.addedCandidateIds ?? []),
          }
        : null;
      return {
        ...p,
        enrolledFaces: resequenceFaces(remainingFaces),
        faceBatchResult: nextBatchResult,
      };
    });
    if (editingFaceId === faceDeleteTarget.id) {
      setEditingFaceId(null);
      setEditingFaceName("");
    }
    setFaceDeleteTarget(null);
  };
  useLayoutEffect(() => {
    const nextPositions = new Map();
    document.querySelectorAll("[data-face-id]").forEach((card) => {
      const faceId = card.getAttribute("data-face-id");
      const nextRect = card.getBoundingClientRect();
      nextPositions.set(faceId, nextRect);
      const previousRect = faceCardPositionsRef.current.get(faceId);
      if (!previousRect || String(draggedFaceId) === faceId) return;
      const deltaX = previousRect.left - nextRect.left;
      const deltaY = previousRect.top - nextRect.top;
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
      card.animate?.(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
          { transform: "translate(0, 0)" },
        ],
        { duration: 240, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      );
    });
    faceCardPositionsRef.current = nextPositions;
  }, [trk.enrolledFaces, draggedFaceId]);
  const startFaceBatchEnrollment = () => {
    if (trk.faceCaptureState === "loading" || faceSelectFlow.stage !== "ready") return;
    setFaceSelectCoachmarkVisible(false);
    clearFaceSelectTimers();
    setFaceSelectFlow({ stage: "ready", candidateId: null });
    if (faceEnrollTimerRef.current) clearTimeout(faceEnrollTimerRef.current);
    setTrk((p) => ({ ...p, faceCaptureState: "loading", faceBatchResult: null }));
    faceEnrollTimerRef.current = setTimeout(() => {
      setFaceSelectCoachmarkDismissed(false);
      const eligibleFaces = FACE_ENROLLMENT_CANDIDATES.filter((candidate) => candidate.status === "eligible");
      setTrk((p) => {
        return {
          ...p,
          faceCaptureState: "complete",
          faceBatchResult: {
            detected: FACE_ENROLLMENT_CANDIDATES.length,
            enrolled: 0,
            rejected: FACE_ENROLLMENT_CANDIDATES.length - eligibleFaces.length,
            capacitySkipped: 0,
            addedCandidateIds: [],
          },
        };
      });
      faceEnrollTimerRef.current = null;
    }, 1000);
  };
  const addAllEligibleFaces = () => {
    if (trk.enrolledFaces.length >= 20) {
      setFaceLibraryFullDialogOpen(true);
      return;
    }
    if (trk.faceCaptureState !== "complete" || faceSelectFlow.stage !== "ready") return;
    const eligibleFaces = FACE_ENROLLMENT_CANDIDATES.filter((candidate) => candidate.status === "eligible");
    const availableSlots = Math.max(0, 20 - trk.enrolledFaces.length);
    const addedCount = Math.min(eligibleFaces.length, availableSlots);
    if (addedCount === 0) return;
    setFaceSelectCoachmarkVisible(false);
    setFaceSelectCoachmarkDismissed(true);
    setTrk((p) => {
      const existingAddedIds = new Set(p.faceBatchResult?.addedCandidateIds ?? []);
      const batchCandidates = FACE_ENROLLMENT_CANDIDATES.filter((candidate) => candidate.status === "eligible");
      const slots = Math.max(0, 20 - p.enrolledFaces.length);
      const addedCandidates = batchCandidates.slice(0, slots);
      const batchId = Date.now();
      const newFaces = addedCandidates.map((candidate, index) => ({
        id: batchId + index,
        name: "",
        priority: p.enrolledFaces.length + index + 1,
        candidateId: candidate.id,
      }));
      return {
        ...p,
        enrolledFaces: [...p.enrolledFaces, ...newFaces],
        faceBatchResult: {
          ...(p.faceBatchResult ?? {}),
          enrolled: (p.faceBatchResult?.enrolled ?? 0) + newFaces.length,
          capacitySkipped: Math.max(0, batchCandidates.length - newFaces.length),
          addedCandidateIds: [...existingAddedIds, ...addedCandidates.map((candidate) => candidate.id)],
        },
      };
    });
  };
  const resumeFaceEnrollmentLiveView = () => {
    if (faceSelectFlow.stage !== "ready") return;
    setFaceSelectCoachmarkVisible(false);
    setFaceSelectCoachmarkDismissed(false);
    setHoveredFaceCandidateId(null);
    setTrk((p) => ({ ...p, faceCaptureState: "idle", faceBatchResult: null }));
  };
  const clearFaceSelectTimers = () => {
    faceSelectTimersRef.current.forEach((timer) => clearTimeout(timer));
    faceSelectTimersRef.current = [];
  };
  useEffect(() => {
    const shouldShow = trk.faceCaptureState === "complete"
      && faceSelectFlow.stage === "ready"
      && !faceSelectCoachmarkDismissed
      && trk.enrolledFaces.length < 20;
    if (!shouldShow) {
      setFaceSelectCoachmarkVisible(false);
      return undefined;
    }
    setFaceSelectCoachmarkVisible(true);
    const coachmarkTimer = setTimeout(() => setFaceSelectCoachmarkVisible(false), 5200);
    return () => clearTimeout(coachmarkTimer);
  }, [trk.faceCaptureState, faceSelectFlow.stage, faceSelectCoachmarkDismissed, trk.enrolledFaces.length]);
  const startFaceAdd = (candidateId) => {
    const candidate = FACE_ENROLLMENT_CANDIDATES.find((item) => item.id === candidateId);
    if (trk.enrolledFaces.length >= 20) {
      setFaceLibraryFullDialogOpen(true);
      return;
    }
    if (!candidate || candidate.status !== "eligible" || trk.faceCaptureState !== "complete" || faceSelectFlow.stage !== "ready") return;
    setFaceSelectCoachmarkDismissed(true);
    setFaceSelectCoachmarkVisible(false);
    setHoveredFaceCandidateId(null);
    setTrk((p) => {
      if (p.enrolledFaces.length >= 20) return p;
      const capturedAt = Date.now();
      const newFace = {
        id: capturedAt,
        name: "",
        priority: p.enrolledFaces.length + 1,
        candidateId,
      };
      const addedCandidateIds = new Set(p.faceBatchResult?.addedCandidateIds ?? []);
      addedCandidateIds.add(candidateId);
      return {
        ...p,
        enrolledFaces: [...p.enrolledFaces, newFace],
        faceBatchResult: {
          ...(p.faceBatchResult ?? {}),
          enrolled: (p.faceBatchResult?.enrolled ?? 0) + 1,
          addedCandidateIds: [...addedCandidateIds],
        },
      };
    });
  };
  useEffect(() => () => {
    if (faceEnrollTimerRef.current) clearTimeout(faceEnrollTimerRef.current);
    clearFaceSelectTimers();
  }, []);
  // NDI 頁面狀態
  const [ndi, setNdi] = useState({
    mode: "builtin",
    bandwidth: "ndihx3", streamOut: "1920x1080", framerate: "60", encoding: "h264",
    deviceName: "AVer", deviceChannel: "TR315-11c96d", receiveGroup: "Public",
    reliableUdp: false,
    discoveryServer: false, discoveryAddr: "192.168.1.10",
    multicastServer: false, multicastMask: "255.255.255.0", multicastAddr: "239.255.0.0", multicastTtl: "10",
    ndiBridge: false, bridgeIp: "192.168.1.11", bridgeName: "NdiBridge", bridgePort: "5990", bridgeKey: "",
  });
  const updNdi = (k, v) => setNdi((p) => ({ ...p, [k]: v }));
  // System 頁面狀態
  const [sys, setSys] = useState({
    loginName: "1", loginPwd: "password",
    language: "English", syslog: "off", syslogIp: "", syslogPort: "",
    statusOsd: "off", statusLiveView: "off",
    powerUpPreset: false, powerUpVal: "0", powerOffPreset: false, powerOffVal: "0", powerOffComplete: "off",
    sleepPreset: "Preset 20", sleepTimer: "10sec", sleepAutoTrack: true,
    helpImprove: "Disable", ledBrightness: 10, cameraSelector: "1",
  });
  const updSys = (k, v) => setSys((p) => ({ ...p, [k]: v }));
  const [toast, setToast] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [deletingScene, setDeletingScene] = useState(null);

  // 選單頁面狀態："paint" (Paint / Look), "video" (Video & Audio)
  const [activeMenu, setActiveMenu] = useState("tracking");
  const [versionMenuOpen, setVersionMenuOpen] = useState(false);
  const [gridDebug, setGridDebug] = useState("off"); // Grid 模式："off" | "viewport-24" | "container-24" | "pixel-8"
  const [paintLayout, setPaintLayout] = useState("classic"); // "classic" 經典 | "cinema" 劇院
  // Camera Settings 頁狀態
  const [cam, setCam] = useState(CAM_DEFAULTS);
  const updCam = (k, v) => setCam((c) => ({ ...c, [k]: v }));
  // Live View 攝影機控制狀態
  const [live, setLive] = useState({
    tab: "control", focusMode: "af", panSpeed: 7, tiltSpeed: 7, zoomSpeed: "high",
    focusNear: "1.5m", afMode: "Continuous AF", digitalZoom: false, digitalZoomLimit: 12,
    relativeZoom: false, presetAffects: false,
    presetSaveNumber: "0", presetVideoFreeze: false, presetAccuracy: true,
    presetSpeed: 50, selectedQuickCall: null, appliedPresetId: null,
    presetNames: Array.from({ length: LIVE_PRESET_COUNT }, (_, index) => `Preset${index}`),
    savedPresetIds: [],
    activePreviewImage: "meeting_room.png",
    presetSnapshots: {},
  });
  const updLive = (k, v) => setLive((c) => ({ ...c, [k]: v }));
  const [editingLivePresetId, setEditingLivePresetId] = useState(null);
  const [livePresetNameDraft, setLivePresetNameDraft] = useState("");
  const [resetLivePresetTarget, setResetLivePresetTarget] = useState(null);
  const [livePresetPage, setLivePresetPage] = useState(0);
  const livePresetCardRefs = useRef([]);
  const livePresetPageStart = livePresetPage * LIVE_PRESETS_PER_PAGE;
  const livePresetPageEnd = Math.min(livePresetPageStart + LIVE_PRESETS_PER_PAGE, LIVE_PRESET_COUNT);
  const visibleLivePresetIds = Array.from(
    { length: livePresetPageEnd - livePresetPageStart },
    (_, index) => livePresetPageStart + index,
  );
  const beginLivePresetRename = (presetId) => {
    setEditingLivePresetId(presetId);
    setLivePresetNameDraft(live.presetNames[presetId]);
  };
  const commitLivePresetRename = () => {
    if (editingLivePresetId == null) return;
    const nextName = livePresetNameDraft.trim() || `Preset${editingLivePresetId}`;
    setLive((current) => ({
      ...current,
      presetNames: current.presetNames.map((name, index) => index === editingLivePresetId ? nextName : name),
    }));
    setEditingLivePresetId(null);
    setLivePresetNameDraft("");
  };
  const saveLivePreset = () => {
    const presetId = Number.parseInt(live.presetSaveNumber, 10);
    if (!Number.isInteger(presetId) || presetId < 0 || presetId >= LIVE_PRESET_COUNT) {
      flash("Use preset 0–255");
      return;
    }
    const isOverwrite = Boolean(live.presetSnapshots[presetId]);
    setLivePresetPage(Math.floor(presetId / LIVE_PRESETS_PER_PAGE));
    setLive((current) => ({
      ...current,
      savedPresetIds: current.savedPresetIds.includes(presetId)
        ? current.savedPresetIds
        : [...current.savedPresetIds, presetId].sort((a, b) => a - b),
      presetSnapshots: {
        ...current.presetSnapshots,
        [presetId]: {
          image: current.activePreviewImage,
          pan: ptz.pan,
          tilt: ptz.tilt,
          zoom: ptz.zoom,
        },
      },
      selectedQuickCall: presetId,
      appliedPresetId: presetId,
    }));
    flash(`Preset ${presetId} ${isOverwrite ? "updated" : "saved"}`);
  };

  useEffect(() => {
    const presetId = live.selectedQuickCall;
    if (presetId == null || Math.floor(presetId / LIVE_PRESETS_PER_PAGE) !== livePresetPage) return;
    const frame = window.requestAnimationFrame(() => {
      livePresetCardRefs.current[presetId]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [live.selectedQuickCall, live.savedPresetIds, livePresetPage]);

  // PTZ 控制狀態 (Live View 與 Tracking Settings 連動)
  const [ptz, setPtz] = useState({ pan: 0, tilt: 0, zoom: 1.0 });
  const handlePtz = (action) => {
    setPtz((p) => {
      let nextZoom = p.zoom || 1.0;
      if (action === "zoom_in") nextZoom = Math.min(nextZoom + 0.2, 3.0);
      if (action === "zoom_out") nextZoom = Math.max(nextZoom - 0.2, 1.0);
      if (action === "home") nextZoom = 1.0;

      const S = nextZoom;
      // 計算最大允許百分比位移限制，防止平移時露出背景黑邊
      const maxPanPercent = ((S - 1) / 2) * 100;
      const maxTiltPercent = ((S - 1) / 2) * 100;

      let nextPan = p.pan || 0;
      let nextTilt = p.tilt || 0;
      
      // 安全獲取速度參數，避免 live 未定義或屬性為空時出錯
      const panSpeed = (live && live.panSpeed !== undefined) ? live.panSpeed : 7;
      const tiltSpeed = (live && live.tiltSpeed !== undefined) ? live.tiltSpeed : 7;
      const panStep = (panSpeed / 7.0) * (4.5 / nextZoom);
      const tiltStep = (tiltSpeed / 7.0) * (4.5 / nextZoom);

      if (nextZoom > 1) {
        if (action === "up") nextTilt = nextTilt + tiltStep;
        if (action === "down") nextTilt = nextTilt - tiltStep;
        if (action === "left") nextPan = nextPan + panStep;
        if (action === "right") nextPan = nextPan - panStep;
      }
      if (action === "home") {
        nextPan = 0;
        nextTilt = 0;
      }

      // 限幅邊界約束
      nextPan = Math.max(Math.min(nextPan, maxPanPercent), -maxPanPercent);
      nextTilt = Math.max(Math.min(nextTilt, maxTiltPercent), -maxTiltPercent);

      // 強力防呆：避免任何 NaN 導致狀態崩潰鎖死
      if (isNaN(nextPan)) nextPan = 0;
      if (isNaN(nextTilt)) nextTilt = 0;
      if (isNaN(nextZoom)) nextZoom = 1.0;

      return { pan: nextPan, tilt: nextTilt, zoom: nextZoom };
    });
  };
  const loadLivePreset = (presetId) => {
    const snapshot = live.presetSnapshots[presetId];
    if (!snapshot) return;
    setLive((current) => ({
      ...current,
      selectedQuickCall: presetId,
      appliedPresetId: presetId,
      presetSaveNumber: String(presetId),
      activePreviewImage: snapshot.image,
    }));
    setPtz({ pan: snapshot.pan, tilt: snapshot.tilt, zoom: snapshot.zoom });
    flash(`${live.presetNames[presetId]} applied`);
  };
  const openResetLivePresetDialog = () => {
    const presetId = live.selectedQuickCall;
    if (presetId == null || !live.presetSnapshots[presetId]) return;
    setResetLivePresetTarget({ id: presetId, name: live.presetNames[presetId] });
  };
  const confirmResetLivePreset = () => {
    if (!resetLivePresetTarget) return;
    const presetId = resetLivePresetTarget.id;
    const presetName = resetLivePresetTarget.name;
    setLive((current) => {
      const nextSnapshots = { ...current.presetSnapshots };
      delete nextSnapshots[presetId];
      return {
        ...current,
        selectedQuickCall: null,
        appliedPresetId: current.appliedPresetId === presetId ? null : current.appliedPresetId,
        savedPresetIds: current.savedPresetIds.filter((id) => id !== presetId),
        presetNames: current.presetNames.map((name, index) => index === presetId ? `Preset${presetId}` : name),
        presetSnapshots: nextSnapshots,
      };
    });
    setEditingLivePresetId(null);
    setLivePresetNameDraft("");
    setResetLivePresetTarget(null);
    flash(`${presetName} reset`);
  };
  // Tracking Control (側邊欄)
  const [trackOn, setTrackOn] = useState(true);
  const [trackMode, setTrackMode] = useState("hybrid");

  // Multi-Matrix 樣式狀態："wheel" (Radar Wheel), "eq" (色彩等化器)

  // Multi-Matrix 聚焦態
  const [isFocused, setIsFocused] = useState(false);
  const [multiStyle, setMultiStyle] = useState("wheel2"); // [PM 定案] Multi-Matrix 採「Radar Wheel 2」方案;切換鈕已移除,預設鎖定 wheel2(wheel / strip 分支保留為相容備用)
  const [matrixViz, setMatrixViz] = useState("ring"); // [PM 定案] Matrix 採「色相環」方案;切換鈕已移除,預設鎖定 ring(swatch 分支保留為相容備用)
  // ===== Paint/Look Onboarding 引導 =====
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onbStep, setOnbStep] = useState(0);
  const [onbClosing, setOnbClosing] = useState(false);
  const onbSeenRef = useRef(false);
  // [2026-06 暫時移除 onboarding 流程] 停用自動開啟。需恢復時把下方 if 條件的 `false &&` 拿掉即可。
  useEffect(() => {
    if (false && activeMenu === "paint" && !onbSeenRef.current) {
      onbSeenRef.current = true;
      setOnbStep(0);
      setShowOnboarding(true);
    }
  }, [activeMenu]);

  // [2026-06] 當切換控制區塊 (block) 時，預設重置 Multi-Matrix 的選取狀態，使切換後預設為無點選任何 node 的狀態。
  useEffect(() => {
    setSelAxis(null);
    setIsFocused(false);
  }, [block]);
  // [聚焦態 草稿] Radar Wheel點進某軸後,Hue/Sat 先存草稿,色環即時預覽;按「OK」才寫入 st。
  const [draftHue, setDraftHue] = useState(0);
  const [draftSat, setDraftSat] = useState(0);
  const [focusClosing, setFocusClosing] = useState(false); // 退出聚焦態的退場動畫旗標
  const enterFocus = (a) => { setSelAxis(a); setDraftHue(st.axes[a].hue); setDraftSat(st.axes[a].sat); setFocusClosing(false); setIsFocused(true); };
  // 退出聚焦態:先播退場動畫(~380ms)再真正卸載
  const closeFocus = () => { setFocusClosing(true); setTimeout(() => { setIsFocused(false); setFocusClosing(false); }, 380); };
  const confirmFocus = () => { updAxis(selAxis, "hue", draftHue); updAxis(selAxis, "sat", draftSat); closeFocus(); };
  // [2D 拖曳] 聚焦態拖環上的 focus 圓圈:繞圈 → Hue(±22.5°對映±99)、進出半徑 → Saturation。
  const ringRef = useRef(null);
  const ringDragRef = useRef(false);
  const ringPointerMove = (e) => {
    if (!ringDragRef.current || !ringRef.current) return;
    const rect = ringRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    const fHue = (Math.atan2(dy, dx) * 180 / Math.PI + 90 + 360) % 360;
    // 2026-06-16 修改註記：配合色相環選擇顏色Set從 12/16 Axes改為 6 Axes，將每個軸的間距改為 60° (360 / 6)，限制範圍改為左右 ±30°
    const base = ((AXIS16.indexOf(selAxis) - AXIS16.indexOf("R")) * 60 + 360) % 360;
    let off = ((fHue - base + 540) % 360) - 180;       // 正規化到 [-180,180]
    off = Math.max(-30, Math.min(30, off));             // 限制在該軸 ±30° 範圍
    setDraftHue(Math.round(off / 30 * 99));
    const radius = Math.hypot(dx, dy) * (290 / rect.width); // 換算回內部 290 座標
    // Saturation 半徑映射:半徑行程與下方節點顯示用同一基準 → 游標與圓圈重合，範圍延伸至內外環
    setDraftSat(Math.max(-99, Math.min(99, Math.round((radius - 119.75) / 25.25 * 99))));
  };

  // Video & Audio 設置狀態
  const [videoSettings, setVideoSettings] = useState({
    powerFreq: "59.94Hz",
    videoOutRes: "1080μP/59",
    themeMode: "Standard",
    streamRes: "1920x1080",
    streamBitrate: "Auto",
    streamEncode: "H.264",
    streamFps: "60",
    streamI_Vop: 10,
    streamGop: 30,
    streamCompat: "Off",
    streamRateCtrl: "VBR",
    audioInputType: "Line In",
    audioVolume: 5,
    usbAudioEnable: "Enable",
    audioEncode: "AAC",
    audioSampleRate: "48K"
  });

  const updVideo = useCallback((k, v) => {
    setVideoSettings((s) => ({ ...s, [k]: v }));
  }, []);

  // 引用 DOM 節點
  const preRef = useRef(null);   
  const scRef = useRef(null);    
  const baseRef = useRef(null);  
  const baseDragRef = useRef(null);
  const baseCanvasRef = useRef(null);
  const barsRef = useRef(null);      // SMPTE 彩條 (全解析度)
  const barsDragRef = useRef(null);  // SMPTE 彩條 (拖曳低解析度)
  const liveThumbRef = useRef(null); // 最近一次「實際畫面(已調色)」縮圖,供存場景用
  const baseCanvasDragRef = useRef(null);
  const averWheelRingCanvasRef = useRef(null);
  const [wheelScale, setWheelScale] = useState(0.83);

  // 實時監聽佈局容器尺寸，動態適配最優縮放比例 (佔據 panel 比例)
  useEffect(() => {
    const shell = document.getElementById("aver-wheel-layout-shell");
    if (!shell) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { height } = entry.contentRect;
        // 內容極限高度(包含外圈節點)設為 298px，使高度能完美填滿。Set下限值為 0.86，在 Panel 變矮時色環大小不變
        const calculatedScale = height / 298;
        setWheelScale(Math.max(0.86, Math.min(1.0, calculatedScale)));
      }
    });
    observer.observe(shell);
    return () => observer.disconnect();
  }, [block, multiStyle]);

  // 實時繪製雷達色相環 (物理上真正的飽和度降低與變暗)
  useEffect(() => {
    if (multiStyle !== "wheel" && multiStyle !== "wheel2") return;
    const canvas = averWheelRingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 290, 290);
    const center = 145;
    const rIn = 77;
    const rOut = 145;
    const ANG_UI = { R: 0, YL: 60, G: 120, CY: 180, B: 240, MG: 300 };

    for (let angle = 0; angle < 360; angle++) {
      const angleRad = (angle - 90) * Math.PI / 180;
      let hue = angle;
      let sIn = 12;   // 預設 (非 Focus): 內圈飽和度降至 12% (真實去色)
      let lIn = 12;   // 預設 (非 Focus): 內圈明度降至 12% (真實變暗)
      let sOut = 100; // 預設 (非 Focus): 外圈飽和度 100% (調至最高)
      let lOut = 58;  // 預設 (非 Focus): 外圈明度 58%

      if (isFocused && selAxis) {
        // 聚焦態下，選中軸的 ±30度 扇區高亮，其他區域變暗
        const baseAng = ANG_UI[selAxis];
        let diff = (angle - baseAng + 180) % 360 - 180;
        if (diff < -180) diff += 360;
        const absDiff = Math.abs(diff);

        if (absDiff <= 30) {
          const offsetHue = (draftHue / 99) * 30;
          hue = (angle + offsetHue + 360) % 360;
          
          const currentSat = Math.max(8, Math.min(100, 100 + (draftSat / 99) * 50));
          sOut = currentSat;
          sIn = Math.min(12, currentSat * 0.12); // 內圈飽和度降低
          lOut = 58;
          lIn = 12; // 內圈變暗
        } else {
          // 非高亮扇區 (變暗的底色)
          const fHueSrc = draftHue;
          const fHueVal = ((ANG_UI[selAxis] + (fHueSrc / 99) * 30 + 360) % 360);
          hue = fHueVal;
          sOut = 15;
          sIn = 6;
          lOut = 28;
          lIn = 12;
        }
      }

      // 繪製 1.2 度的微型扇區，稍微重疊消除縫隙
      const angleNextRad = (angle + 1.2 - 90) * Math.PI / 180;
      
      const x1 = center + Math.cos(angleRad) * rIn;
      const y1 = center + Math.sin(angleRad) * rIn;
      const x2 = center + Math.cos(angleRad) * rOut;
      const y2 = center + Math.sin(angleRad) * rOut;
      const x3 = center + Math.cos(angleNextRad) * rOut;
      const y3 = center + Math.sin(angleNextRad) * rOut;
      const x4 = center + Math.cos(angleNextRad) * rIn;
      const y4 = center + Math.sin(angleNextRad) * rIn;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, `hsl(${hue}, ${sIn}%, ${lIn}%)`);
      grad.addColorStop(1, `hsl(${hue}, ${sOut}%, ${lOut}%)`);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }, [multiStyle, isFocused, selAxis, draftHue, draftSat, st, block, activeMenu, paintLayout]);
  const tempDragCanvasRef = useRef(null); // 拖曳時的低解析度暫存 canvas。
  // [變更] 原本掛在 window.__tempDragCanvas (全域,React 反模式,會跨實例污染且不隨卸載清理),
  //   已改為 useRef,生命週期隨元件管理。

  const [isDragging, setIsDragging] = useState(false);
  const startDrag = useCallback(() => setIsDragging(true), []);
  const endDrag = useCallback(() => setIsDragging(false), []);

  // 狀態更新工具
  const upd = useCallback((k, v) => { 
    setSt((s) => ({ ...s, [k]: v })); 
  }, []);
  
  const updAxis = (axis, key, v) => { 
    setSt((s) => ({ ...s, axes: { ...s.axes, [axis]: { ...s.axes[axis], [key]: v } } })); 
  };
  
  const flash = (m) => { 
    setToast(m); 
    setTimeout(() => setToast(""), 2800);
  };

  // ==========================================================================
  // A. 圖片載入與備用方案處理 (Image Loader & Fallback Logic)
  // ==========================================================================
  useEffect(() => {
    const img = new Image();
    
    img.onerror = () => {
      console.warn("外部背景圖未尋獲，改用預設的高畫質訪談直播間 Canvas 模擬畫面。");
      const cv = document.createElement("canvas");
      cv.width = SW;
      cv.height = SH;
      const ctx = cv.getContext("2d");
      
      drawFallbackScene(ctx);
      
      baseRef.current = ctx.getImageData(0, 0, SW, SH);
      baseCanvasRef.current = cv;

      // 建立 320x180 縮小版用於拖曳效能優化
      const cvDrag = document.createElement("canvas");
      cvDrag.width = 320;
      cvDrag.height = 180;
      const ctxDrag = cvDrag.getContext("2d");
      ctxDrag.drawImage(cv, 0, 0, SW, SH, 0, 0, 320, 180);
      baseDragRef.current = ctxDrag.getImageData(0, 0, 320, 180);
      baseCanvasDragRef.current = cvDrag;

      setStdThumb(cv.toDataURL("image/jpeg", 0.55));
      setImgLoaded(true);
    };

    img.onload = () => {
      const cv = document.createElement("canvas"); 
      cv.width = SW; 
      cv.height = SH;
      const ctx = cv.getContext("2d");
      
      const imgRatio = img.width / img.height;
      const cvRatio = SW / SH;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgRatio > cvRatio) {
        sw = img.height * cvRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / cvRatio;
        sy = (img.height - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, SW, SH);
      
      baseRef.current = ctx.getImageData(0, 0, SW, SH);
      baseCanvasRef.current = cv;

      // 建立 320x180 縮小版用於拖曳效能優化
      const cvDrag = document.createElement("canvas");
      cvDrag.width = 320;
      cvDrag.height = 180;
      const ctxDrag = cvDrag.getContext("2d");
      ctxDrag.drawImage(cv, 0, 0, SW, SH, 0, 0, 320, 180);
      baseDragRef.current = ctxDrag.getImageData(0, 0, 320, 180);
      baseCanvasDragRef.current = cvDrag;

      setStdThumb(cv.toDataURL("image/jpeg", 0.55));
      setImgLoaded(true);
    };

    // 2026-06-16 修改註記：修復 live preview 照片不見的問題，改用相對路徑避免 GitHub Pages 部署時基底路徑錯誤
    img.src = "meeting_room.png?t=" + Date.now();
  }, []);

  // SMPTE 彩條測試圖:7 條主色(白/黃/青/綠/洋紅/紅/藍 75%),供對色調色參考
  useEffect(() => {
    const make = (w, h) => {
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const x = c.getContext("2d");
      const cols = [[191, 191, 191], [191, 191, 0], [0, 191, 191], [0, 191, 0], [191, 0, 191], [191, 0, 0], [0, 0, 191]];
      const bw = w / cols.length;
      cols.forEach((col, i) => { x.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`; x.fillRect(Math.floor(i * bw), 0, Math.ceil(bw) + 1, h); });
      return x.getImageData(0, 0, w, h);
    };
    barsRef.current = make(SW, SH);
    barsDragRef.current = make(320, 180);
  }, []);

  // ==========================================================================
  // B. 即時影像運算與示波器繪製副作用 (Real-time DSP Processing Loop)
  // ==========================================================================
  useEffect(() => {
    const cvs = preRef.current; 
    if (!cvs) return;

    // 判斷是否正在拖曳，使用對應解析度的快照
    const useDrag = isDragging && (colorBars ? barsDragRef.current : baseDragRef.current);
    const currentW = useDrag ? 320 : SW;
    const currentH = useDrag ? 180 : SH;
    const base = colorBars
      ? (useDrag ? barsDragRef.current : barsRef.current)
      : (useDrag ? baseDragRef.current : baseRef.current);
    if (!base) return;

    // 當開啟 bypass 時，調色參數應套用該 scene 載入時的原始/預設值
    const activeSt = bypass ? getActiveSceneData() : st;

    const ctx = cvs.getContext("2d");
    const sd = base.data;
    let work = new Uint8ClampedArray(sd.length);
    
    // --- 預先計算演算法常數，避免在像素大迴圈中重複計算或建立閉包 ---
    
    // 1. Tone 常數 (Master Black, R Black, B Black)
    const master = (activeSt.masterBlack ?? 0) / 50 * 0.12;
    const rOffset = (activeSt.rBlack ?? 0) / 50 * 0.12;
    const bOffset = (activeSt.bBlack ?? 0) / 50 * 0.12;
    const bl_r = master + rOffset;
    const bl_g = master;
    const bl_b = master + bOffset;
    const kneeOn = !!activeSt.kneeOn;
    let kp, slope;
    if (activeSt.autoKnee) {
      kp = 85 / 109;
      slope = 0.35;
    } else {
      kp = activeSt.kneePoint / 109;
      slope = 0.5 + (activeSt.kneeSlope + 5) / 20;
    }

    // 2. Matrix 常數
    const matrixOn = true;
    const levelOn = activeSt.level !== 0;
    const sat = 1 + activeSt.level / 120;
    const phaseOn = activeSt.phase !== 0;
    
    let m00 = 0, m01 = 0, m02 = 0;
    let m10 = 0, m11 = 0, m12 = 0;
    let m20 = 0, m21 = 0, m22 = 0;
    if (matrixOn && phaseOn) {
      const deg = (activeSt.phase / 99) * 30;
      const a = (deg * Math.PI) / 180;
      const cosVal = Math.cos(a);
      const sinVal = Math.sin(a);
      m00 = 0.213 + cosVal * 0.787 - sinVal * 0.213;
      m01 = 0.715 - cosVal * 0.715 - sinVal * 0.715;
      m02 = 0.072 - cosVal * 0.072 + sinVal * 0.928;
      m10 = 0.213 - cosVal * 0.213 + sinVal * 0.143;
      m11 = 0.715 + cosVal * 0.285 + sinVal * 0.14;
      m12 = 0.072 - cosVal * 0.072 - sinVal * 0.283;
      m20 = 0.213 - cosVal * 0.213 - sinVal * 0.787;
      m21 = 0.715 - cosVal * 0.715 + sinVal * 0.715;
      m22 = 0.072 + cosVal * 0.928 + sinVal * 0.072;
    }

    const kMix = 0.75;
    const m_rg = (activeSt.rg / 100) * kMix;
    const m_rb = (activeSt.rb / 100) * kMix;
    const m_gr = (activeSt.gr / 100) * kMix;
    const m_gb = (activeSt.gb / 100) * kMix;
    const m_br = (activeSt.br / 100) * kMix;
    const m_bg = (activeSt.bg / 100) * kMix;

    // 3. Multi-Matrix 活躍軸預篩選
    const activeAxes = [];
    AXIS16.forEach((a) => {
      // 關鍵優化：如果在 focus 狀態下且當前選中這條軸，直接套用 draftHue 與 draftSat，實現調整當下即時預覽
      // 注意：當 bypass 為 true 時，表示比對狀態，此時應使用原始場景的軸數值，不能套用聚焦草稿！
      const isCurrentAxis = !bypass && isFocused && selAxis === a;
      const hueVal = isCurrentAxis ? draftHue : (activeSt.axes[a] ? activeSt.axes[a].hue : 0);
      const satVal = isCurrentAxis ? draftSat : (activeSt.axes[a] ? activeSt.axes[a].sat : 0);
      
      if (hueVal !== 0 || satVal !== 0) {
        activeAxes.push({
          name: a,
          hueAngle: AXIS_HUE[a],
          hueAdj: (hueVal / 99) * 22,
          satAdj: (satVal / 99) * 0.85
        });
      }
    });

    // --- 像素大迴圈 (完全 GC-free 零記憶體分配) ---
    for (let i = 0; i < sd.length; i += 4) {
      let R = sd[i] / 255;
      let G = sd[i + 1] / 255;
      let B = sd[i + 2] / 255;
      
      // A. 套用 Tone 控制 (Master Black + 各通道偏置)
      R = R + bl_r * (1 - R);
      G = G + bl_g * (1 - G);
      B = B + bl_b * (1 - B);
      
      if (kneeOn) {
        if (R > kp) R = kp + (R - kp) * slope;
        if (G > kp) G = kp + (G - kp) * slope;
        if (B > kp) B = kp + (B - kp) * slope;
      }

      // B. 套用 Matrix 控制
      if (matrixOn) {
        // 色相旋轉 Phase
        if (phaseOn) {
          const rotR = R * m00 + G * m01 + B * m02;
          const rotG = R * m10 + G * m11 + B * m12;
          const rotB = R * m20 + G * m21 + B * m22;
          R = rotR; G = rotG; B = rotB;
        }
        // 混合矩陣
        const nR = R + m_rg * (R - G) + m_rb * (R - B);
        const nG = G + m_gr * (G - R) + m_gb * (G - B);
        const nB = B + m_br * (B - R) + m_bg * (B - G);
        R = nR; G = nG; B = nB;
        // 飽和度 Level
        if (levelOn) {
          const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
          R = Y + (R - Y) * sat;
          G = Y + (G - Y) * sat;
          B = Y + (B - Y) * sat;
        }
      }

      // C. 套用 Multi-Matrix 控制 (GC-free)
      if (activeAxes.length > 0) {
        // rgb2hsv
        const mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn;
        let h = 0;
        if (d > 0) {
          if (mx === R) h = ((G - B) / d) % 6;
          else if (mx === G) h = (B - R) / d + 2;
          else h = (R - G) / d + 4;
          h *= 60;
          if (h < 0) h += 360;
        }
        const sVal = mx === 0 ? 0 : d / mx;
        const vVal = mx;

        if (sVal >= 0.05) {
          // 尋找距離最近的活躍軸
          let bestAx = null;
          let bd = 999;
          for (let j = 0; j < activeAxes.length; j++) {
            const axObj = activeAxes[j];
            const dist = Math.abs(((axObj.hueAngle - h + 540) % 360) - 180);
            if (dist < bd) {
              bd = dist;
              bestAx = axObj;
            }
          }
          
          // 2026-06-16 修改註記：配合 6 Axes (間距 60°)，將影響半寬度 (falloff) 由 22.5° 修改為 30°
          if (bestAx && bd < 30) {
            const w = 1 - bd / 30; // 與 30° 軸間距對齊 (見 applyMulti 註解)
            let newH = h + bestAx.hueAdj * w;
            let newS = sVal * (1 + bestAx.satAdj * w);
            if (newS > 1) newS = 1;
            
            // hsv2rgb
            newH = ((newH % 360) + 360) % 360;
            const c_val = vVal * newS;
            const x_val = c_val * (1 - Math.abs(((newH / 60) % 2) - 1));
            const m_val = vVal - c_val;
            let r_val = 0, g_val = 0, b_val = 0;
            if (newH < 60) { r_val = c_val; g_val = x_val; }
            else if (newH < 120) { r_val = x_val; g_val = c_val; }
            else if (newH < 180) { g_val = c_val; b_val = x_val; }
            else if (newH < 240) { g_val = x_val; b_val = c_val; }
            else if (newH < 300) { r_val = x_val; b_val = c_val; }
            else { r_val = c_val; b_val = x_val; }
            
            R = r_val + m_val;
            G = g_val + m_val;
            B = b_val + m_val;
          }
        }
      }
      
      work[i] = c255(R * 255); 
      work[i + 1] = c255(G * 255); 
      work[i + 2] = c255(B * 255); 
      work[i + 3] = 255;
    }
    
    if (activeSt.detail !== 0) {
      work = applyDetail(work, currentW, currentH, activeSt.detail);
    }
    
    const out = new ImageData(work, currentW, currentH);
    
    if (useDrag) {
      if (!tempDragCanvasRef.current) {
        const c = document.createElement("canvas");
        c.width = 320; c.height = 180;
        tempDragCanvasRef.current = c;
      }
      const tempCtx = tempDragCanvasRef.current.getContext("2d");
      tempCtx.putImageData(out, 0, 0);

      ctx.clearRect(0, 0, SW, SH);
      ctx.drawImage(tempDragCanvasRef.current, 0, 0, 320, 180, 0, 0, SW, SH);
    } else {
      ctx.putImageData(out, 0, 0);
    }

    // 快取「實際畫面(已套用調色)」縮圖:僅在非彩條、非 bypass、非拖曳的全解析度狀態下更新
    // → 之後另存/更新場景時,即使正顯示彩條測試圖,也用這份實際畫面當縮圖
    if (!colorBars && !bypass && !useDrag) {
      try { liveThumbRef.current = cvs.toDataURL("image/jpeg", 0.55); } catch (e) {}
    }

    // --- 示波器繪製 (在拖曳時也使用對應解析度的 work，速度大幅提升) ---
    if (showScope && scRef.current) {
      const g = scRef.current.getContext("2d"), W = scRef.current.width, H = scRef.current.height;
      g.fillStyle = "rgba(8, 12, 10, 0.92)"; 
      g.fillRect(0, 0, W, H);
      
      const dd = work;

      // [設計決策 / 誠實標註] 以下三種監看 (向量/波形/直方圖) 為真實的廣播工業工具:
      //   向量示波器 — 色相=角度、飽和=半徑;含 75% 色靶與 ~123°(10:30) 膚色線概念。
      //   波形圖     — 0–100 IRE 亮度分佈,用於曝光/Knee/Black。
      //   直方圖     — RGB 三色版亮度分佈。
      // 數學 (BT.709 亮度係數、Cb/Cr 色差) 為標準公式;但此處「繪製為示意級」,非儀器級精確視覺
      // (真儀器有更密的刻度盤、I/Q 線、連續螢光軌跡且經校準)。最終視覺需另開規格或接韌體 scope 輸出。[PM]
      if (scope === "vector") {
        const cx = W / 2, cy = H / 2, Rr = Math.min(W, H) / 2 - 10, cs = Rr / 0.5;
        
        g.strokeStyle = "rgba(70, 224, 138, 0.25)"; 
        g.lineWidth = 1;
        g.beginPath(); 
        g.arc(cx, cy, Rr, 0, 7); 
        g.stroke();
        
        g.beginPath(); 
        g.moveTo(cx - Rr, cy); 
        g.lineTo(cx + Rr, cy); 
        g.moveTo(cx, cy - Rr); 
        g.lineTo(cx, cy + Rr); 
        g.stroke();
        
        g.strokeStyle = "rgba(255, 174, 110, 0.5)"; 
        g.setLineDash([3, 3]);
        g.beginPath(); 
        g.moveTo(cx, cy); 
        g.lineTo(cx + Math.cos(-123 * Math.PI / 180) * Rr, cy - Math.sin(-123 * Math.PI / 180) * Rr); 
        g.stroke(); 
        g.setLineDash([]);
        
        [["R", 191, 0, 0], ["YL", 191, 191, 0], ["G", 0, 191, 0], ["CY", 0, 191, 191], ["B", 0, 0, 191], ["MG", 191, 0, 191]].forEach(([l, r0, g0, b0]) => {
          const Y = (0.2126 * r0 + 0.7152 * g0 + 0.0722 * b0) / 255;
          const x = cx + ((b0 / 255 - Y) / 1.8556) * cs;
          const y = cy - ((r0 / 255 - Y) / 1.5748) * cs;
          g.strokeStyle = "rgba(220, 230, 225, 0.5)"; 
          g.strokeRect(x - 3.5, y - 3.5, 7, 7); 
          g.fillStyle = "rgba(160, 180, 175, 0.9)"; 
          g.font = "14px monospace"; 
          g.fillText(l, x + 6, y - 6);
        });
        
        g.fillStyle = "rgba(70, 224, 138, 0.75)";
        const step = useDrag ? 8 : 24; // 拖曳時像素較少，採樣間距可調小；平時調大
        for (let i = 0; i < dd.length; i += step) { 
          const r = dd[i] / 255, gg = dd[i + 1] / 255, b = dd[i + 2] / 255;
          const Y = 0.2126 * r + 0.7152 * gg + 0.0722 * b; 
          g.fillRect(cx + ((b - Y) / 1.8556) * cs, cy - ((r - Y) / 1.5748) * cs, 1.3, 1.3); 
        }
      } else if (scope === "wave") {
        g.lineWidth = 1; 
        g.font = "14px monospace";
        [0, 0.5, 1].forEach((p) => { 
          const y = H - 8 - p * (H - 16); 
          g.strokeStyle = "rgba(120, 140, 150, 0.25)"; 
          g.beginPath(); 
          g.moveTo(24, y); 
          g.lineTo(W - 4, y); 
          g.stroke(); 
          g.fillStyle = "rgba(150, 165, 175, 0.8)"; 
          g.fillText(Math.round(p * 100), 1, y + 4); 
        });
        g.fillStyle = "rgba(70, 224, 138, 0.55)";
        const step = useDrag ? 4 : 16;
        for (let i = 0; i < dd.length; i += step) { 
          const px = (i / 4) % currentW;
          const Y = (0.2126 * dd[i] + 0.7152 * dd[i + 1] + 0.0722 * dd[i + 2]) / 255; 
          g.fillRect(24 + (px / currentW) * (W - 28), H - 8 - Y * (H - 16), 1.2, 1.2); 
        }
      } else {
        const bins = 96;
        const Rh = new Float32Array(bins), Gh = new Float32Array(bins), Bh = new Float32Array(bins);
        const step = useDrag ? 2 : 8;
        for (let i = 0; i < dd.length; i += step) {
          Rh[Math.min(bins - 1, (dd[i] / 256 * bins) | 0)]++;
          Gh[Math.min(bins - 1, (dd[i + 1] / 256 * bins) | 0)]++;
          Bh[Math.min(bins - 1, (dd[i + 2] / 256 * bins) | 0)]++;
        }
        let mx = 1;
        for (let i = 0; i < bins; i++) mx = Math.max(mx, Rh[i], Gh[i], Bh[i]);
        const drawHist = (arr, col) => {
          g.fillStyle = col;
          g.beginPath();
          g.moveTo(4, H - 4);
          for (let i = 0; i < bins; i++) g.lineTo(4 + (i / (bins - 1)) * (W - 8), H - 4 - (arr[i] / mx) * (H - 14));
          g.lineTo(W - 4, H - 4);
          g.closePath();
          g.fill();
        };
        drawHist(Rh, "rgba(255,90,80,0.45)");
        drawHist(Gh, "rgba(70,224,138,0.45)");
        drawHist(Bh, "rgba(90,168,255,0.45)");
        g.font = "14px monospace"; g.fillStyle = "rgba(150,165,175,0.7)";
        g.fillText("Dark", 5, 14); g.fillText("Bright", W - 20, 14);
      }
    }
  }, [st, bypass, colorBars, scope, showScope, imgLoaded, isDragging, paintLayout, activeMenu, isFocused, selAxis, draftHue, draftSat, scenes, activeScene]);

  useEffect(() => {
    if (block === "knee" || block === "black") setScope("wave");
    if (block === "matrix" || block === "multi") setScope("vector");
  }, [block]);

  // ==========================================================================
  // C. 預設場景存取與狀態管理邏輯 (Preset & State Actions)
  // ==========================================================================
  const blockActive = (id) => {
    if (id === "matrix") return !!(st.level || st.phase || st.rg || st.rb || st.gr || st.gb || st.br || st.bg);
    if (id === "multi") return AXIS16.some((a) => st.axes[a].hue || st.axes[a].sat);
    if (id === "detail") return st.detail !== 0;
    if (id === "knee") return !!st.kneeOn;
    if (id === "black") return (st.masterBlack ?? 0) !== 0 || (st.rBlack ?? 0) !== 0 || (st.bBlack ?? 0) !== 0;
    return false;
  };

  const snapState = () => JSON.parse(JSON.stringify({ ...st }));
  
  const grabThumb = () => { 
    try { 
      // 彩條模式下不存彩條,改用最近的「實際畫面」縮圖;一般狀態直接擷取目前畫面
      if (!colorBars && preRef.current) return preRef.current.toDataURL("image/jpeg", 0.55);
      return liveThumbRef.current; 
    } catch { 
      return liveThumbRef.current || null; 
    } 
  };
  
  const loadStandard = () => { 
    setSt(JSON.parse(JSON.stringify(DEF))); 
    setActiveScene("std"); 
    flash("Loaded Default"); 
  };
  
  const saveNewScene = () => {
    if (scenes.length >= 16) return;
    const name = scName.trim() || `Scene ${scenes.length + 1}`;
    const id = Date.now();
    setScenes((sc) => [...sc, { 
      id, name, remark: scRemark.trim(), 
      savedAt: new Date().toLocaleString("zh-TW", { hour12: false }), 
      thumb: grabThumb(), data: snapState() 
    }]);
    setActiveScene(id); 
    setSaveOpen(false); 
    setScName(""); 
    setScRemark("");
    flash(`Saved "${name}"`);
  };
  
  const loadScene = (s) => { 
    setSt(JSON.parse(JSON.stringify(s.data))); 
    setActiveScene(s.id); 
    flash(`Loaded "${s.name}"`); 
  };
  
  const updateScene = (s) => { 
    setScenes((sc) => sc.map((x) => x.id === s.id ? { 
      ...x, data: snapState(), thumb: grabThumb(), 
      savedAt: new Date().toLocaleString("zh-TW", { hour12: false }) 
    } : x)); 
    setActiveScene(s.id); 
    flash(`Updated "${s.name}"`); 
  };
  
  const deleteScene = (s) => { 
    setScenes((sc) => sc.filter((x) => x.id !== s.id)); 
    if (activeScene === s.id) {
      loadStandard();
    }
    flash(`Deleted "${s.name}"`); 
  };

  const saveSceneMeta = () => {
    setScenes((sc) => sc.map((x) => x.id === editingScene ? { ...x, name: edName.trim() || x.name, remark: edRemark.trim() } : x));
    setEditingScene(null);
    flash("Updated Scene Info");
  };

  // ==========================================================================
  // D. 面板渲染路由器 (Parameter Panels Switch)
  // ==========================================================================
  const renderBlock = () => {
    if (block === "matrix") {
      return (
        <div id="aver-control-params-matrix" style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <BlockHeader 
            title="Matrix" 
            sub="Adjust the mutual relationship of RGB colors, hue, and saturation, affecting the entire image."
          />
          {/* [PM 定案] 固定色相環視覺(對齊 Multi-Matrix)。
              色相環以 height:100% + aspectRatio:1 撐滿垂直空間成正方形,row 底部 paddingBottom 預留間距;
              右側控制項對齊 Multi-Matrix 結構：有小標題、Default 按紐與大背景包覆。 */}
          <div style={{ display: "flex", gap: 24, alignItems: "stretch", flex: 1, minHeight: 0, padding: "8px 0 10px", boxSizing: "border-box" }}>
            <div style={{ flexShrink: 0, height: "100%", aspectRatio: "1", maxHeight: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MatrixRing level={st.level} phase={st.phase} rg={st.rg} rb={st.rb} gr={st.gr} gb={st.gb} br={st.br} bg={st.bg} />
            </div>
            
            <div style={{ flex: 1, minWidth: 240, height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, width: "100%", boxSizing: "border-box" }}>
                <span style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>Color Control Items</span>
                <div style={{ width: 80, display: "flex" }}>
                  <MiniBtn onClick={() => MATRIX_KEYS.forEach(([k]) => upd(k, 0))}>Default</MiniBtn>
                </div>
              </div>
              
              <div style={{
                flex: 1,
                minHeight: 0,
                width: "100%",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                borderRadius: 8,
                padding: "16px 18px",
                boxSizing: "border-box",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: 24,
                rowGap: 4,
                alignContent: "space-between"
              }}>
                {MATRIX_KEYS.map(([k, lb, hint]) => (
                  <Slider key={k} k={k} label={lb} hint={hint} min={-99} max={99} val={st[k]} onChange={(v) => upd(k, v)} onStartDrag={startDrag} onEndDrag={endDrag} dense />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (block === "multi") {
      // ====================================================================
      // Multi-Matrix 區塊 — 提供三種 UX 呈現 (由 multiStyle 切換,供設計比較):
      //   "wheel" Radar Wheel — 選擇態(16軸環) ↔ 聚焦態(只留選中軸、整環變該色相,專注單軸微調)
      //   "fader" 推桿台   — 16 Axes × S/H 雙直立推桿(混音台風格,命中區大,適合大幅塑形與總覽)
      //   "eq"    色卡矩陣 — 2×8 卡片密集網格(數值精確、可一次綜覽全部 16 Axes)
      // 三者共用同一份狀態 (st.axes / selAxis),僅呈現方式不同。
      // angUI 為本地等分表 (22.5°),與全域 AXIS_HUE 一致 (環顯示與底層運算對齊)。
      // ====================================================================
      const FULL_NAME = { R: "Red", YL: "Yellow", G: "Green", CY: "Cyan", B: "Blue", MG: "Magenta" };
      const ax = selAxis ? st.axes[selAxis] : null;
      // [A+C 強化] 是否有任一軸被調整過 → 用來「讓調過的浮出、沒調過的降存在感」(三種樣式共用)
      const anyTouched = AXIS16.some((a) => st.axes[a].hue !== 0 || st.axes[a].sat !== 0);
      const touchedCount = AXIS16.filter((a) => st.axes[a].hue !== 0 || st.axes[a].sat !== 0).length;
      // 6 Axes等分色相環,每軸 60°,R 軸在環頂 (0°)
      const angUI = {};
      AXIS16.forEach((a, i) => { const idxR = AXIS16.indexOf("R"); angUI[a] = ((i - idxR) * 60 + 360) % 360; });

      // 聚焦態:整個環即時反映「草稿」的 Hue/Sat(尚未寫入 st,按OK才套用)
      const fHueSrc = isFocused ? draftHue : (ax ? ax.hue : 0);
      const fSatSrc = isFocused ? draftSat : (ax ? ax.sat : 0);
      const fHue = selAxis ? ((angUI[selAxis] + (fHueSrc / 99) * 30 + 360) % 360) : 0;
      const fSat = Math.max(8, Math.min(100, 70 + (fSatSrc / 99) * 30));
      // 採用 Canvas 實時繪製真正的飽和度與明度徑向變暗去色效果，免除 mask 重疊 CSS 限制
      const mOff = false;

      const isWheel = multiStyle === "wheel" || multiStyle === "wheel2";
      const isCinema = paintLayout === "cinema";
      return (
        <div id="aver-control-params-multi" style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: isWheel ? "visible" : "hidden" }}>
          {isCinema ? (
            <BlockHeader
              title="Multi-Matrix"
            />
          ) : (
            <BlockHeader
              title="Multi-Matrix"
              sub="Click node to select color, adjust hue and saturation individually without affecting other colors."
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 10, width: "100%", boxSizing: "border-box", flex: 1, minHeight: 0, overflow: isWheel ? "visible" : "auto", padding: isWheel ? "8px 0 16px" : "10px 0" }}>

            {isWheel ? (
              <div 
                onClick={() => { if (!mOff) { setSelAxis(null); if (isFocused) closeFocus(); } }}
                style={{ display: "flex", gap: 24, alignItems: "stretch", justifyContent: "center", width: "100%", height: "100%", minHeight: 0 }}
              >
                {/* === Radar Wheel:選擇態(6軸) ↔ 聚焦態(單軸) === */}
                <div id="aver-wheel-layout-shell" style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: "0 0 290px", overflow: "visible", height: "100%" }}>
                  <div id="aver-wheel-main-container" ref={ringRef} 
                    onClick={(e) => { e.stopPropagation(); if (!mOff && !isFocused) setSelAxis(null); }}
                    style={{ 
                      position: "relative", 
                      width: 290, 
                      height: 290, 
                      flexShrink: 0, 
                      overflow: "visible",
                      transform: `scale(${wheelScale})`,
                      transformOrigin: "center center"
                    }}
                  >
                  {/* [聚焦進場] 從中心射向環的擴張光環(每次選軸重播);發光用徑向漸層自含,不溢出容器避免被裁切 */}
                  {isFocused && (
                    <div id="aver-wheel-focus-burst" key={"burst-" + selAxis} style={{ position: "absolute", left: "50%", top: "50%", width: 150, height: 150, borderRadius: "50%", border: `2px solid hsl(${fHue} 85% 62%)`, background: `radial-gradient(circle, transparent 56%, hsl(${fHue} 85% 60% / .45) 70%, transparent 82%)`, transform: "translate(-50%,-50%)", animation: focusClosing ? "averBurstOut .24s ease-in both" : "averBurst .88s cubic-bezier(0.16, 1, 0.3, 1) both", pointerEvents: "none", zIndex: 7 }} />
                  )}

                  {/* [2026-06 拖曳一閃] 拖曳右側色彩控制項時,在色環中央放一個由內而外、快進緩出的光圈,
                      帶外圈光暈與內外輝光(發亮感)。顏色取自被拖曳的色軸。key 綁 wheelFlash.key → 每次拖曳重播。 */}
                  {wheelFlash && (() => {
                    const wfHue = angUI[wheelFlash.axis];
                    return (
                      <div
                        key={"wflash-" + wheelFlash.key}
                        onAnimationEnd={() => setWheelFlash(null)}
                        style={{
                          position: "absolute", left: "50%", top: "50%",
                          width: 150, height: 150, borderRadius: "50%",
                          border: `1px solid hsl(${wfHue} 96% 74%)`,
                          background: `radial-gradient(circle, transparent 78%, hsl(${wfHue} 92% 66% / .48) 87%, hsl(${wfHue} 92% 60% / .12) 93%, transparent 97%)`,
                          boxShadow: `0 0 16px 2px hsl(${wfHue} 90% 60% / .5), 0 0 34px 6px hsl(${wfHue} 90% 55% / .25), inset 0 0 7px hsl(${wfHue} 96% 74% / .4)`,
                          filter: "brightness(1.18) saturate(1.1)",
                          transform: "translate(-50%,-50%)",
                          animation: "averWheelFlash 0.78s cubic-bezier(0.22, 0.61, 0.36, 1) both",
                          pointerEvents: "none",
                          zIndex: 7
                        }}
                      />
                    );
                  })()}

                  
                  {/* 實體圓環層 - 採用高性能 2D Canvas 繪製，呈現物理真實的飽和度與明度去色變暗 */}
                  <canvas 
                    id="aver-wheel-ring-canvas" 
                    ref={averWheelRingCanvasRef} 
                    width="290" 
                    height="290" 
                    style={{ 
                      position: "absolute", 
                      inset: 0, 
                      width: 290, 
                      height: 290, 
                      borderRadius: "50%", 
                      pointerEvents: "none",
                      zIndex: 3,
                      filter: isFocused 
                        ? `drop-shadow(0 0 14px hsl(${fHue} 85% 60% / 0.22))` 
                        : "drop-shadow(0 0 10px rgba(255, 255, 255, 0.12))",
                      transition: "filter 0.58s cubic-bezier(0.16, 1, 0.3, 1)"
                    }} 
                  />
                  
                  {/* 中間彩色圓環正中央緩慢旋轉的虛線圈 */}
                  <div style={{ position: "absolute", inset: 34, borderRadius: "50%", border: "1.2px dashed rgba(255, 255, 255, 0.16)", pointerEvents: "none", animation: "mmspin 35s linear infinite", zIndex: 4 }} />

                  {/* 動態 SVG 雷達網格與連接線 */}
                  <svg id="aver-wheel-radar-lines-svg" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}>
                    {/* 16 條放射狀均勻參考虛線 */}
                    {AXIS16.map((a) => {
                      const isSel = selAxis === a;
                      const isDragNode = isFocused && isSel;
                      const nodeHueVal = isDragNode ? draftHue : st.axes[a].hue;
                      const nodeAngDeg = angUI[a] + (nodeHueVal / 99) * 30;
                      const dispAng = (nodeAngDeg - 90) * Math.PI / 180;
                      const nodeSatVal = isDragNode ? draftSat : st.axes[a].sat;
                      const rNode = 119.75 + (nodeSatVal / 99) * 25.25;
                      const rx = 145 + Math.cos(dispAng) * rNode;
                      const ry = 145 + Math.sin(dispAng) * rNode;
                      const lineHide = isFocused && !isSel;
                      const nodeHue = (nodeAngDeg + 360) % 360;
                      return (
                        <line 
                          key={a}
                          x1={145} 
                          y1={145} 
                          x2={rx} 
                          y2={ry} 
                          stroke={isSel ? `hsl(${nodeHue} 95% 70% / 0.5)` : "rgba(255, 255, 255, 0.08)"} 
                          strokeWidth={isSel ? "1.2" : "1"} 
                          strokeDasharray="2, 4" 
                          style={{
                            opacity: lineHide ? 0 : 1,
                            transition: isDragNode ? "none" : "opacity 0.58s cubic-bezier(0.16, 1, 0.3, 1)"
                          }}
                        />
                      );
                    })}
                    {/* 雷達連接多邊形參考線 */}
                    <polygon
                      points={AXIS16.map((a) => {
                        const isSel = selAxis === a;
                        const isDragNode = isFocused && isSel;
                        const nodeHueVal = isDragNode ? draftHue : st.axes[a].hue;
                        const nodeAngDeg = angUI[a] + (nodeHueVal / 99) * 30;
                        const dispAng = (nodeAngDeg - 90) * Math.PI / 180;
                        const nodeSatVal = isDragNode ? draftSat : st.axes[a].sat;
                        const rNode = 119.75 + (nodeSatVal / 99) * 25.25;
                        const px = 145 + Math.cos(dispAng) * rNode;
                        const py = 145 + Math.sin(dispAng) * rNode;
                        return `${px},${py}`;
                      }).join(" ")}
                      fill="rgba(30, 155, 240, 0.04)"
                      stroke="rgba(30, 155, 240, 0.3)"
                      strokeWidth="1"
                      style={{ 
                        opacity: isFocused ? 0 : 1, 
                        transition: "opacity 0.58s cubic-bezier(0.16, 1, 0.3, 1)" 
                      }}
                    />
                  </svg>

                  {/* [聚焦態] 該軸 ±22.5° 扇形「浮起」表達可調範圍;顏色沿用選擇態彩虹環的鮮明色相漸層 */}
                  {isFocused && (() => {
                    const base = angUI[selAxis];
                    const px = (deg, r) => 145 + Math.cos((deg - 90) * Math.PI / 180) * r;
                    const py = (deg, r) => 145 + Math.sin((deg - 90) * Math.PI / 180) * r;
                    // 2026-06-16 修改註記：配合 6 Axes (間距 60°)，扇形繪製範圍改為 ±30°
                    const a0 = base - 30, a1 = base + 30;
                    const rIn = 77, rOut = 145;
                    const segPath = (s0, s1) =>
                      `M ${px(s0, rOut)} ${py(s0, rOut)} A ${rOut} ${rOut} 0 0 1 ${px(s1, rOut)} ${py(s1, rOut)} L ${px(s1, rIn)} ${py(s1, rIn)} A ${rIn} ${rIn} 0 0 0 ${px(s0, rIn)} ${py(s0, rIn)} Z`;
                    const fullSector = `M ${px(a0, rOut)} ${py(a0, rOut)} A ${rOut} ${rOut} 0 0 1 ${px(a1, rOut)} ${py(a1, rOut)} L ${px(a1, rIn)} ${py(a1, rIn)} A ${rIn} ${rIn} 0 0 0 ${px(a0, rIn)} ${py(a0, rIn)} Z`;
                    const N = 24; // 密切片 → 平滑彩虹漸層
                    const slices = Array.from({ length: N }, (_, i) => {
                      const s0 = a0 + (i / N) * 60, s1 = a0 + ((i + 1.4) / N) * 60; // 重疊避免接縫
                      // 與選擇態彩虹環同一套鮮明配方:高飽和、明亮 (hsl 85% 58%)
                      const hue = (base - 30 + ((i + 0.5) / N) * 60 + 360) % 360;
                      return { d: segPath(s0, Math.min(a1, s1)), fill: `hsl(${hue} 85% 58%)` };
                    });
                    return (
                      <svg id="aver-wheel-focus-sector-svg" width="290" height="290" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 6, overflow: "visible" }}>
                        <defs>
                          <filter id="sectorLift" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.5" />
                          </filter>
                          <radialGradient id="sectorSheen" cx="50%" cy="32%" r="72%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                            <stop offset="55%" stopColor="rgba(255,255,255,0.06)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                          </radialGradient>
                        </defs>
                        <g className={focusClosing ? "aver-sector-out" : "aver-sector-in"} filter="url(#sectorLift)">
                          {/* 僅加頂部受光高光,不壓暗,保持鮮亮 */}
                          <path d={fullSector} fill="url(#sectorSheen)" />
                          <path d={fullSector} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
                        </g>
                      </svg>
                    );
                  })()}

                  {AXIS16.map((a) => {
                    const isSel = selAxis === a;
                    const hide = isFocused && !isSel;
                    const isDragNode = isFocused && isSel; // 聚焦中的選中節點 → 可拖曳(繞圈調 Hue,半徑調 Saturation)
                    const nodeHueVal = isDragNode ? draftHue : st.axes[a].hue;
                    const nodeAngDeg = angUI[a] + (nodeHueVal / 99) * 30;
                    const dispAng = (nodeAngDeg - 90) * Math.PI / 180;
                    const nodeSatVal = isDragNode ? draftSat : st.axes[a].sat;
                    const rNode = 119.75 + (nodeSatVal / 99) * 25.25;
                    const x = 145 + Math.cos(dispAng) * rNode, y = 145 + Math.sin(dispAng) * rNode;
                    const nodeHue = (nodeAngDeg + 360) % 360;
                    // [2026-06] 節點填色的飽和度/明度跟著該軸 Saturation 變化:
                    //   sat=0 維持原鮮豔基準(0.85/0.95);負值去飽和變灰、正值更鮮豔。
                    //   (位置半徑 rNode 也同步隨 sat 內外移動,與環的「中心=灰、外緣=鮮」一致)
                    const satNorm = nodeSatVal / 99; // [-1, 1]
                    const nodeSat = Math.min(1.0, Math.max(0.12, 0.85 + satNorm * (satNorm >= 0 ? 0.15 : 0.7)));
                    const nodeVal = Math.min(1.0, Math.max(0.5, 0.95 + (satNorm < 0 ? satNorm * 0.12 : 0)));
                    const [r, g, b] = hsv2rgb(nodeHue, nodeSat, nodeVal);
                    const touched = st.axes[a].hue !== 0 || st.axes[a].sat !== 0;
                    // [C] 有調整過的軸存在時,未調整且未選中的節點降存在感(縮小+變淡),讓調過的浮出
                    const dim = !isFocused && anyTouched && !touched && !isSel;
                    const sz = isSel ? 48 : touched ? 42 : dim ? 30 : 38;
                    return (
                      <div key={a}
                        className="aver-wheel-node-btn-wrapper"
                        id={`aver-wheel-node-btn-wrapper-${a}`}
                        style={{
                          position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)",
                          width: sz, height: sz,
                          opacity: hide ? 0 : dim ? 0.4 : 1, pointerEvents: (mOff || hide) ? "none" : "auto",
                          zIndex: isDragNode ? 35 : isSel ? 32 : touched ? 30 : 28,
                          transition: isDragNode ? "none" : "all 0.58s cubic-bezier(0.16, 1, 0.3, 1)",
                          animation: isDragNode ? (focusClosing ? "averNodeRetreat .24s ease-in both" : "averNodeShoot .62s cubic-bezier(0.34, 1.56, 0.64, 1) both") : undefined,
                          overflow: "visible",
                        }}
                      >
                        <button
                          className="aver-wheel-node-btn"
                          id={`aver-wheel-node-btn-${a}`}
                          onClick={isDragNode ? undefined : (e) => { e.stopPropagation(); if (multiStyle === "wheel2") { setSelAxis(a === selAxis ? null : a); } else { enterFocus(a); } }}
                          onPointerDown={isDragNode ? (e) => { if (mOff) return; e.preventDefault(); ringDragRef.current = true; startDrag(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} ringPointerMove(e); } : undefined}
                          onPointerMove={isDragNode ? ringPointerMove : undefined}
                          onPointerUp={isDragNode ? (e) => { ringDragRef.current = false; endDrag(); try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {} } : undefined}
                          style={{
                            width: "100%", height: "100%", borderRadius: "50%",
                            cursor: mOff ? "default" : isDragNode ? "grab" : hide ? "default" : "pointer",
                            touchAction: isDragNode ? "none" : "auto",
                            background: `rgb(${r * 255},${g * 255},${b * 255})`,
                            border: isSel ? "2.5px solid #fff" : "2px solid rgba(255,255,255,0.85)",
                            boxShadow: isSel ? `0 0 22px hsl(${nodeHue} 90% 60% / 0.95), 0 2px 6px rgba(0,0,0,0.5)` : `0 2px 6px rgba(0,0,0,0.45)`,
                            fontSize: isSel ? 15 : dim ? 12 : 15, fontFamily: fMono, fontWeight: 800, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.55)",
                            padding: 0,
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                          {a}
                        </button>
                      </div>
                    );
                  })}

                  <div id="aver-wheel-center-controller" style={{ position: "absolute", inset: 68, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%, #181c21, #0e1114)", border: `1px solid ${(isFocused || (multiStyle === "wheel2" && selAxis)) ? `hsl(${fHue} 60% 45%)` : T.line2}`, boxShadow: "inset 0 0 24px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: "0 12px", boxSizing: "border-box", transition: "border-color 0.48s cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 20 }}>
                    {(isFocused || (multiStyle === "wheel2" && selAxis)) ? (
                      <>
                        <span style={{ fontSize: 12.5, letterSpacing: 0.8, color: T.faint, fontFamily: fMono, whiteSpace: "nowrap", width: "100%", textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", display: "block" }}>{multiStyle === "wheel2" ? "Selected" : "Adjusting"}</span>
                        <span style={{ 
                          fontSize: selAxis === "MG" ? 17 : selAxis === "YL" ? 19 : selAxis === "G" ? 20 : 21, 
                          fontWeight: 700, 
                          color: T.text, 
                          lineHeight: 1.15,
                          marginTop: 2,
                          whiteSpace: "nowrap",
                          width: "100%",
                          textAlign: "center",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          display: "block"
                        }}>{FULL_NAME[selAxis]}</span>
                        <div style={{ display: "flex", gap: 10, marginTop: 4, fontFamily: fMono, fontSize: 13.5, whiteSpace: "nowrap", justifyContent: "center", width: "100%" }}>
                          <span style={{ color: (multiStyle === "wheel2" ? st.axes[selAxis].hue : draftHue) ? T.blue : T.faint }}>
                            H {(multiStyle === "wheel2" ? st.axes[selAxis].hue : draftHue) > 0 ? "+" + (multiStyle === "wheel2" ? st.axes[selAxis].hue : draftHue) : (multiStyle === "wheel2" ? st.axes[selAxis].hue : draftHue)}
                          </span>
                          <span style={{ color: (multiStyle === "wheel2" ? st.axes[selAxis].sat : draftSat) ? T.amber : T.faint }}>
                            S {(multiStyle === "wheel2" ? st.axes[selAxis].sat : draftSat) > 0 ? "+" + (multiStyle === "wheel2" ? st.axes[selAxis].sat : draftSat) : (multiStyle === "wheel2" ? st.axes[selAxis].sat : draftSat)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: 12.5, letterSpacing: 1, color: T.faint, fontFamily: fMono, whiteSpace: "nowrap", width: "100%", textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", display: "block" }}>Select Hue Axis</span>
                        <span style={{ fontSize: 20, fontWeight: 600, color: T.dim, lineHeight: 1.2, marginTop: 2, whiteSpace: "nowrap", width: "100%", textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", display: "block" }}>6 Axes</span>
                        {anyTouched ? (
                          <span style={{ fontSize: 11.5, color: T.amber, marginTop: 3, fontFamily: fMono, whiteSpace: "nowrap", width: "100%", textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", display: "block" }}>● {touchedCount} Axes Adjusted</span>
                        ) : (
                          <span style={{ fontSize: 11, color: T.faint, marginTop: 3, whiteSpace: "nowrap", width: "100%", textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", display: "block" }}>Click any node to adjust</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

                <div style={{ flex: 1, minWidth: 240, height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }} onClick={(e) => e.stopPropagation()}>
                  {multiStyle === "wheel2" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%", width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, width: "100%", boxSizing: "border-box" }}>
                        <span style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>Color Control Items</span>
                        <div style={{ width: 80, display: "flex" }}>
                          <MiniBtn onClick={() => { if (!mOff) upd("axes", DEF_AXES()); }} disabled={mOff}>Default</MiniBtn>
                        </div>
                      </div>
                      
                      {/* [2026-06 PM 定案] 6-Axis Color Control改為 2 欄 × 3 列 grid:不捲動,單一畫面即可調整全部 6 色。
                          gridAutoRows:1fr 讓三列等高填滿可用空間;overflow:hidden 確保不出現 scroll bar。 */}
                      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", gridAutoRows: "1fr", columnGap: 10, rowGap: 4 }}>
                        {AXIS16.map((axis) => {
                          const ax = st.axes[axis];
                          const dotCol = `hsl(${angUI[axis]} 90% 55%)`;
                          
                          return (
                            <div
                              key={axis}
                              onClick={() => { if (!mOff) setSelAxis(axis); }}
                              style={{
                                padding: "4px 8px",
                                borderRadius: 6,
                                border: "1px solid rgba(255, 255, 255, 0.10)",
                                background: "rgba(255, 255, 255, 0.03)",
                                opacity: mOff ? 0.4 : 1,
                                transition: "all 0.2s ease",
                                cursor: "default",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                gap: 2,
                                minWidth: 0
                              }}
                              onMouseEnter={(e) => {
                                if (!mOff) {
                                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.20)";
                                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.10)";
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                              }}
                            >
                              {/* Card Header */}
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: dotCol, boxShadow: `0 0 6px ${dotCol}`, marginRight: 6 }} />
                                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", fontFamily: fUI }}>
                                    {FULL_NAME[axis]}
                                  </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <span style={{ fontSize: 11, fontFamily: fMono, color: (ax.hue || ax.sat) ? T.amber : T.faint }}>
                                    H{ax.hue >= 0 ? "+" : ""}{ax.hue} | S{ax.sat >= 0 ? "+" : ""}{ax.sat}
                                  </span>
                                </div>
                              </div>

                              {/* Card Sliders */}
                              <div style={{ display: "flex", gap: 6, width: "100%", minWidth: 0 }}>
                                {/* Hue Slider */}
                                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.faint }}>
                                    <span>Hue</span>
                                    <span>{ax.hue > 0 ? "+" + ax.hue : ax.hue}</span>
                                  </div>
                                  <input
                                    type="range"
                                    min={-99}
                                    max={99}
                                    value={ax.hue}
                                    disabled={mOff}
                                    onPointerDown={() => { if (!mOff) { setSelAxis(axis); triggerWheelFlash(axis); } }}
                                    onChange={(e) => updAxis(axis, "hue", parseInt(e.target.value))}
                                    className="tr-sl"
                                    style={{
                                      width: "100%",
                                      cursor: mOff ? "not-allowed" : "pointer",
                                      "--p": ((ax.hue - (-99)) / 198) * 100 + "%"
                                    }}
                                  />
                                </div>

                                {/* Saturation Slider */}
                                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.faint }}>
                                    <span>Saturation</span>
                                    <span>{ax.sat > 0 ? "+" + ax.sat : ax.sat}</span>
                                  </div>
                                  <input
                                    type="range"
                                    min={-99}
                                    max={99}
                                    value={ax.sat}
                                    disabled={mOff}
                                    onPointerDown={() => { if (!mOff) { setSelAxis(axis); triggerWheelFlash(axis); } }}
                                    onChange={(e) => updAxis(axis, "sat", parseInt(e.target.value))}
                                    className="tr-sl"
                                    style={{
                                      width: "100%",
                                      cursor: mOff ? "not-allowed" : "pointer",
                                      "--p": ((ax.sat - (-99)) / 198) * 100 + "%"
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 移至標題右側 */}
                    </div>
                  ) : isFocused ? (
                    /* [聚焦態] 控制面板在環右側(並排) */
                    <div className={focusClosing ? "aver-fade-out" : "aver-pop"} style={{ background: "rgba(0,0,0,0.18)", border: `1px solid ${T.line}`, borderRadius: 10, padding: "14px 16px", boxSizing: "border-box" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
                        <span style={{ fontSize: 15, color: T.text, fontWeight: 600 }}>Adjust {FULL_NAME[selAxis]}</span>
                        {(draftHue !== ax.hue || draftSat !== ax.sat) && (
                          <span style={{ fontSize: 11, color: T.amber, fontFamily: fMono }}>● Not Applied Yet</span>
                        )}
                      </div>
                      <Slider k="hue" label="Hue" hint="Hue rotation in this zone" min={-99} max={99} val={draftHue} onChange={(v) => setDraftHue(v)} onStartDrag={startDrag} onEndDrag={endDrag} disabled={mOff} />
                      <Slider k="sat" label="Saturation" hint="Saturation in this zone" min={-99} max={99} val={draftSat} onChange={(v) => setDraftSat(v)} onStartDrag={startDrag} onEndDrag={endDrag} disabled={mOff} />
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button onClick={confirmFocus} disabled={mOff}
                          style={{ flex: 1, padding: "9px 0", fontSize: 13.5, fontWeight: 600, cursor: mOff ? "default" : "pointer", borderRadius: 6, border: "none", background: mOff ? T.line : T.blue, color: mOff ? T.faint : "#fff", fontFamily: fUI }}>
                          OK
                        </button>
                        <button onClick={closeFocus}
                          style={{ flex: 1, padding: "9px 0", fontSize: 13, cursor: "pointer", borderRadius: 6, border: `1px solid ${T.line2}`, background: "transparent", color: T.dim, fontFamily: fUI }}>
                          Cancel
                        </button>
                      </div>
                      <Note>The image and color wheel instantly preview the adjusted effect. <span style={{ color: T.amber }}>Click "OK" to apply changes</span>; "Cancel" to discard.</Note>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", minHeight: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, width: "100%", boxSizing: "border-box" }}>
                        <span style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>Select Hue Axis to Adjust</span>
                        <div style={{ width: 80, display: "flex" }}>
                          <MiniBtn onClick={() => upd("axes", DEF_AXES())} disabled={mOff}>Default</MiniBtn>
                        </div>
                      </div>
                      <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.6, marginBottom: 14 }}>
                        Please click on a node on the left color wheel (e.g. Red, Yellow) or an adjusted color tag below to enter detailed tuning for that axis.
                      </div>

                      <div style={{ flex: 1, overflowY: "auto", marginBottom: 14, minHeight: 0 }}>
                        {AXIS16.some((a) => st.axes[a].hue || st.axes[a].sat) ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            <span style={{ fontSize: 13.5, color: "rgba(255, 255, 255, 0.7)", fontWeight: 600, width: "100%", marginBottom: 4 }}>Adjusted Axes:</span>
                            {AXIS16.filter((a) => st.axes[a].hue || st.axes[a].sat).map((a) => {
                              const FULL_NAME = { R: "Red", YL: "Yellow", G: "Green", CY: "Cyan", B: "Blue", MG: "Magenta" };
                              const dotCol = `hsl(${angUI[a]} 90% 55%)`;
                              return (
                                <div
                                  key={a}
                                  onClick={() => enterFocus(a)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "9px",
                                    padding: "6px 14px",
                                    background: "#181d24",
                                    border: "1px solid rgba(255, 255, 255, 0.12)",
                                    borderRadius: "18px",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    transition: "all 0.22s ease-out",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.25)"
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)";
                                    e.currentTarget.style.background = "#202730";
                                    e.currentTarget.style.boxShadow = `0 0 10px ${dotCol}25, 0 2px 5px rgba(0,0,0,0.25)`;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                                    e.currentTarget.style.background = "#181d24";
                                    e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.25)";
                                  }}
                                >
                                  {/* 左側色彩指示點 */}
                                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: dotCol, boxShadow: `0 0 7px ${dotCol}` }} />
                                  
                                  {/* 中間文字 (全稱 + 數值) */}
                                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: fUI }}>
                                    {FULL_NAME[a]}
                                  </span>
                                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.48)", fontFamily: fMono }}>
                                    H{st.axes[a].hue >= 0 ? "+" : ""}{st.axes[a].hue} S{st.axes[a].sat >= 0 ? "+" : ""}{st.axes[a].sat}
                                  </span>

                                  {/* 右側重設 ✕ 按鈕 */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (mOff) return;
                                      updAxis(a, "hue", 0);
                                      updAxis(a, "sat", 0);
                                    }}
                                    title="Reset this axis to zero"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 17,
                                      height: 17,
                                      borderRadius: "50%",
                                      border: "none",
                                      background: "rgba(255, 255, 255, 0.15)",
                                      color: "rgba(255, 255, 255, 0.7)",
                                      fontSize: 10,
                                      fontWeight: 900,
                                      cursor: "pointer",
                                      transition: "all 0.15s ease",
                                      padding: 0,
                                      marginLeft: 4
                                    }}
                                    onMouseEnter={(e) => {
                                      e.stopPropagation();
                                      e.currentTarget.style.background = "rgba(255, 59, 48, 0.25)";
                                      e.currentTarget.style.color = "#ff3b30";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{ fontSize: 12, color: T.faint }}>No axes adjusted yet.</div>
                        )}
                      </div>
                      {/* 移至標題右側 */}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* === Color Dial盤 (Colour Gauges):弧形量錶 + 中央發光色盤,自適應對齊網格 === */
              <div style={{ width: "100%", boxSizing: "border-box", padding: "6px 8px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: T.dim }}>
                    Drag the outer ring of the dial to adjust Gain, and the slider below to adjust Hue; the central swatch reflects the adjusted color in real-time.
                  </span>
                  <button onClick={() => { if (!mOff) upd("axes", DEF_AXES()); }} disabled={mOff}
                    style={{ flexShrink: 0, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: mOff ? "not-allowed" : "pointer", borderRadius: 7, border: `1px solid ${T.line2}`, background: T.panel2, color: mOff ? T.faint : T.text, fontFamily: fUI, opacity: mOff ? 0.5 : 1 }}>
                    Reset All to Default
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 230px))", justifyContent: "center", gap: 12, alignItems: "stretch", width: "100%", boxSizing: "border-box" }}>
                  {AXIS16.map((a, i) => {
                    const axObj = st.axes[a];
                    const touched = axObj.hue !== 0 || axObj.sat !== 0;
                    const ang = angUI[a];
                    const nodeHue = (ang + (axObj.hue / 99) * 30 + 360) % 360;
                    const nodeSat = Math.max(0.1, Math.min(1.0, 0.85 + (axObj.sat / 99) * 0.3));
                    const nodeVal = Math.max(0.4, Math.min(1.0, 0.9 + (axObj.sat / 99) * 0.45));
                    const [r, g, b] = hsv2rgb(nodeHue, nodeSat, nodeVal);
                    const col = `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
                    return (
                      <div key={a} className="aver-gauge-card" style={{
                        position: "relative", width: "100%", boxSizing: "border-box", padding: "12px 6px 10px",
                        background: "rgba(255,255,255,0.02)",
                        border: `1.5px solid ${T.line2}`, borderRadius: 14,
                        animationDelay: `${i * 65}ms`
                      }}>
                        <ColorGauge label={AXIS_NAME[a]} gain={axObj.sat} hue={axObj.hue} col={col} disabled={mOff}
                          onGain={(v) => updAxis(a, "sat", v)} onHue={(v) => updAxis(a, "hue", v)}
                          startDrag={startDrag} endDrag={endDrag} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (block === "detail") {
      return (
        <div id="aver-control-params-detail">
          <BlockHeader 
            title="Detail" 
          />
          <div style={{ maxWidth: 380 }}>
            <Slider k="detail" label="Level" hint="" min={-7} max={7} val={st.detail} onChange={(v) => upd("detail", v)} onStartDrag={startDrag} onEndDrag={endDrag} />
          </div>
        </div>
      );
    }
    
    if (block === "knee") {
      return (
        <div id="aver-control-params-knee" style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <BlockHeader 
            title="Knee" 
            right={
              <div style={{ width: 80, display: "flex" }}>
                <MiniBtn onClick={() => setSt((s) => ({ ...s, kneeOn: false, autoKnee: false, kneePoint: 95, kneeSlope: 0 }))}>Default</MiniBtn>
              </div>
            }
          />
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flex: 1, minHeight: 0, padding: "8px 0 16px", boxSizing: "border-box" }}>
            <div style={{
              width: "100%",
              maxWidth: 480,
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              borderRadius: 8,
              padding: "16px 20px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}>
              <div id="aver-knee-setting" style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 2 }}>
                <span style={{ width: 72, fontSize: 13, color: T.text, fontWeight: 500, fontFamily: fUI }}>Setting</span>
                <div style={{ display: "flex", gap: 14 }}>
                  <CamRadio id="aver-knee-radio-setting-on" label="On" checked={st.kneeOn} onChange={() => upd("kneeOn", true)} />
                  <CamRadio id="aver-knee-radio-setting-off" label="Off" checked={!st.kneeOn} onChange={() => upd("kneeOn", false)} />
                </div>
              </div>
              <div style={{ height: 1, background: T.line, margin: "2px 0 4px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 6, opacity: st.kneeOn ? 1 : 0.4, pointerEvents: st.kneeOn ? "auto" : "none" }}>
                <span style={{ fontSize: 13, color: T.text, fontWeight: 500, fontFamily: fUI }}>Auto Knee</span>
                <div style={{ display: "flex", gap: 14 }}>
                  <CamRadio id="aver-knee-radio-auto-on" label="On" checked={st.autoKnee} onChange={() => upd("autoKnee", true)} />
                  <CamRadio id="aver-knee-radio-auto-off" label="Off" checked={!st.autoKnee} onChange={() => upd("autoKnee", false)} />
                </div>
              </div>
              
              <Slider k="kneePoint" label="Point" hint="" min={75} max={105} val={st.kneePoint} onChange={(v) => upd("kneePoint", v)} neutral={95} onStartDrag={startDrag} onEndDrag={endDrag} disabled={!st.kneeOn || st.autoKnee} />
              <Slider k="kneeSlope" label="Slope" hint="" min={-5} max={5} val={st.kneeSlope} onChange={(v) => upd("kneeSlope", v)} onStartDrag={startDrag} onEndDrag={endDrag} disabled={!st.kneeOn || st.autoKnee} />
            </div>
          </div>
        </div>
      );
    }
    
    if (block === "black") {
      return (
        <div id="aver-control-params-black" style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <BlockHeader 
            title="Black Level" 
            right={
              <div style={{ width: 80, display: "flex" }}>
                <MiniBtn onClick={() => setSt((s) => ({ ...s, masterBlack: 0, rBlack: 0, bBlack: 0 }))}>Default</MiniBtn>
              </div>
            }
          />
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flex: 1, minHeight: 0, padding: "8px 0 16px", boxSizing: "border-box" }}>
            <div style={{
              width: "100%",
              maxWidth: 480,
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              borderRadius: 8,
              padding: "16px 20px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}>
              <Slider k="masterBlack" label="Master Black" hint="" min={-50} max={50} val={st.masterBlack} onChange={(v) => upd("masterBlack", v)} onStartDrag={startDrag} onEndDrag={endDrag} />
              <Slider k="rBlack" label="R Black" hint="" min={-50} max={50} val={st.rBlack} onChange={(v) => upd("rBlack", v)} onStartDrag={startDrag} onEndDrag={endDrag} />
              <Slider k="bBlack" label="B Black" hint="" min={-50} max={50} val={st.bBlack} onChange={(v) => upd("bBlack", v)} onStartDrag={startDrag} onEndDrag={endDrag} />
            </div>
          </div>
        </div>
      );
    }
  };
  // ==========================================================================
  // E. 佈局架構與 UI 樹 (Page Layout & Main DOM Trees)
  // ==========================================================================
  // ---- Paint/Look 可重用片段(經典 / 劇院 兩種版面共用,避免重複)----
  const paintMonitor = () => (
    <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${T.line}`, background: "#000", flex: 1, minHeight: 0, width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <canvas ref={preRef} width={SW} height={SH} style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }} />

      <div style={{ position: "absolute", left: 12, bottom: 12, height: 38, boxSizing: "border-box", background: "rgba(22, 24, 27, 0.75)", border: `1px solid ${T.line}`, borderRadius: 8, padding: "0 12px", display: "flex", alignItems: "center", gap: 12, backdropFilter: "blur(4px)", zIndex: 20 }}>
        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>Monitor</span>
        <Toggle on={showScope} onChange={setShowScope} />
        {showScope && (
          <div style={{ display: "flex", background: "#101216", border: `1px solid ${T.line}`, borderRadius: 6, padding: 3, gap: 4, alignItems: "center" }}>
            {[["vector", "Vector"], ["wave", "Waveform"], ["hist", "Histogram"]].map(([id, lb]) => (
              <button key={id} onClick={() => setScope(id)} style={{ padding: "4px 10px", fontSize: 14, cursor: "pointer", borderRadius: 4, border: "none", background: scope === id ? T.blue : "transparent", color: scope === id ? "#fff" : T.dim, fontFamily: fUI }}>{lb}</button>
            ))}
          </div>
        )}
      </div>
      {showScope && (
        <div style={{ position: "absolute", right: 12, bottom: 12, zIndex: 20, borderRadius: 6, overflow: "hidden", border: `1px solid ${T.line}`, boxShadow: "0 4px 12px rgba(0,0,0,0.5)", background: "rgba(8,12,10,0.95)", display: "flex", flexDirection: "column", alignItems: "center", padding: "4px" }}>
          <canvas ref={scRef} width={scope === "vector" ? 140 : 190} height={140} style={{ display: "block", borderRadius: 4 }} />
          <div style={{ fontSize: 14, color: T.dim, marginTop: 3, fontFamily: fUI, textAlign: "center" }}>{scope === "vector" ? "Vectorscope (Skin Line)" : scope === "wave" ? "Waveform (0-100%)" : "RGB Histogram (Dark to Bright)"}</div>
        </div>
      )}
    </div>
  );
  const paintSceneTiles = () => (
    <>
      <SceneTile thumb={STD_FIXED_THUMB} name="Default" factory active={activeScene === "std"} dirty={isDirty} onLoad={loadStandard} />
      {scenes.map((s) => (
        <SceneTile key={s.id} thumb={s.thumb} name={s.name} remark={s.remark} active={activeScene === s.id} dirty={isDirty} onLoad={() => loadScene(s)} onEdit={() => { setEditingScene(s.id); setEdName(s.name); setEdRemark(s.remark || ""); setSaveOpen(false); }} onDelete={() => setDeletingScene(s)} />
      ))}
    </>
  );
  const paintBlockNav = (horizontal) => (
    <div style={{ display: "flex", flexDirection: horizontal ? "row" : "column", gap: 8, flexWrap: horizontal ? "wrap" : "nowrap" }}>
      {BLOCKS.map(([id, lb]) => (
        <button key={id} onClick={() => setBlock(id)} style={{ textAlign: "left", padding: "10px 14px", cursor: "pointer", borderRadius: 7, border: `1.5px solid ${block === id ? T.blue : T.line2}`, background: block === id ? "rgba(30,155,240,0.12)" : T.panel2, transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)", boxSizing: "border-box", flex: horizontal ? "0 0 auto" : "none", width: horizontal ? "auto" : "100%", boxShadow: block === id ? `0 0 14px rgba(30,155,240,0.25)` : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
            <span style={{ fontSize: 14.5, color: block === id ? T.blue : T.text, fontWeight: block === id ? 600 : 500 }}>{lb}</span>
            <span style={{ width: 7, height: 7, borderRadius: 4, background: blockActive(id) ? T.green : T.line2 }} />
          </div>
        </button>
      ))}
    </div>
  );
  const paintSaveActions = () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {isDirty && activeScene !== "std" && activeScene != null && (
        <button onClick={() => { const s = scenes.find((x) => x.id === activeScene); if (s) updateScene(s); }} style={{ padding: "6px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer", borderRadius: 6, border: `1px solid ${T.blueDark}`, background: "rgba(30,155,240,0.12)", color: T.blue, fontFamily: fUI, whiteSpace: "nowrap" }}>Save Changes</button>
      )}

      <button onClick={() => { setSaveOpen((v) => !v); setEditingScene(null); setScName(""); setScRemark(""); }} disabled={!isDirty || scenes.length >= 16} style={{ padding: "6px 14px", fontSize: 14, fontWeight: 600, cursor: (!isDirty || scenes.length >= 16) ? "not-allowed" : "pointer", borderRadius: 6, border: "none", background: (!isDirty || scenes.length >= 16) ? "rgba(255, 255, 255, 0.08)" : T.blue, color: (!isDirty || scenes.length >= 16) ? T.faint : "#fff", fontFamily: fUI, opacity: (!isDirty || scenes.length >= 16) ? 0.45 : 1, whiteSpace: "nowrap" }}>Save as New Scene</button>
    </div>
  );
  const paintSceneState = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: T.dim }}>Current Scene: </span>
      <span style={{ fontSize: 14, fontWeight: 700, color: activeScene === "std" ? T.blue : T.text, background: activeScene === "std" ? "rgba(30,155,240,0.1)" : "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: 6, border: `1px solid ${activeScene === "std" ? "rgba(30,155,240,0.2)" : T.line}` }}>
        {activeScene === "std" ? "Default" : (scenes.find((x) => x.id === activeScene)?.name || "Custom Scene")}
      </span>
      {isDirty && (<span style={{ fontSize: 14, fontWeight: 600, color: T.amber, background: "rgba(245,166,35,0.1)", padding: "3px 8px", borderRadius: 4, border: `1px solid rgba(245,166,35,0.2)` }}>● Modified, Unsaved</span>)}
    </div>
  );
  // 設計樣式切換鈕(Radar Wheel / Radar Wheel 2 / Color Dial) - 直式垂直排列版
  const paintStyleToggle = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", background: "#101216", border: `1px solid ${T.line}`, borderRadius: 8, padding: 3, gap: 4, alignItems: "stretch", width: 92, boxSizing: "border-box" }}>
        {[["wheel", "Radar Wheel"], ["wheel2", "Radar Wheel 2"], ["strip", "Color Dial"]].map(([id, lb]) => (
          <button key={id}
            onClick={() => { setMultiStyle(id); setIsFocused(false); }}
            style={{ 
              padding: "6px 0", 
              fontSize: 13, 
              cursor: "pointer", 
              borderRadius: 5, 
              border: "none",
              background: multiStyle === id ? T.blue : "transparent",
              color: multiStyle === id ? "#fff" : T.dim, 
              fontFamily: fUI, 
              transition: "all .28s ease",
              textAlign: "center",
              width: "100%"
            }}
          >
            {lb}
          </button>
        ))}
      </div>
    );
  };

  // ===== Paint/Look Onboarding 三段引導內容 =====
  const ONB_STEPS = [
    {
      tag: "Scene Files",
      title: "Scene File System",
      desc: "Apply the factory 'AVer default' as a starting point, or save your fine-tuned settings as a 'New Scene'. Each scene is stored independently and can be overwritten, reverted, or switched at any time.",
      accent: "#3b82f6",
      visualNote: "Scene card switching: Factory default card + several user scene cards, representing the concept of 'Save / Overwrite / Switch'.",
    },
    {
      tag: "Color Adjustment",
      title: "Left Color Block Adjustment",
      desc: "Fine-tune image color and layers item-by-item: Matrix, Multi-Matrix, Knee, and Black Level. Each block is accompanied by visual aids (color swatches, hue ring, radar color wheel, color dial), making abstract parameters easy to understand.",
      accent: "#22c55e",
      visualNote: "Left block list + slider color adjustment, with visual aids like color swatches / hue ring / dial.",
    },
    {
      tag: "Monitoring & Tuning",
      title: "Monitoring Scopes & Visual Aids",
      desc: "The scopes on the right (Vectorscope, Waveform, Histogram) monitor color and exposure distribution in real-time. Each color block also provides visual aids (swatches, hue ring, radar wheel, color dial), making color tuning intuitive and verifiable.",
      accent: "#f59e0b",
      visualNote: "Scopes (Vectorscope / Waveform / Histogram) + color block visual aids (swatches / hue ring / dial)."
    },
  ];
  const onboardingModal = () => {
    if (!showOnboarding) return null;
    const s = ONB_STEPS[onbStep];
    const last = onbStep === ONB_STEPS.length - 1;
    const close = () => {
      setOnbClosing(true);
      setTimeout(() => { setShowOnboarding(false); setOnbClosing(false); }, 240);
    };
    const goStep = (i) => { if (i >= 0 && i < ONB_STEPS.length) setOnbStep(i); };
    return (
      <div onClick={close} style={{ position: "absolute", inset: 0, zIndex: 100000, background: "rgba(4,6,9,0.72)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", animation: onbClosing ? "averFadeOut .24s ease forwards" : "averFadeIn .25s ease" }}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: 480, maxWidth: "90%", background: "linear-gradient(180deg,#171b21,#10141a)", border: `1px solid ${T.line2}`, borderRadius: 16, boxShadow: "0 24px 70px rgba(0,0,0,0.6)", overflow: "hidden", animation: onbClosing ? "averOnbOut .24s cubic-bezier(.4,0,1,1) forwards" : "averOnbPop .35s cubic-bezier(.16,1,.3,1)" }}>
          {/* 示意圖區(文字描述,待 UI 製作 — 高度比照實際截圖,方便放圖) */}
          <div style={{ height: 230, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: `radial-gradient(circle at 50% 38%, ${s.accent}1a, transparent 72%)`, borderBottom: `1px solid ${T.line}`, position: "relative", padding: "34px 26px 22px", boxSizing: "border-box", transition: "background .35s ease" }}>
            <span style={{ position: "absolute", top: 14, left: 18, fontSize: 12, fontWeight: 700, letterSpacing: 1, color: s.accent, textTransform: "uppercase", transition: "color .35s" }}>{s.tag}</span>
            <span style={{ position: "absolute", top: 12, right: 14, fontSize: 12, color: T.faint, fontFamily: fMono }}>{onbStep + 1} / {ONB_STEPS.length}</span>
            <div key={onbStep} style={{ flex: 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", border: `1px dashed ${T.line2}`, borderRadius: 10, background: "rgba(255,255,255,0.015)", padding: "14px 18px", boxSizing: "border-box", animation: "averOnbStep .4s cubic-bezier(.16,1,.3,1)" }}>
              <span style={{ fontSize: 13, lineHeight: 1.6, color: T.faint, textAlign: "center" }}>{s.visualNote}</span>
            </div>
          </div>
          {/* 文字 */}
          <div key={"t" + onbStep} style={{ padding: "22px 26px 8px", animation: "averOnbStep .4s cubic-bezier(.16,1,.3,1)" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 19, fontWeight: 700, color: T.text, fontFamily: fUI }}>{s.title}</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: T.dim, fontFamily: fUI }}>{s.desc}</p>
          </div>
          {/* 圓點指示 */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "16px 0 6px" }}>
            {ONB_STEPS.map((_, i) => (
              <button key={i} onClick={() => goStep(i)} style={{ width: i === onbStep ? 22 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === onbStep ? s.accent : T.line2, transition: "all .3s cubic-bezier(.16,1,.3,1)" }} />
            ))}
          </div>
          {/* 底部按鈕 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 22px 20px" }}>
            <button onClick={close} style={{ background: "none", border: "none", color: T.faint, fontSize: 13, cursor: "pointer", fontFamily: fUI }}>Skip</button>
            <div style={{ display: "flex", gap: 10 }}>
              {onbStep > 0 && (
                <button onClick={() => goStep(onbStep - 1)} style={{ padding: "9px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", borderRadius: 8, border: `1px solid ${T.line2}`, background: "transparent", color: T.text, fontFamily: fUI }}>Previous</button>
              )}
              <button onClick={() => { if (last) close(); else goStep(onbStep + 1); }} style={{ padding: "9px 22px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", borderRadius: 8, border: "none", background: s.accent, color: "#fff", fontFamily: fUI, boxShadow: `0 4px 14px ${s.accent}55`, transition: "background .35s, box-shadow .35s" }}>{last ? "Get Started" : "Next"}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const onbInfoBtn = () => (
    <button onClick={() => { setOnbStep(0); setOnbClosing(false); setShowOnboarding(true); }} title="Start Onboarding Tour"
      style={{ pointerEvents: "auto", width: 34, height: 34, borderRadius: "50%", border: `1px solid ${T.line2}`, background: "rgba(22,24,27,0.92)", color: T.dim, fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif", fontStyle: "italic", cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      i
    </button>
  );

  // Matrix 視覺化切換鈕(色塊 / 色相環)
  const matrixVizToggle = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, background: "#101216", border: `1px solid ${T.line}`, borderRadius: 8, padding: 3, userSelect: "none", width: 92, boxSizing: "border-box" }}>
      {[["swatch", "Swatch"], ["ring", "Hue Ring"]].map(([id, lb]) => (
        <button key={id} onClick={() => setMatrixViz(id)}
          style={{ padding: "8px 0", fontSize: 12.5, fontWeight: 600, cursor: "pointer", borderRadius: 6, border: "none", background: matrixViz === id ? T.blue : "transparent", color: matrixViz === id ? "#fff" : T.dim, fontFamily: fUI, transition: "all .2s", width: "100%", textAlign: "center" }}>
          {lb}
        </button>
      ))}
    </div>
  );

  // 版面切換鈕(經典 / 劇院) - 滑塊式垂直過渡動畫版
  const paintLayoutToggle = () => {
    const isClassic = paintLayout === "classic";
    return (
      <div style={{ position: "relative", display: "flex", flexDirection: "column", background: "#101216", border: `1px solid ${T.line}`, borderRadius: 8, padding: 3, gap: 4, userSelect: "none", width: 92, boxSizing: "border-box" }}>
        {/* 滑動藍色背景指示器 (垂直滑動) */}
        <div style={{
          position: "absolute",
          left: 3,
          right: 3,
          top: isClassic ? 3 : 35, // 3 + 28按鈕高 + 4gap = 35px
          height: 28,
          background: T.blue,
          borderRadius: 6,
          transition: "all 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
          zIndex: 1
        }} />
        {[["classic", "Classic Layout"], ["cinema", "Cinema Layout"]].map(([id, lb]) => {
          const active = paintLayout === id;
          return (
            <button key={id} onClick={() => setPaintLayout(id)} style={{ 
              position: "relative",
              padding: "6px 0", 
              fontSize: 13, 
              fontWeight: 600, 
              cursor: "pointer", 
              borderRadius: 6, 
              border: "none", 
              background: "transparent", 
              color: active ? "#fff" : T.dim, 
              fontFamily: fUI, 
              transition: "color 0.35s ease",
              zIndex: 2,
              width: "100%",
              height: 28,
              textAlign: "center"
            }}>{lb}</button>
          );
        })}
      </div>
    );
  };

  return (
    <div id="aver-paint-look-root" style={{ position: "relative", background: T.page, width: "100%", height: "100vh", fontFamily: fUI, color: T.text, display: "flex", overflow: "hidden" }}>
      {/* 注入控制滑桿樣式與色環旋轉動畫 */}
      <style>{`
        /* 縮放 125% 與低高度螢幕適配滾動 */
        @media (max-height: 860px) {
          #aver-main-stage {
            overflow-y: auto !important;
            padding-right: 8px !important;
          }
          #aver-content-wrapper {
            height: auto !important;
            min-height: 100% !important;
          }
          .aver-classic-layout-entrance {
            height: auto !important;
            min-height: 100% !important;
            gap: 14px !important;
          }
          #aver-preview-preset-panel {
            flex: none !important;
            height: 380px !important;
          }
          #aver-adjustments-panel {
            flex: none !important;
            height: 350px !important;
            min-height: 350px !important;
          }
          .aver-cinema-layout-entrance {
            height: auto !important;
            min-height: 100% !important;
          }
          .aver-cinema-layout-entrance > div:first-child {
            flex: none !important;
            height: 480px !important;
          }
        }

        /* Keep Live View usable on narrower laptop screens without changing the
           desktop 1 : 1 : 2 preset layout. */
        @media (max-width: 1120px) {
          #aver-live-control-panel {
            flex-basis: 300px !important;
            height: 300px !important;
          }
          #aver-live-control-content-row {
            gap: 6px !important;
            padding: 6px !important;
          }
          #aver-live-shared-ptz-control {
            flex-basis: 190px !important;
            min-width: 190px !important;
            padding: 7px !important;
          }
          #aver-live-camera-control-subpanel {
            grid-template-columns: 190px minmax(180px, 1fr) minmax(180px, 1fr) !important;
            gap: 6px !important;
          }
          #aver-live-preset-subpanel {
            overflow-x: hidden !important;
            overflow-y: hidden !important;
          }
          #aver-live-preset-layout-row {
            flex-wrap: nowrap !important;
            height: 100% !important;
          }
          #aver-live-preset-layout-row #aver-live-preset-save-options {
            flex: 0 0 190px !important;
            min-width: 190px !important;
          }
          #aver-live-preset-layout-row #aver-live-preset-load-options {
            flex: 1 1 100% !important;
            width: 100% !important;
          }
        }

        /* Compact mobile layout: preserve the desktop UI language while
           converting the primary workspace into a touch-friendly single column. */
        @media (max-width: 768px) {
          #aver-paint-look-root {
            flex-direction: column !important;
            overflow: hidden !important;
          }
          #aver-sidebar-container {
            width: 100% !important;
            height: 54px !important;
            min-height: 54px !important;
            padding-top: 0 !important;
            flex-direction: row !important;
            align-items: stretch !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            scrollbar-width: thin;
          }
          #aver-sidebar-container > div:first-child {
            position: sticky !important;
            left: 0 !important;
            z-index: 3 !important;
            flex: 0 0 auto !important;
            padding: 15px 17px !important;
            border-right: 1px solid rgba(255,255,255,0.08) !important;
            background: ${T.side} !important;
            font-size: 18px !important;
          }
          #aver-sidebar-container > [id^="aver-side-menu-"] {
            flex: 0 0 auto !important;
            padding: 17px 14px 14px !important;
            border-left: none !important;
            border-bottom: 3px solid transparent;
            white-space: nowrap !important;
            font-size: 12.5px !important;
          }
          #aver-sidebar-container > .aver-fade {
            display: none !important;
          }
          #aver-version-switcher {
            top: 8px !important;
            right: 8px !important;
            width: 46px !important;
          }
          #aver-version-switcher-button {
            padding: 0 8px !important;
            justify-content: space-between !important;
          }
          #aver-version-switcher-button > span:nth-child(2) {
            display: none !important;
          }
          #aver-version-switcher-menu {
            left: auto !important;
            right: 0 !important;
            width: 232px !important;
          }
          #aver-main-stage {
            width: 100% !important;
            height: calc(100dvh - 54px) !important;
            padding: 8px !important;
            overflow: auto !important;
          }
          #aver-main-stage > .aver-page-transition {
            height: auto !important;
            min-height: 100% !important;
          }
          #aver-content-wrapper,
          #aver-live-view-wrapper,
          #aver-camera-settings-wrapper,
          #aver-network-wrapper,
          #aver-system-wrapper,
          #aver-ndi-wrapper,
          #aver-tracking-wrapper,
          #aver-video-audio-wrapper {
            width: 100% !important;
            height: auto !important;
            min-height: 100% !important;
            margin-left: 0 !important;
            padding-right: 0 !important;
            overflow: visible !important;
          }

          /* Live View and Preset */
          #aver-live-preview-panel {
            flex: 0 0 auto !important;
            width: 100% !important;
            min-height: 0 !important;
            aspect-ratio: 16 / 9;
          }
          #aver-live-control-panel {
            flex: 0 0 auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
          }
          #aver-live-control-content-row {
            flex-direction: column !important;
            overflow: visible !important;
          }
          #aver-live-shared-ptz-control {
            width: 100% !important;
            min-width: 0 !important;
            flex: 0 0 auto !important;
          }
          #aver-live-camera-control-subpanel {
            width: 100% !important;
            grid-template-columns: 1fr !important;
            overflow: visible !important;
          }
          #aver-live-preset-subpanel {
            overflow: visible !important;
          }
          #aver-live-preset-layout-row {
            height: auto !important;
            flex-direction: column !important;
            flex-wrap: nowrap !important;
          }
          #aver-live-preset-ptz-control,
          #aver-live-preset-save-options,
          #aver-live-preset-load-options {
            width: 100% !important;
            min-width: 0 !important;
            flex: 0 0 auto !important;
          }
          #aver-live-preset-save-panel > div {
            flex-wrap: wrap !important;
          }
          #aver-live-preset-card-scroll {
            max-height: 390px !important;
          }

          /* Tracking Settings and Face Enrollment */
          #aver-trk-preview-row {
            flex: 0 0 auto !important;
            flex-direction: column !important;
          }
          #aver-trk-preview-panel {
            flex: 0 0 auto !important;
            width: 100% !important;
            min-height: 0 !important;
            aspect-ratio: 16 / 9;
          }
          #aver-trk-ptz-control-panel {
            width: 100% !important;
            align-self: stretch !important;
            align-items: center !important;
            padding: 10px !important;
          }
          #aver-trk-ptz-control-panel > button {
            width: min(100%, 250px) !important;
          }
          #aver-trk-control-panel {
            flex: 0 0 auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 500px !important;
            overflow: visible !important;
          }
          #aver-trk-tab-bar {
            flex: 0 0 auto !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
          }
          #aver-trk-tab-bar > button {
            flex: 0 0 112px !important;
          }
          #aver-trk-tab-content {
            flex: 0 0 auto !important;
            min-height: 0 !important;
            overflow: visible !important;
          }
          #aver-trk-tab-content > div {
            grid-template-columns: 1fr !important;
          }
          #aver-tracking-zone-panel {
            grid-template-columns: 1fr !important;
          }
          #aver-face-enrollment {
            height: auto !important;
            flex-direction: column !important;
          }
          #aver-face-enrollment-action-panel {
            flex: 0 0 auto !important;
            width: 100% !important;
            padding: 8px !important;
            border-right: none !important;
            border-bottom: 1px solid ${T.line} !important;
          }
          #aver-enrolled-face-panel {
            width: 100% !important;
            min-height: 360px !important;
            padding: 10px 0 0 !important;
          }
          #aver-face-enrollment-header {
            align-items: flex-start !important;
            flex-wrap: wrap !important;
            gap: 4px 10px !important;
          }
          #aver-enrolled-face-list {
            min-height: 330px !important;
            max-height: 520px !important;
            grid-template-columns: repeat(auto-fill, 104px) !important;
            justify-content: center !important;
          }
          #aver-face-select-coachmark {
            width: calc(100% - 20px) !important;
            max-width: none !important;
            white-space: normal !important;
          }

          /* Face Enrollment information dialog */
          #aver-face-enrollment-tour-modal {
            padding: 8px !important;
          }
          #aver-face-enrollment-tour-dialog {
            width: calc(100vw - 16px) !important;
            max-height: calc(100dvh - 16px) !important;
          }
          #aver-face-enrollment-tour-content {
            grid-template-columns: 1fr !important;
            overflow-y: auto !important;
          }
          #aver-face-enrollment-tour-recapture,
          #aver-face-enrollment-tour-priority-order {
            grid-column: 1 !important;
            grid-template-columns: 1fr !important;
            row-gap: 10px !important;
          }
          #aver-face-enrollment-tour-recapture-example,
          #aver-face-enrollment-tour-priority-example {
            width: 100% !important;
          }

          /* Paint / Look: stack the high-level preview area and allow the
             existing detailed controls to scroll rather than being clipped. */
          #aver-preview-preset-panel,
          #aver-adjustments-panel {
            flex: 0 0 auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 420px !important;
          }
          #aver-preview-preset-flex {
            flex-direction: column !important;
          }
          #aver-preview-monitor-block {
            width: 100% !important;
            min-width: 0 !important;
            min-height: 260px !important;
          }
        }

        /* 區塊切換（Matrix / Multi-Matrix / Knee / Black Level）過渡動畫 */
        @keyframes averBlockEntrance {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .aver-block-entrance {
          animation: averBlockEntrance 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* 全域自訂滾動條樣式，使其融入暗色主題 */
        * {
          scrollbar-width: thin;
          scrollbar-color: ${T.line2} rgba(0, 0, 0, 0.1);
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: ${T.line2};
          border-radius: 3px;
          transition: background 0.15s;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${T.blue};
        }

        .tr-sl { -webkit-appearance:none; appearance:none; flex:1; height:4px; border-radius:2px; background:linear-gradient(90deg, ${T.blue} var(--p), #33393f var(--p)); outline:none; cursor:pointer; }
        .tr-sl::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#fff; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,.6); }
        .tr-sl::-moz-range-thumb { width:13px; height:13px; border-radius:50%; background:#fff; border:none; cursor:pointer; }
        @keyframes mmspin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .tr-vfader { -webkit-appearance: none; appearance: none; writing-mode: vertical-lr; direction: rtl; width: 100%; height: 100%; margin: 0; background: transparent; cursor: ns-resize; }
        .tr-vfader::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 8px; border-radius: 3px; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.7); cursor: ns-resize; }
        .tr-vfader::-moz-range-thumb { width: 22px; height: 8px; border-radius: 3px; background: #fff; border: none; cursor: ns-resize; }
        .tr-vfader:disabled { cursor: not-allowed; }

        /* Modal 彈出與縮放動效 */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .aver-focus-back-btn:hover {
          background: ${T.blue} !important;
          box-shadow: 0 0 10px rgba(30, 155, 240, 0.5);
        }

        /* ===== 全域互動動效 ===== */
        /* 出現:彈出/淡入(縮放+上浮) */
        @keyframes averPop {
          from { opacity: 0; transform: translateY(6px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes averFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes averFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes averFadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes averOnbPop {
          from { opacity: 0; transform: translateY(18px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes averOnbOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(10px) scale(.97); }
        }
        @keyframes averOnbStep {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes averPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(245,166,35,.5); }
          50%     { box-shadow: 0 0 0 5px rgba(245,166,35,0); }
        }
        @keyframes averSpin { to { transform: rotate(360deg); } }
        @keyframes averFaceDragLift {
          from { opacity: .45; transform: rotate(0deg) scale(.94); }
          to { opacity: 1; transform: rotate(-2deg) scale(1.04); }
        }
        @keyframes averFaceSelectPulse {
          0%   { opacity: 0; stroke-width: 3px; }
          18%  { opacity: .8; stroke-width: 5px; }
          55%  { opacity: .35; stroke-width: 11px; }
          100% { opacity: 0; stroke-width: 15px; }
        }
        .aver-face-select-pulse {
          animation: averFaceSelectPulse 1.25s cubic-bezier(.2,.7,.25,1) 2;
          pointer-events: none;
        }
        .aver-pop  { animation: averPop .22s cubic-bezier(.2,.8,.3,1) both; }
        .aver-fade { animation: averFade .2s ease both; }
        .aver-page-transition { animation: averFade .2s ease both; }
        .aver-spinner { animation: averSpin .8s linear infinite; }
        .aver-pulse { animation: averPulse 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .aver-page-transition { animation: none; }
        }
        @keyframes averToast {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .aver-toast { animation: averToast .25s cubic-bezier(.2,.8,.3,1) both; }

        /* 切換/點擊/懸停:所有 button 與可點元素統一過渡 */
        button, [role="button"], .aver-tap {
          transition: transform .14s cubic-bezier(.2,.8,.3,1), box-shadow .2s ease,
                      background-color .28s ease, border-color .28s ease, color .28s ease, opacity .25s ease;
        }
        /* 懸停:輕微上浮 + 提亮 */
        button:not(:disabled):hover, .aver-tap:not(.is-disabled):hover {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }
        /* 點擊:回壓,給實體回饋 */
        button:not(:disabled):active, .aver-tap:not(.is-disabled):active {
          transform: translateY(0) scale(.96);
          filter: brightness(.95);
        }
        button:disabled { transition: opacity .18s ease; }

        /* 滑桿把手:懸停放大、按下回壓 */
        .tr-sl::-webkit-slider-thumb { transition: transform .12s ease, box-shadow .15s ease; }
        .tr-sl:not(:disabled):hover::-webkit-slider-thumb { transform: scale(1.18); box-shadow: 0 0 8px rgba(30,155,240,.6); }
        .tr-sl:active::-webkit-slider-thumb { transform: scale(1.05); }
        .tr-vfader::-webkit-slider-thumb { transition: transform .12s ease, box-shadow .15s ease; }
        .tr-vfader:not(:disabled):hover::-webkit-slider-thumb { transform: scaleX(1.15); box-shadow: 0 0 8px rgba(255,255,255,.5); }

        /* 尊重使用者「減少動態」偏好,關閉非必要動畫 */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
        }

        /* 側邊選單項:懸停背景、平滑切換 */
        .aver-menu-item:hover { background: rgba(255,255,255,0.05) !important; }

        /* ===== 聚焦態進場動畫:選中色相「射向環」 ===== */
        /* 從中心向外擴張的光環(radiate) */
        @keyframes averBurst {
          0%   { transform: translate(-50%,-50%) scale(.3); opacity: .7; }
          70%  { opacity: .35; }
          100% { transform: translate(-50%,-50%) scale(1.8); opacity: 0; }
        }
        /* [2026-06] 拖曳色彩控制項時,色相環中央的光圈:快進緩出 + 擴張到最外圈才消逝 —
           0~13% 快速彈出並亮到最強(快進);13~82% 緩慢擴張並「持續保持明亮」;82~100% 抵達最外圈才淡出。 */
        @keyframes averWheelFlash {
          0%   { transform: translate(-50%,-50%) scale(.22); opacity: 0; }
          13%  { transform: translate(-50%,-50%) scale(.55); opacity: .62; }
          82%  { transform: translate(-50%,-50%) scale(1.8);  opacity: .55; }
          100% { transform: translate(-50%,-50%) scale(1.98); opacity: 0; }
        }
        /* 選中節點:從大縮入定位,像衝進環裡 */
        @keyframes averNodeShoot {
          0%   { transform: translate(-50%,-50%) scale(1.85); opacity: 0; filter: brightness(1.5); }
          55%  { opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 1; filter: brightness(1); }
        }
        /* 浮起扇區:輕微縮放淡入 */
        @keyframes averSectorIn {
          from { opacity: 0; transform: scale(.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        .aver-sector-in { animation: averSectorIn .4s cubic-bezier(.2,.8,.3,1) both; transform-origin: 145px 145px; }
        /* 退出聚焦態:扇區/節點退場 */
        @keyframes averSectorOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(.9); }
        }
        @keyframes averNodeRetreat {
          from { transform: translate(-50%,-50%) scale(1); opacity: 1; }
          to   { transform: translate(-50%,-50%) scale(1.9); opacity: 0; }
        }
        @keyframes averBurstOut {
          from { transform: translate(-50%,-50%) scale(1.4); opacity: .4; }
          to   { transform: translate(-50%,-50%) scale(.6); opacity: 0; }
        }
        .aver-sector-out { animation: averSectorOut .24s ease-in both; transform-origin: 145px 145px; }
        @keyframes averFadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(4px); } }
        .aver-fade-out { animation: averFadeOut .22s ease-in both; }
        /* 聚焦環底:快速會聚的脈衝光暈 */
        @keyframes averRingPulse {
          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,.35); }
          100% { box-shadow: 0 0 40px 6px rgba(255,255,255,0); }
        }
        /* === Color Dial:進場 / hover / 拖曳動效 === */
        @keyframes averGaugeIn {
          from { opacity: 0; transform: translateY(14px) scale(.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .aver-gauge-card { animation: averGaugeIn .5s cubic-bezier(.16,1,.3,1) both; transition: transform .28s cubic-bezier(.16,1,.3,1), border-color .25s, box-shadow .3s; }
        .aver-gauge-card:hover { transform: translateY(-5px); }
        @keyframes averGaugePulse {
          0%   { r: 11; opacity: .55; }
          70%  { r: 17; opacity: 0; }
          100% { r: 17; opacity: 0; }
        }
        .aver-gauge-pulse { animation: averGaugePulse 1.1s ease-out infinite; }
      `}</style>

      <div
        id="aver-version-switcher"
        title="Switch prototype version"
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setVersionMenuOpen(false); }}
        style={{ position: "fixed", right: 14, top: 12, zIndex: 90, width: 150, color: T.dim, fontFamily: fUI }}
      >
        <button
          id="aver-version-switcher-button"
          type="button"
          aria-label="Switch prototype version"
          aria-haspopup="listbox"
          aria-expanded={versionMenuOpen}
          onClick={() => setVersionMenuOpen((open) => !open)}
          style={{ width: "100%", height: 34, padding: "0 10px", display: "flex", alignItems: "center", gap: 8, borderRadius: 6, border: `1px solid ${versionMenuOpen ? T.blue : T.line2}`, outline: "none", background: "rgba(16,18,22,0.96)", boxShadow: versionMenuOpen ? "0 0 0 2px rgba(30,155,240,0.15), 0 4px 14px rgba(0,0,0,0.34)" : "0 4px 14px rgba(0,0,0,0.34)", color: "#fff", fontFamily: fUI, fontSize: 11.5, fontWeight: 600, cursor: "pointer", textAlign: "left" }}
        >
          <span aria-hidden="true" style={{ width: 7, height: 7, flexShrink: 0, borderRadius: "50%", background: T.blue, boxShadow: `0 0 7px ${T.blue}` }} />
          <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>V3 · 08/11</span>
          <span aria-hidden="true" style={{ color: T.dim, fontSize: 11, transform: versionMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.16s ease" }}>▼</span>
        </button>
        {versionMenuOpen && (
          <div id="aver-version-switcher-menu" role="listbox" aria-label="Prototype versions" style={{ position: "absolute", top: 38, left: 0, width: "100%", boxSizing: "border-box", padding: 4, borderRadius: 6, border: `1px solid ${T.line2}`, background: T.panel2, boxShadow: "0 10px 28px rgba(0,0,0,0.46)", overflow: "hidden" }}>
            <button id="aver-version-option-v1" type="button" role="option" aria-selected="false" onClick={() => window.location.assign(`${import.meta.env.BASE_URL}v1/index.html`)} onMouseEnter={(event) => { event.currentTarget.style.background = "rgba(255,255,255,0.06)"; }} onMouseLeave={(event) => { event.currentTarget.style.background = "transparent"; }} style={{ width: "100%", minHeight: 32, padding: "6px 9px", border: "none", borderRadius: 4, background: "transparent", color: T.dim, fontFamily: fUI, fontSize: 11.5, textAlign: "left", cursor: "pointer" }}>V1 · 08/10</button>
            <button id="aver-version-option-v2" type="button" role="option" aria-selected="false" onClick={() => window.location.assign(`${import.meta.env.BASE_URL}v2/index.html`)} onMouseEnter={(event) => { event.currentTarget.style.background = "rgba(255,255,255,0.06)"; }} onMouseLeave={(event) => { event.currentTarget.style.background = "transparent"; }} style={{ width: "100%", minHeight: 32, padding: "6px 9px", border: "none", borderRadius: 4, background: "transparent", color: T.dim, fontFamily: fUI, fontSize: 11.5, textAlign: "left", cursor: "pointer" }}>V2 · 08/10</button>
            <button id="aver-version-option-v3" type="button" role="option" aria-selected="true" onClick={() => setVersionMenuOpen(false)} style={{ width: "100%", minHeight: 32, padding: "6px 9px", border: "none", borderRadius: 4, background: "rgba(30,155,240,0.16)", color: "#fff", fontFamily: fUI, fontSize: 11.5, fontWeight: 600, textAlign: "left", cursor: "pointer", boxShadow: `inset 2px 0 0 ${T.blue}` }}>V3 · 08/11</button>
          </div>
        )}
      </div>

      {/* 側邊導覽欄 (AVer WebUI Sidebar Template) */}
      <div id="aver-sidebar-container" style={{ width: 220, background: T.side, flexShrink: 0, paddingTop: 20, display: "flex", flexDirection: "column", height: "100vh", boxSizing: "border-box", overflowY: "auto" }}>
        <div style={{ padding: "4px 24px 20px", fontWeight: 700, fontSize: 22, fontStyle: "italic", letterSpacing: 0.5, color: "#fff" }}>AVer</div>
        {[
          ["Live View", "live", true], 
          ["Camera Settings", "camera", true], 
          ["Paint / Look", "paint", true], 
          ["Video & Audio", "video", true], 
          ["Network", "network", true], 
          ["Tracking Settings", "tracking", true], 
          ["NDI", "ndi", true], 
          ["System", "system", true], 
          ["Audio Integrated", "audio_int", false]
        ].map(([lb, id, implement]) => {
          const active = activeMenu === id;
          return (
            <div 
              key={lb} 
              id={`aver-side-menu-${id}`}
              className="aver-menu-item"
              onClick={() => { if (implement) setActiveMenu(id); }}
              style={{ 
                padding: "14px 24px", fontSize: 14, cursor: implement ? "pointer" : "default", 
                background: active ? T.sideActive : "transparent", 
                color: active ? "#fff" : T.dim, 
                fontWeight: active ? 600 : 400, 
                borderLeft: active ? "4px solid #fff" : "4px solid transparent", 
                transition: "background .25s ease, color .25s ease, border-color .25s ease, font-weight .25s ease" 
              }}
            >
              {lb}
            </div>
          );
        })}
        {(activeMenu === "camera" || activeMenu === "live" || activeMenu === "network" || activeMenu === "tracking" || activeMenu === "ndi" || activeMenu === "system") && (
          <div className="aver-fade" style={{ margin: "8px 0 0", padding: "12px 18px 16px", borderTop: `1px solid ${T.line}`, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 12, letterSpacing: 1, color: T.faint, fontWeight: 600, textTransform: "uppercase" }}>Tracking Control</div>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <span style={{ fontSize: 13, color: T.dim, width: 60, flexShrink: 0 }}>Tracking</span>
              <div style={{ display: "flex", gap: 24 }}>
                <span style={{ width: 44 }}><CamRadio label="On" checked={trackOn} onChange={() => setTrackOn(true)} /></span>
                <CamRadio label="Off" checked={!trackOn} onChange={() => setTrackOn(false)} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
              <span style={{ fontSize: 13, color: T.dim, width: 60, flexShrink: 0, paddingTop: 1 }}>Mode</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["presenter", "Presenter"], ["zone", "Zone"], ["hybrid", "Hybrid"], ["framing", "Framing"]].map(([id, lb]) => (
                  <CamRadio key={id} label={lb} checked={trackMode === id} onChange={() => setTrackMode(id)} />
                ))}
              </div>
            </div>
            <div id="aver-tracking-face-enrollment-toggle" style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
              <span style={{ fontSize: 13, lineHeight: 1.25, color: T.dim, width: 78, flexShrink: 0 }}>Face<br />Enrollment</span>
              <div style={{ display: "flex", gap: 24 }}>
                <span style={{ width: 44 }}>
                  <CamRadio
                    id="aver-tracking-face-enrollment-on"
                    label="On"
                    checked={trk.faceEnrollment}
                    onChange={() => {
                      if (trk.enrolledFaces.length === 0) {
                        setFaceEnrollmentNoDataDialogOpen(true);
                        return;
                      }
                      updTrk("faceEnrollment", true);
                    }}
                  />
                </span>
                <CamRadio id="aver-tracking-face-enrollment-off" label="Off" checked={!trk.faceEnrollment} onChange={() => updTrk("faceEnrollment", false)} />
              </div>
            </div>
            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 0", fontSize: 13, cursor: "pointer", borderRadius: 6, border: `1px solid ${T.line2}`, background: T.panel2, color: T.text, fontFamily: fUI, marginTop: 2 }}>
              ⊕ Click Track
            </button>
          </div>
        )}

      </div>

      {/* 主工作區 (Main Stage Panel) */}
      <div id="aver-main-stage" style={{ position: "relative", flex: 1, padding: "16px 24px", minWidth: 0, background: T.page, overflow: "hidden", height: "100vh", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        <div key={activeMenu} className="aver-page-transition" style={{ width: "100%", height: "100%", minHeight: 0 }}>
        {activeMenu === "paint" ? (
          <div id="aver-content-wrapper" style={{ display: "flex", flexDirection: "column", gap: SP[2], width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", minHeight: 0 }}>

          {paintLayout === "classic" ? (
          <div className="aver-classic-layout-entrance" style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", height: "100%", minHeight: 0 }}>
          {/* 1. LIVE 預覽與Scenes主控制台 */}
          {/* 2026-06-16 修改註記：配合各分頁面板高度一致且防止出現滾動條，預覽區 flex 比例微調為 1.15 */}
          <div id="aver-preview-preset-panel" style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, padding: "14px 20px", display: "flex", flexDirection: "column", gap: 12, width: "100%", boxSizing: "border-box", flex: "1.2 1 0", minHeight: 0 }}>
            
            <div id="aver-preview-preset-flex" style={{ display: "flex", gap: 10, width: "100%", flex: 1, minHeight: 0 }}>
              
              {/* 左半部：影像預覽畫布與多模示波器 */}
              <div id="aver-preview-monitor-block" style={{ flex: 1, minWidth: 320, display: "flex", flexDirection: "column", minHeight: 0 }}>
                <div id="aver-canvas-preview-container" style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: `1px solid ${T.line}`, background: "#000", flex: 1, minHeight: 0, width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  
                  {/* 主要畫面 Canvas — 已修正為 React 物理屬性防抖動架構 */}
                  <canvas ref={preRef} width={SW} height={SH} style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }} />
                  


                  {/* 示波器類型切換列 */}
                  <div id="aver-scope-control-bar" style={{
                    position: "absolute", left: 12, bottom: 12, height: 38, boxSizing: "border-box",
                    background: "rgba(22, 24, 27, 0.75)", border: `1px solid ${T.line}`, borderRadius: 8,
                    padding: "0 12px", display: "flex", alignItems: "center", gap: 12, backdropFilter: "blur(4px)", zIndex: 20
                  }}>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>Monitor</span>
                    <Toggle on={showScope} onChange={setShowScope} />
                    {showScope && (
                      <div style={{ display: "flex", background: "#101216", border: `1px solid ${T.line}`, borderRadius: 6, padding: 3, gap: 4, alignItems: "center" }}>
                        {[["vector", "Vector"], ["wave", "Waveform"], ["hist", "Histogram"]].map(([id, lb]) => (
                          <button 
                            key={id} 
                            onClick={() => setScope(id)} 
                            style={{ 
                              padding: "4px 10px", fontSize: 14, cursor: "pointer", borderRadius: 4, 
                              border: "none", background: scope === id ? T.blue : "transparent", 
                              color: scope === id ? "#fff" : T.dim, fontFamily: fUI 
                            }}
                          >
                            {lb}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 示波器 Canvas 渲染層 */}
                  {showScope && (
                    <div id="aver-scope-canvas-container" style={{
                      position: "absolute", right: 12, bottom: 12, zIndex: 20, borderRadius: 6,
                      overflow: "hidden", border: `1px solid ${T.line}`, boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                      background: "rgba(8,12,10,0.95)", display: "flex", flexDirection: "column", alignItems: "center", padding: "4px"
                    }}>
                      <canvas ref={scRef} width={scope === "vector" ? 140 : 190} height={140} style={{ display: "block", borderRadius: 4 }} />
                      <div style={{ fontSize: 14, color: T.dim, marginTop: 3, fontFamily: fUI, textAlign: "center" }}>
                        {scope === "vector" ? "Vectorscope (Skin Line)" : scope === "wave" ? "Waveform (0-100%)" : "RGB Histogram (Dark to Bright)"}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 右半部:Scenes取用面板 — [設計決策] 純取用層 (載入/編輯/Delete)。
                  「儲存/另存」動作不在此,而在調整區尾端,符合「調完各區塊→在終點存檔」的工作流。
                  Standard 為原廠卡(不可刪/不佔額度);使用者場景含名稱/備註/縮圖,上限 16。 */}
              <div id="aver-preset-save-block" style={{ width: 320, flexShrink: 0, display: "flex", flexDirection: "column", minHeight: 0, alignSelf: "stretch", background: "rgba(0,0,0,0.18)", border: `1px solid ${T.line}`, borderRadius: 8, padding: "14px 10px", boxSizing: "border-box" }}>
                {/* 2026-06 Scenes標頭:標題 + 計數 +（移入)當前套用場景 / Modified, Unsaved狀態 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10, flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Scenes</span>
                    <span style={{ fontSize: 14, color: scenes.length >= 16 ? T.amber : T.faint, fontFamily: fMono }}>{scenes.length}/16</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.dim, flexShrink: 0 }}>Current Scene: </span>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 700,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: activeScene === "std" ? T.blue : T.text,
                      background: activeScene === "std" ? "rgba(30,155,240,0.1)" : "rgba(255,255,255,0.06)",
                      padding: "3px 9px",
                      borderRadius: 6,
                      border: `1px solid ${activeScene === "std" ? "rgba(30,155,240,0.2)" : T.line}`
                    }}>
                      {activeScene === "std" ? "Default" : (scenes.find((x) => x.id === activeScene)?.name || "Custom Scene")}
                    </span>
                    {/* [2026-06] 同排放不下,故「Modified, Unsaved」改用 icon 表示(與卡片上的 dirty 黃標一致),hover 顯示完整文字 */}
                    {isDirty && (
                      <span className="aver-fade" title="Modified, Unsaved" style={{
                        flexShrink: 0,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: T.amber,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 900,
                        lineHeight: 1,
                        border: "1px solid rgba(255,255,255,0.85)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.4)"
                      }}>!</span>
                    )}
                  </div>
                </div>

                {/* 縮圖網格 — 點縮圖即載入 (已調整 padding 預留卡片發光空間) */}
                <div id="aver-preset-grid" style={{ 
                  flex: 1, 
                  minHeight: 0, 
                  overflowY: "auto", 
                  display: "grid", 
                  gridTemplateColumns: "repeat(2, 1fr)", 
                  gap: "8px", 
                  padding: "10px 0px 10px 0px", 
                  alignItems: "start", 
                  alignContent: "start" 
                }}>
                  <SceneTile thumb={STD_FIXED_THUMB} name="Default" factory active={activeScene === "std"} dirty={isDirty} onLoad={loadStandard} />
                  {scenes.map((s) => (
                    <SceneTile key={s.id} thumb={s.thumb} name={s.name} remark={s.remark} active={activeScene === s.id} dirty={isDirty}
                      onLoad={() => loadScene(s)}
                      onEdit={() => { setEditingScene(s.id); setEdName(s.name); setEdRemark(s.remark || ""); setSaveOpen(false); }}
                      onDelete={() => setDeletingScene(s)} />
                  ))}
                  {scenes.length === 0 && (
                    <div style={{ gridColumn: "1 / -1", border: `1.5px dashed ${T.line2}`, borderRadius: 8, padding: "14px 10px", textAlign: "center", color: T.faint, fontSize: 14, lineHeight: 1.6 }}>
                      No custom scenes yet.<br />Adjust parameters in the console below, and save at the bottom of this panel.
                    </div>
                  )}
                </div>

                {/* 2026-06 場景儲存動作列（由調整區頂部移入本面板，集中所有場景相關操作）。 */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.line}`, flexShrink: 0 }}>
                  {isDirty && activeScene !== "std" && activeScene != null && (
                    <button
                      onClick={() => { const s = scenes.find((x) => x.id === activeScene); if (s) updateScene(s); }}
                      style={{ flex: 1, padding: "8px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer", borderRadius: 6, border: `1px solid ${T.blueDark}`, background: "rgba(30,155,240,0.12)", color: T.blue, fontFamily: fUI, transition: "all .15s", whiteSpace: "nowrap" }}
                    >
                      Save Changes
                    </button>
                  )}
                  <button
                    onClick={() => { setSaveOpen((v) => !v); setEditingScene(null); setScName(""); setScRemark(""); }}
                    disabled={!isDirty || scenes.length >= 16}
                    style={{ flex: 1, padding: "8px 14px", fontSize: 14, fontWeight: 600, cursor: (!isDirty || scenes.length >= 16) ? "not-allowed" : "pointer", borderRadius: 6, border: "none", background: (!isDirty || scenes.length >= 16) ? "rgba(255, 255, 255, 0.08)" : T.blue, color: (!isDirty || scenes.length >= 16) ? T.faint : "#fff", fontFamily: fUI, opacity: (!isDirty || scenes.length >= 16) ? 0.45 : 1, transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)", whiteSpace: "nowrap" }}
                  >
                    Save as New Scene
                  </button>
                </div>
                </div>
            </div>
          </div>

          {/* 2. 底部功能分頁選單與數值調整滑桿 */}
          {/* 2. 底部功能分頁選單與數值調整滑桿 */}
          <div id="aver-adjustments-panel" style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: 0, 
            width: "100%", 
            // 2026-06-16 修改註記：配合各分頁面板高度一致，將控制區 flex 設為 1 1 0 提升高度，不使用 auto 彈性高度
            flex: "0.95 1 0", 
            minHeight: 0,
            background: T.panel, 
            border: `1px solid ${T.line}`, 
            borderRadius: 10, 
            boxSizing: "border-box" 
          }}>
            
            {/* 工作區容器 (包含左側 nav 與右側 controls) */}
            <div id="aver-adjustments-workspace" style={{ display: "flex", gap: 0, flex: 1, minHeight: 0, width: "100%" }}>
              
              {/* 左側選單切換 (Block Selection Navigation) */}
              {/* 2026-06-16 修改註記：配合 Chrome 100% 下防裁切，將 padding 由 16px 12px 縮小為 8px 8px */}
              <div id="aver-adjustments-nav" style={{ 
                width: 170, 
                flexShrink: 0, 
                padding: "8px 8px", 
                boxSizing: "border-box", 
                display: "flex", 
                flexDirection: "column", 
                alignSelf: "stretch" 
              }}>
                <div style={{ flex: 1, overflowY: "auto", minHeight: 0, display: "flex", flexDirection: "column", gap: 8, paddingRight: 2, scrollbarGutter: "stable" }}>
                  {BLOCKS.map(([id, lb]) => (
                    <button 
                      key={id} 
                      onClick={() => setBlock(id)} 
                      style={{
                        display: "block", width: "100%", textAlign: "left", padding: "10px 12px", cursor: "pointer", borderRadius: 7,
                        border: `1.5px solid ${block === id ? T.blue : T.line2}`, 
                        background: block === id ? "rgba(30,155,240,0.12)" : T.panel2,
                        transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)", boxSizing: "border-box",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 14.5, color: block === id ? T.blue : T.text, fontWeight: block === id ? 600 : 500 }}>{lb}</span>
                        <span style={{ width: 7, height: 7, borderRadius: 4, background: blockActive(id) ? T.green : T.line2 }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 右側具體調整項 (Parameters Control Stage) */}
              {/* 2026-06-16 修改註記：配合 Chrome 100% 下防裁切，將 padding 由 16px 20px 縮小為 8px 12px */}
              <div id="aver-adjustments-controls" style={{ 
                flex: 1, 
                borderLeft: `1px solid ${T.line}`, 
                padding: "8px 12px", 
                minWidth: 0, 
                display: "flex", 
                flexDirection: "column", 
                alignSelf: "stretch" 
              }}>
                <div key={block} className="aver-block-entrance" style={{ flex: 1, overflow: (block === "multi" && (multiStyle === "wheel" || multiStyle === "wheel2")) ? "visible" : block === "matrix" ? "hidden" : "auto", minHeight: 0, paddingRight: 4, scrollbarGutter: "stable", display: "flex", flexDirection: "column" }}>
                  {renderBlock()}
                </div>
              </div>

            </div>

          </div>
          </div>
          ) : (
          /* ===== Cinema Layout (Cinema):左 Hero 預覽 + 右控制塢 + 底部場景條 ===== */
          <div className="aver-cinema-layout-entrance" style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", height: "100%", minHeight: 0 }}>
            <div style={{ display: "flex", gap: 10, flex: 1, minHeight: 0, width: "100%" }}>
              {/* 左:Hero 預覽 */}
              <div id="aver-cinema-preview-panel" style={{ flex: "1.6 1 0", minWidth: 0, display: "flex", flexDirection: "column", background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, padding: 12, minHeight: 0, boxSizing: "border-box" }}>
                {paintMonitor()}
              </div>
              {/* 右:控制塢 */}
              <div style={{ flex: "1 1 0", minWidth: 360, maxWidth: 480, display: "flex", flexDirection: "column", background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, minHeight: 0, overflow: "hidden", boxSizing: "border-box" }}>
                {/* 塢頂:場景狀態 + 存檔動作 */}
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.line}`, background: "rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", gap: 9, flexShrink: 0 }}>
                  {paintSceneState()}
                  {paintSaveActions()}
                </div>
                {/* 區塊導覽(橫向 pills) */}
                <div style={{ padding: "12px 14px 10px", borderBottom: `1px solid ${T.line}`, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 11, letterSpacing: 1, color: T.faint, fontWeight: 600, textTransform: "uppercase" }}>Tuning Sections</span>
                  {paintBlockNav(true)}
                </div>
                {/* 控制項 */}
                <div key={block} className="aver-block-entrance" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "14px", scrollbarGutter: "stable" }}>
                  {renderBlock()}
                </div>
              </div>
            </div>
            {/* 底部:場景條(橫向) */}
            <div id="aver-cinema-scenes-panel" style={{ flexShrink: 0, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "stretch", gap: 14, boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, flexShrink: 0, paddingRight: 14, borderRight: `1px solid ${T.line}` }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Scenes</span>
                <span style={{ fontSize: 13, color: scenes.length >= 16 ? T.amber : T.faint, fontFamily: fMono }}>{scenes.length}/16</span>
              </div>
              <div style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "150px", gap: 8, overflowX: "auto", overflowY: "hidden", flex: 1, paddingBottom: 4, alignItems: "start" }}>
                {paintSceneTiles()}
              </div>
            </div>
          </div>
          )}
        </div>
        ) : activeMenu === "live" ? (
          <div id="aver-live-view-wrapper" style={{ display: "flex", flexDirection: "column", gap: SP[2], width: "min(1200px, 100%)", marginInline: "auto", height: "100%", minHeight: 0 }}>
            {(() => {
              const sqStyle = (active) => ({ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 8, border: `1px solid ${active ? T.blue : T.line2}`, background: active ? T.blue : T.panel2, color: active ? "#fff" : T.text, fontSize: 17, fontFamily: fUI });
              const sec = { border: `1px solid ${T.line}`, borderRadius: 8, padding: "10px 12px", background: "rgba(0,0,0,0.12)", boxSizing: "border-box" };
              const secTitle = { fontSize: 12, color: T.faint, fontWeight: 600, marginBottom: 8 };
              const presetSection = { background: "rgba(255,255,255,0.035)", border: `1px solid ${T.line}`, borderRadius: 6, overflow: "hidden", boxSizing: "border-box" };
              const presetHeader = { height: 25, padding: "0 8px", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.07)", borderBottom: `1px solid ${T.line}`, color: T.text, fontSize: 12, fontWeight: 600, boxSizing: "border-box" };
              const presetInput = { height: 30, minWidth: 0, boxSizing: "border-box", padding: "0 8px", borderRadius: 4, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fMono, fontSize: 13 };
              const presetButton = { height: 30, padding: "0 14px", boxSizing: "border-box", cursor: "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" };
              const sharedPtzButtonStyle = { ...sqStyle(false), width: 40, height: 40, fontSize: 16 };
              const sharedPtzControl = (
                <div id="aver-live-shared-ptz-control" style={{ ...sec, flex: "0 0 210px", minWidth: 210, padding: "10px", display: "flex", alignItems: "center", justifyContent: "space-evenly", gap: 8, alignSelf: "stretch" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 40px)", gridTemplateRows: "repeat(3, 40px)", gap: 5 }}>
                    <span />
                    <button id="aver-live-btn-pan-up" type="button" aria-label="Tilt up" onClick={() => handlePtz("up")} style={sharedPtzButtonStyle}>▲</button>
                    <span />
                    <button id="aver-live-btn-pan-left" type="button" aria-label="Pan left" onClick={() => handlePtz("left")} style={sharedPtzButtonStyle}>◀</button>
                    <button id="aver-live-btn-pan-home" type="button" aria-label="Reset PTZ view" onClick={() => handlePtz("home")} style={{ ...sharedPtzButtonStyle, borderRadius: "50%", fontSize: 15 }}>⌂</button>
                    <button id="aver-live-btn-pan-right" type="button" aria-label="Pan right" onClick={() => handlePtz("right")} style={sharedPtzButtonStyle}>▶</button>
                    <span />
                    <button id="aver-live-btn-pan-down" type="button" aria-label="Tilt down" onClick={() => handlePtz("down")} style={sharedPtzButtonStyle}>▼</button>
                    <span />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <button id="aver-live-btn-zoom-in" type="button" aria-label="Zoom in" onClick={() => handlePtz("zoom_in")} style={sharedPtzButtonStyle}>＋</button>
                    <span style={{ fontSize: 11.5, color: T.faint }}>Zoom</span>
                    <button id="aver-live-btn-zoom-out" type="button" aria-label="Zoom out" onClick={() => handlePtz("zoom_out")} style={sharedPtzButtonStyle}>－</button>
                  </div>
                </div>
              );
              return (
                <>
                  {/* 預覽畫面外層 container: 填滿剩餘高度與寬度 */}
                  <div
                    id="aver-live-preview-panel"
                    style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${T.line}`, width: "100%", flex: 1, minHeight: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}
                  >
                    {/* 內層 16:9 預覽區：高度 100% 填滿，寬度依 16:9 比例自適應，於左右留下黑邊 */}
                    <div style={{ position: "relative", height: "100%", width: "auto", aspectRatio: "16 / 9", overflow: "hidden" }}>
                      <div id="aver-live-preset-active-preview" data-preset-id={live.appliedPresetId ?? ""} style={{ position: "absolute", inset: 0, backgroundImage: `url(${live.activePreviewImage})`, backgroundSize: "cover", backgroundPosition: "center", transform: `translate(${ptz.pan}%, ${ptz.tilt}%) scale(${ptz.zoom * 1.65})`, transition: "transform 0.1s ease-out, opacity 0.18s ease" }} />
                    </div>
                  </div>

                  {/* 控制面板 */}
                  <div id="aver-live-control-panel" style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, flex: "0 0 300px", height: 300, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {/* 分頁列 */}
                    <div style={{ display: "flex", borderBottom: `1px solid ${T.line}` }}>
                      {[["control", "Camera Control"], ["preset", "Preset"]].map(([id, lb]) => (
                        <button id={`aver-live-tab-${id}`} key={id} onClick={() => updLive("tab", id)}
                          style={{ flex: `0 0 ${colW(4)}px`, padding: "7px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer", border: "none", background: live.tab === id ? T.blue : "transparent", color: live.tab === id ? "#fff" : T.dim, fontFamily: fUI }}>
                          {lb}
                        </button>
                      ))}
                    </div>

                    <div id="aver-live-control-content-row" style={{ display: "flex", gap: 8, padding: 8, flex: 1, minHeight: 0, overflow: "hidden", boxSizing: "border-box" }}>
                    {sharedPtzControl}
                    {live.tab === "control" ? (
                      /* ===== Camera Control ===== */
                      <div id="aver-live-camera-control-subpanel" style={{ display: "grid", gridTemplateColumns: "210px minmax(205px, 1fr) minmax(205px, 1fr)", gap: 8, flex: 1, minWidth: 0, minHeight: 0, overflow: "hidden", boxSizing: "border-box" }}>

                        {/* 對焦 */}
                        <div id="aver-live-focus-control-group" style={{ ...sec, minWidth: 0, padding: "7px 9px", display: "flex", flexDirection: "column", gap: 4, overflow: "hidden" }}>
                          <div id="aver-live-focus-action-row" style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
                            <div id="aver-live-focus-mode-panel" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 76, padding: 4, borderRadius: 6, border: `1px solid ${T.line}`, background: "rgba(255,255,255,0.025)" }}>
                              <button id="aver-live-btn-focus-af" onClick={() => updLive("focusMode", "af")} style={{ ...sqStyle(live.focusMode === "af"), width: "100%", height: 34, fontSize: 14, fontWeight: 700 }}>AF</button>
                              <button id="aver-live-btn-focus-mf" onClick={() => updLive("focusMode", "mf")} style={{ ...sqStyle(live.focusMode === "mf"), width: "100%", height: 34, fontSize: 14, fontWeight: 700 }}>MF</button>
                              <button id="aver-live-btn-focus-onepush" title="One-Push AF" style={{ ...sqStyle(false), width: "100%", height: 34, fontSize: 16 }}>◎</button>
                            </div>
                            <div id="aver-live-focus-step-panel" style={{ width: 58, display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "center", gap: 4 }}>
                              <button id="aver-live-btn-focus-in" disabled={live.focusMode !== "mf"} style={{ ...sqStyle(false), width: "100%", height: 34, opacity: live.focusMode !== "mf" ? 0.4 : 1, cursor: live.focusMode !== "mf" ? "not-allowed" : "pointer" }}>＋</button>
                              <span id="aver-live-focus-step-label" style={{ minHeight: 20, display: "flex", alignItems: "center", justifyContent: "center", borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}`, background: "rgba(255,255,255,0.05)", fontSize: 11, fontWeight: 600, color: T.text }}>Focus</span>
                              <button id="aver-live-btn-focus-out" disabled={live.focusMode !== "mf"} style={{ ...sqStyle(false), width: "100%", height: 34, opacity: live.focusMode !== "mf" ? 0.4 : 1, cursor: live.focusMode !== "mf" ? "not-allowed" : "pointer" }}>－</button>
                            </div>
                          </div>
                          <div id="aver-live-focus-settings" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <div>
                              <div style={{ ...secTitle, marginBottom: 4 }}>Focus Near Limit</div>
                              <select id="aver-live-select-focus-near" value={live.focusNear} onChange={(e) => updLive("focusNear", e.target.value)} style={{ width: "100%", height: 26, padding: "0 7px", fontSize: 12, borderRadius: 4, border: `1px solid ${T.line2}`, background: T.panel2, color: T.text, fontFamily: fUI, cursor: "pointer" }}>
                                {["1cm", "11cm", "30cm", "50cm", "80cm", "1m", "1.5m", "2m", "3m", "5m", "∞"].map((v) => <option key={v} value={v}>{v}</option>)}
                              </select>
                            </div>
                            <div>
                              <div style={{ ...secTitle, marginBottom: 4 }}>AF Mode</div>
                              <select id="aver-live-select-af-mode" value={live.afMode} onChange={(e) => updLive("afMode", e.target.value)} style={{ width: "100%", height: 26, padding: "0 7px", fontSize: 12, borderRadius: 4, border: `1px solid ${T.line2}`, background: T.panel2, color: T.text, fontFamily: fUI, cursor: "pointer" }}>
                                {["Continuous AF", "One-Push AF", "Manual"].map((v) => <option key={v} value={v}>{v}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* 速度 */}
                        <div style={{ ...sec, minWidth: 0, padding: 7, display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
                          <ExpSlider id="aver-live-slider-pan-speed" label="Pan Speed" leftLabel="1" rightLabel="24" valueText={"" + live.panSpeed} min={1} max={24} val={live.panSpeed} onChange={(v) => updLive("panSpeed", v)} />
                          <ExpSlider id="aver-live-slider-tilt-speed" label="Tilt Speed" leftLabel="1" rightLabel="24" valueText={"" + live.tiltSpeed} min={1} max={24} val={live.tiltSpeed} onChange={(v) => updLive("tiltSpeed", v)} />
                          <div id="aver-live-zoom-speed-panel" style={{ width: "100%", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.10)", borderRadius: 8, overflow: "hidden", boxSizing: "border-box" }}>
                            <div style={{ padding: "7px 12px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(255,255,255,0.035)", fontSize: 12.5, color: T.text, fontWeight: 600 }}>Zoom Speed</div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", gap: 16, minHeight: 46, padding: "6px 12px" }}>
                              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}><CamRadio id="aver-live-radio-zoom-speed-high" label="High" checked={live.zoomSpeed === "high"} onChange={() => updLive("zoomSpeed", "high")} /></div>
                              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}><CamRadio id="aver-live-radio-zoom-speed-low" label="Low" checked={live.zoomSpeed === "low"} onChange={() => updLive("zoomSpeed", "low")} /></div>
                            </div>
                          </div>
                        </div>

                        {/* 數位變焦 */}
                        <div style={{ ...sec, minWidth: 0, padding: 7, display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
                          <div>
                            <div style={secTitle}>Digital Zoom</div>
                            <div style={{ display: "flex", gap: 28 }}>
                              <CamRadio id="aver-live-radio-digital-zoom-on" label="On" checked={live.digitalZoom} onChange={() => updLive("digitalZoom", true)} />
                              <CamRadio id="aver-live-radio-digital-zoom-off" label="Off" checked={!live.digitalZoom} onChange={() => updLive("digitalZoom", false)} />
                            </div>
                          </div>
                          <ExpSlider id="aver-live-slider-digital-zoom-limit" label="Digital Zoom Limit" leftLabel="x2" rightLabel="x12" valueText={"x" + live.digitalZoomLimit} min={2} max={12} val={live.digitalZoomLimit} onChange={(v) => updLive("digitalZoomLimit", v)} disabled={!live.digitalZoom} />
                          <CamCheck id="aver-live-check-relative-zoom" label="Relative Zoom Ratio" checked={live.relativeZoom} onChange={(v) => updLive("relativeZoom", v)} />
                          <CamCheck id="aver-live-check-preset-affects" label="Preset Affects PTZ & Focus Values Only" checked={live.presetAffects} onChange={(v) => updLive("presetAffects", v)} />
                        </div>
                      </div>
                    ) : (
                      /* ===== Preset(預設位置)===== */
                      <div id="aver-live-preset-subpanel" style={{ flex: 1, minWidth: 0, minHeight: 0, overflow: "hidden", boxSizing: "border-box" }}>
                        <div id="aver-live-preset-layout-row" style={{ display: "flex", gap: 10, minWidth: 0, height: "100%", minHeight: 0 }}>
                          <div id="aver-live-preset-save-options" style={{ flex: "0 0 210px", minWidth: 210, display: "flex", flexDirection: "column", gap: 6 }}>
                            <label id="aver-live-preset-video-freeze-option" style={{ ...presetSection, minHeight: 34, padding: "0 9px", display: "flex", alignItems: "center", gap: 7, cursor: "pointer", color: T.text, fontSize: 12 }}>
                              <input type="checkbox" checked={live.presetVideoFreeze} onChange={(e) => updLive("presetVideoFreeze", e.target.checked)} />
                              <span>Video Freeze while Preset</span>
                            </label>
                            <label id="aver-live-preset-accuracy-option" style={{ ...presetSection, minHeight: 34, padding: "0 9px", display: "flex", alignItems: "center", gap: 7, cursor: "pointer", color: T.text, fontSize: 12 }}>
                              <input type="checkbox" checked={live.presetAccuracy} onChange={(e) => updLive("presetAccuracy", e.target.checked)} />
                              <span>Preset Accuracy</span>
                            </label>
                            <div id="aver-live-preset-speed-option" style={presetSection}>
                              <div style={{ ...presetHeader, justifyContent: "space-between" }}><span>Preset Speed</span><span style={{ color: T.text, fontFamily: fMono }}>{live.presetSpeed}</span></div>
                              <div style={{ padding: "7px 10px 8px" }}>
                                <input id="aver-live-preset-speed-slider" aria-label="Preset speed" type="range" min="5" max="200" value={live.presetSpeed} onChange={(e) => updLive("presetSpeed", Number(e.target.value))} style={{ width: "100%", accentColor: T.blue }} />
                                <div style={{ display: "flex", justifyContent: "space-between", color: T.faint, fontSize: 11, marginTop: 2 }}><span>5</span><span>200</span></div>
                              </div>
                            </div>
                          </div>
                          <div id="aver-live-preset-load-options" style={{ ...presetSection, flex: "2 1 0", minWidth: 360, display: "flex", flexDirection: "column" }}>
                            <div style={presetHeader}>Preset Library</div>
                            <div id="aver-live-preset-library-body" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignItems: "stretch", gap: 6, padding: 7 }}>
                            <div id="aver-live-preset-save-panel" style={{ flex: "0 0 auto", minWidth: 0 }}>
                              <div style={{ display: "flex", flexWrap: "wrap", columnGap: 6, rowGap: 4, padding: "0 0 2px", alignItems: "center" }}>
                                <div id="aver-live-preset-save-reset-group" style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                                  <span style={{ color: T.faint, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>Save Preset</span>
                                  <input id="aver-live-preset-save-number" aria-label="Save preset number" type="number" min="0" max="255" value={live.presetSaveNumber} onChange={(event) => updLive("presetSaveNumber", event.target.value)} style={{ ...presetInput, width: 54, height: 23, flex: "0 0 54px", fontSize: 11.5 }} />
                                  <button id="aver-live-preset-save-button" type="button" onClick={saveLivePreset} style={{ ...presetButton, height: 23, padding: "0 10px", fontSize: 11 }}>Save</button>
                                  <button
                                    id="aver-live-preset-reset-button"
                                    type="button"
                                    disabled={live.selectedQuickCall == null || !live.presetSnapshots[live.selectedQuickCall]}
                                    onClick={openResetLivePresetDialog}
                                    style={{ ...presetButton, height: 23, padding: "0 9px", fontSize: 11, color: live.selectedQuickCall != null && live.presetSnapshots[live.selectedQuickCall] ? T.text : T.faint, cursor: live.selectedQuickCall != null && live.presetSnapshots[live.selectedQuickCall] ? "pointer" : "not-allowed", opacity: live.selectedQuickCall != null && live.presetSnapshots[live.selectedQuickCall] ? 1 : 0.48 }}
                                  >
                                    Reset
                                  </button>
                                </div>
                                <div aria-hidden="true" style={{ alignSelf: "stretch", width: 1, background: T.line2, margin: "0 2px" }} />
                                <button id="aver-live-preset-edit-scenes-button" type="button" onClick={() => flash("Edit Scenes ready")} style={{ ...presetButton, height: 23, padding: "0 9px", fontSize: 11 }}>Edit Scenes</button>
                                <div id="aver-live-preset-pagination" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                                  <button id="aver-live-preset-page-previous" type="button" aria-label="Previous preset page" disabled={livePresetPage === 0} onClick={() => setLivePresetPage((page) => Math.max(0, page - 1))} style={{ ...presetButton, height: 21, minWidth: 25, padding: "0 6px", opacity: livePresetPage === 0 ? 0.42 : 1, cursor: livePresetPage === 0 ? "not-allowed" : "pointer" }}>‹</button>
                                  <span id="aver-live-preset-page-status" style={{ minWidth: 62, color: T.text, fontFamily: fMono, fontSize: 10.5, textAlign: "center" }}>{livePresetPage + 1} / {LIVE_PRESET_PAGE_COUNT}</span>
                                  <button id="aver-live-preset-page-next" type="button" aria-label="Next preset page" disabled={livePresetPage === LIVE_PRESET_PAGE_COUNT - 1} onClick={() => setLivePresetPage((page) => Math.min(LIVE_PRESET_PAGE_COUNT - 1, page + 1))} style={{ ...presetButton, height: 21, minWidth: 25, padding: "0 6px", opacity: livePresetPage === LIVE_PRESET_PAGE_COUNT - 1 ? 0.42 : 1, cursor: livePresetPage === LIVE_PRESET_PAGE_COUNT - 1 ? "not-allowed" : "pointer" }}>›</button>
                                </div>
                              </div>
                            </div>
                            <div id="aver-live-preset-library-cards-column" style={{ flex: "1 1 0", minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                              <div id="aver-live-preset-card-scroll" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                                <div id="aver-live-preset-quick-call-grid" style={{ height: "100%", display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gridTemplateRows: "repeat(2, minmax(0, 1fr))", gap: 6 }}>
                                  {visibleLivePresetIds.map((n) => {
                                    const snapshot = live.presetSnapshots[n];
                                    const saved = live.savedPresetIds.includes(n) && Boolean(snapshot);
                                    const selected = live.selectedQuickCall === n;
                                    const applied = live.appliedPresetId === n;
                                    const presetName = live.presetNames[n];
                                    return (
                                      <div
                                        id={`aver-live-preset-card-${n}`}
                                        key={n}
                                        ref={(node) => { livePresetCardRefs.current[n] = node; }}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`${presetName}${saved ? "" : " (empty)"}`}
                                        aria-pressed={selected}
                                        data-selected={selected ? "true" : "false"}
                                        data-applied={applied ? "true" : "false"}
                                        onClick={() => setLive((current) => ({ ...current, selectedQuickCall: n, presetSaveNumber: String(n) }))}
                                        onDoubleClick={() => { if (saved) loadLivePreset(n); }}
                                        onKeyDown={(event) => {
                                          if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            setLive((current) => ({ ...current, selectedQuickCall: n, presetSaveNumber: String(n) }));
                                          }
                                        }}
                                        style={{ minWidth: 0, minHeight: 0, overflow: "hidden", boxSizing: "border-box", outline: "none", borderRadius: 5, border: `${applied ? 3 : selected ? 2 : 1}px solid ${applied && selected ? "#4db7f7" : applied ? T.blue : selected ? "#59616b" : T.line}`, background: applied ? "rgba(23,145,236,0.12)" : selected ? "rgba(255,255,255,0.028)" : "#101216", boxShadow: applied && selected ? "0 0 0 1px rgba(77,183,247,0.42)" : applied ? "0 0 0 1px rgba(23,145,236,0.35)" : "none", userSelect: "none", cursor: "pointer", transition: "background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease", display: "flex", flexDirection: "column" }}
                                      >
                                        <div
                                          id={`aver-live-preset-thumbnail-${n}`}
                                          aria-hidden="true"
                                          style={{ position: "relative", width: "100%", flex: "1 1 auto", minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 0, border: "none", borderBottom: `1px solid ${T.line}`, background: "#101216" }}
                                        >
                                          {saved ? (
                                            <div
                                              id={`aver-live-preset-thumbnail-frame-${n}`}
                                              style={{ position: "relative", height: "100%", maxWidth: "100%", aspectRatio: "16 / 9", flex: "0 0 auto", overflow: "hidden", background: "#000" }}
                                            >
                                              <span aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,0,0,0.04), rgba(0,0,0,0.16)), url(${snapshot.image})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", transform: `translate(${snapshot.pan}%, ${snapshot.tilt}%) scale(${snapshot.zoom * 1.65})`, transformOrigin: "center" }} />
                                              <span style={{ position: "absolute", zIndex: 1, left: 4, top: 3, minWidth: 24, height: 16, padding: "0 3px", boxSizing: "border-box", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 3, background: "rgba(0,0,0,0.72)", color: "#fff", fontFamily: fMono, fontSize: 9, fontWeight: 700 }}>{String(n).padStart(3, "0")}</span>
                                            </div>
                                          ) : (
                                            <>
                                              <span style={{ position: "absolute", zIndex: 1, left: 4, top: 3, minWidth: 24, height: 16, padding: "0 3px", boxSizing: "border-box", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 3, background: "rgba(0,0,0,0.72)", color: "#fff", fontFamily: fMono, fontSize: 9, fontWeight: 700 }}>{String(n).padStart(3, "0")}</span>
                                              <span aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: T.faint, fontFamily: fUI, fontSize: 10, fontWeight: 600 }}>None</span>
                                            </>
                                          )}
                                        </div>
                                        {!saved ? (
                                          <div id={`aver-live-preset-empty-name-${n}`} style={{ width: "100%", height: 27, flex: "0 0 27px", boxSizing: "border-box", padding: "0 6px", display: "flex", alignItems: "center", color: T.faint, fontFamily: fUI, fontSize: 11.5 }}>{presetName}</div>
                                        ) : editingLivePresetId === n ? (
                                          <input
                                            id={`aver-live-preset-name-input-${n}`}
                                            aria-label={`Rename preset ${n}`}
                                            autoFocus
                                            value={livePresetNameDraft}
                                            maxLength={24}
                                            onClick={(event) => event.stopPropagation()}
                                            onDoubleClick={(event) => event.stopPropagation()}
                                            onChange={(event) => setLivePresetNameDraft(event.target.value)}
                                            onBlur={commitLivePresetRename}
                                            onKeyDown={(event) => {
                                              event.stopPropagation();
                                              if (event.key === "Enter") commitLivePresetRename();
                                              if (event.key === "Escape") { setEditingLivePresetId(null); setLivePresetNameDraft(""); }
                                            }}
                                            style={{ width: "100%", height: 27, flex: "0 0 27px", boxSizing: "border-box", padding: "0 6px", border: `1px solid ${T.blue}`, background: "#090b0f", color: T.text, fontFamily: fUI, fontSize: 11.5, outline: "none" }}
                                          />
                                        ) : (
                                          <button id={`aver-live-preset-name-${n}`} type="button" title="Click name to edit" onClick={(event) => { event.stopPropagation(); beginLivePresetRename(n); }} onDoubleClick={(event) => event.stopPropagation()} style={{ width: "100%", height: 27, flex: "0 0 27px", minWidth: 0, padding: "0 6px", display: "flex", alignItems: "center", cursor: "text", border: "none", background: "transparent", color: applied || selected ? "#fff" : T.text, fontFamily: fUI, fontSize: 11.5, textAlign: "left" }}>
                                            <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{presetName}</span>
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        ) : activeMenu === "camera" ? (
          <div id="aver-camera-settings-wrapper" style={{ display: "flex", flexDirection: "column", gap: SP[2], width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", minHeight: 0 }}>
            {(() => {
              const en = EXP_ENABLED[cam.expMode];
              const ndMul = { clear: 1, nd4: 0.72, nd16: 0.5, nd128: 0.32 }[cam.ndFilter] ?? 1;
              const evB = (cam.expMode === "bright" ? (cam.brightVal / 31) * 1.1 + 0.45
                : cam.expMode === "manual" ? (cam.gain / 42) * 1.0 + 0.55
                : 1 + cam.ev * 0.13) * ndMul;
              const previewFilter = `brightness(${evB.toFixed(2)}) contrast(${(0.7 + cam.contrast / 4 * 0.6).toFixed(2)}) saturate(${(cam.saturation / 5).toFixed(2)})`;
              const colStyle = { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-evenly" };
              return (
                <>
                  {/* 預覽畫面外層 container: 填滿剩餘高度與寬度 */}
                  <div id="aver-cam-preview-panel" style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${T.line}`, width: "100%", flex: 1, minHeight: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
                    {/* 內層 16:9 預覽區：高度 100% 填滿，寬度依 16:9 比例自適應，於左右留下黑邊 */}
                    <div style={{ position: "relative", height: "100%", width: "auto", aspectRatio: "16 / 9", overflow: "hidden" }}>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: "url(meeting_room.png)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          filter: previewFilter,
                          transform: `${cam.mirror ? "scaleX(-1)" : ""} ${cam.flip ? "scaleY(-1)" : ""}`,
                          transition: "filter .2s ease"
                        }}
                      />
                      <span style={{ position: "absolute", right: 12, top: 10, fontFamily: fMono, fontSize: 12, color: "rgba(255,255,255,.65)", textShadow: "0 1px 2px #000", zIndex: 10 }}>{EXP_MODES.find(([id]) => id === cam.expMode)[1]}</span>
                    </div>
                  </div>

                  {/* 控制面板 */}
                  <div id="aver-cam-control-panel" style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, flex: "0 0 300px", height: 300, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {/* 分頁列 */}
                    <div style={{ display: "flex", borderBottom: `1px solid ${T.line}` }}>
                      {[["exp", "Exposure"], ["img", "Image Process"]].map(([id, lb]) => (
                        <button id={`aver-cam-tab-${id}`} key={id} onClick={() => updCam("tab", id)}
                          style={{ flex: `0 0 ${colW(4)}px`, padding: "7px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer", border: "none", background: cam.tab === id ? T.blue : "transparent", color: cam.tab === id ? "#fff" : T.dim, fontFamily: fUI }}>
                          {lb}
                        </button>
                      ))}
                    </div>

                    {cam.tab === "exp" ? (
                      /* ===== Exposure 分頁 ===== */
                      <div id="aver-cam-exposure-subpanel" style={{ display: "flex", gap: 0, padding: "10px 16px", alignItems: "flex-start", flex: 1, minHeight: 0, overflow: "hidden", boxSizing: "border-box" }}>
                        {/* 模式清單 */}
                        <div style={{ flex: `0 0 ${colW(3)}px`, display: "flex", flexDirection: "column", gap: 4, padding: "0 14px 0 0", borderRight: `1px solid ${T.line}`, alignSelf: "stretch" }}>
                          {EXP_MODES.map(([id, lb]) => (
                            <button id={`aver-cam-btn-expmode-${id}`} key={id} onClick={() => updCam("expMode", id)}
                              style={{
                                padding: "8px 10px",
                                fontSize: 13,
                                textAlign: "left",
                                cursor: "pointer",
                                borderRadius: 6,
                                border: cam.expMode === id ? `1px solid ${T.blue}` : "1px solid rgba(255, 255, 255, 0.10)",
                                background: cam.expMode === id ? T.blue : "rgba(255, 255, 255, 0.03)",
                                color: cam.expMode === id ? "#fff" : T.dim,
                                fontWeight: cam.expMode === id ? 600 : 400,
                                fontFamily: fUI,
                                boxSizing: "border-box",
                                height: "fit-content"
                              }}>
                              {lb}
                            </button>
                          ))}
                        </div>
                        
                        {/* 欄 A */}
                        <div style={{ flex: 1, minWidth: 0, padding: "0 10px", display: "flex", flexDirection: "column", gap: 8 }}>
                          <ExpSlider id="aver-cam-slider-ev" label="Exposure Value" leftLabel="-4" rightLabel="4" valueText={cam.ev > 0 ? "+" + cam.ev : "" + cam.ev} min={-4} max={4} val={cam.ev} onChange={(v) => updCam("ev", v)} disabled={!en.ev} />
                          <ExpSlider id="aver-cam-slider-shutter" label="Shutter Speed" leftLabel="1/4" rightLabel="1/10K" valueText={SHUTTER_LIST[cam.shutterIdx]} min={2} max={SHUTTER_LIST.length - 1} val={cam.shutterIdx} onChange={(v) => updCam("shutterIdx", v)} disabled={!en.shutter} />
                          <ExpSlider id="aver-cam-slider-iris" label="Iris Level" leftLabel="0" rightLabel="F2.8" valueText={IRIS_LIST[cam.irisIdx]} min={0} max={10} val={cam.irisIdx} onChange={(v) => updCam("irisIdx", v)} disabled={!en.iris} />
                        </div>

                        {/* 欄 B */}
                        <div style={{ flex: 1, minWidth: 0, padding: "0 10px", display: "flex", flexDirection: "column", gap: 8 }}>
                          <ExpSlider id="aver-cam-slider-gain" label="Gain Level" leftLabel="0" rightLabel="42" valueText={cam.gain + "dB"} min={0} max={42} val={cam.gain} onChange={(v) => updCam("gain", v)} disabled={!en.gain} />
                          <ExpSlider id="aver-cam-slider-gain-limit" label="Gain Limit Level" leftLabel="24" rightLabel="42" valueText={cam.gainLimit + "dB"} min={24} max={42} val={cam.gainLimit} onChange={(v) => updCam("gainLimit", v)} disabled={!en.gainLimit} />
                          <ExpSlider id="aver-cam-slider-bright-val" label="Bright Value" leftLabel="0" rightLabel="31" valueText={"" + cam.brightVal} min={0} max={31} val={cam.brightVal} onChange={(v) => updCam("brightVal", v)} disabled={!en.bright} />
                        </div>

                        {/* 欄 C */}
                        <div style={{ flex: 1, minWidth: 0, padding: "0 10px", display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                            {/* Slow Shutter 與 BLC 橫向並排並填滿左右空間 */}
                            <div style={{ display: "flex", gap: 8, width: "100%" }}>
                              <CamCheck id="aver-cam-check-slow-shutter" label="Slow Shutter" checked={cam.slowShutter} onChange={(v) => updCam("slowShutter", v)} disabled={!en.slow} />
                              <CamCheck id="aver-cam-check-blc" label="BLC" checked={!!cam.blc} onChange={(v) => updCam("blc", v ? 1 : 0)} disabled={!en.blc} />
                            </div>
                            
                            {/* WDR On/Off/Auto 三段式單選卡片 */}
                            <div id="aver-cam-wdr-radio-panel" style={{
                              width: "100%",
                              borderRadius: 8,
                              border: "1px solid rgba(255, 255, 255, 0.10)",
                              background: "rgba(255, 255, 255, 0.03)",
                              overflow: "hidden",
                              display: "flex",
                              flexDirection: "column",
                              opacity: en.wdr ? 1 : 0.4,
                              pointerEvents: en.wdr ? "auto" : "none",
                              boxSizing: "border-box"
                            }}>
                              <div style={{
                                padding: "5px 12px",
                                background: "rgba(255, 255, 255, 0.05)",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                                fontSize: 12.5,
                                color: T.text,
                                fontWeight: 500,
                                fontFamily: fUI
                              }}>WDR</div>
                              <div style={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                padding: "8px 10px",
                                gap: 6
                              }}>
                                {["off", "on", "auto"].map((mode) => {
                                  const active = cam.wdr === mode;
                                  const labelText = mode === "off" ? "Off" : mode === "on" ? "On" : "Auto";
                                  return (
                                    <div key={mode} onClick={() => updCam("wdr", mode)}
                                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", userSelect: "none", flex: 1 }}>
                                      <div style={{
                                        width: 13,
                                        height: 13,
                                        borderRadius: "50%",
                                        border: `1.5px solid ${active ? T.blue : "rgba(255, 255, 255, 0.4)"}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "transparent",
                                        boxSizing: "border-box"
                                      }}>
                                        {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue }} />}
                                      </div>
                                      <span style={{ fontSize: 11.5, color: active ? T.text : T.dim, fontFamily: fUI }}>{labelText}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          
                          <div style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.10)",
                            borderRadius: 8,
                            padding: "8px 12px",
                            boxSizing: "border-box",
                            marginTop: 4
                          }}>
                            <div style={{ fontSize: 12, color: T.text, marginBottom: 5, fontWeight: 600 }}>ND Filter</div>
                            <select id="aver-cam-select-nd-filter" value={cam.ndFilter} onChange={(e) => updCam("ndFilter", e.target.value)}
                              style={{ width: "100%", padding: "5px 8px", fontSize: 12.5, borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.15)", background: "rgba(255, 255, 255, 0.05)", color: T.text, fontFamily: fUI, cursor: "pointer", outline: "none" }}>
                              <option value="nd128" style={{ background: "#1a1d21", color: "#fff" }}>ND 1/128</option>
                              <option value="nd16" style={{ background: "#1a1d21", color: "#fff" }}>ND 1/16</option>
                              <option value="nd4" style={{ background: "#1a1d21", color: "#fff" }}>ND 1/4</option>
                              <option value="clear" style={{ background: "#1a1d21", color: "#fff" }}>ND Clear</option>
                            </select>
                          </div>

                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto", paddingBottom: 4 }}>
                            <button id="aver-cam-btn-exp-default" onClick={() => setCam({ ...CAM_DEFAULTS, tab: "exp" })}
                              style={{
                                padding: "6px 16px",
                                fontSize: 12,
                                cursor: "pointer",
                                borderRadius: 6,
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                background: "rgba(255, 255, 255, 0.05)",
                                color: T.text,
                                fontFamily: fUI,
                                boxSizing: "border-box",
                                height: "fit-content"
                              }}>
                              Default
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ===== Image Process 分頁(對照實機) ===== */
                      <div id="aver-cam-image-process-subpanel" style={{ display: "flex", gap: 0, padding: "10px 16px", alignItems: "flex-start", flex: 1, minHeight: 0, overflow: "hidden", boxSizing: "border-box" }}>
                        {/* 第 1 欄:White Balance + R/B Gain + One Push */}
                        <div style={{ flex: 1, minWidth: 0, padding: "0 14px 0 10px", borderRight: `1px solid ${T.line}`, display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.10)",
                            borderRadius: 8,
                            padding: "10px 12px",
                            boxSizing: "border-box"
                          }}>
                            <div style={{ fontSize: 12.5, color: T.text, marginBottom: 6, fontWeight: 600 }}>White Balance</div>
                            <select id="aver-cam-select-wb-mode" value={cam.wbMode} onChange={(e) => updCam("wbMode", e.target.value)}
                              style={{ width: "100%", padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.15)", background: "rgba(255, 255, 255, 0.05)", color: T.text, fontFamily: fUI, cursor: "pointer", outline: "none" }}>
                              <option value="auto" style={{ background: "#1a1d21", color: "#fff" }}>AWB</option>
                              <option value="indoor" style={{ background: "#1a1d21", color: "#fff" }}>Indoor</option>
                              <option value="outdoor" style={{ background: "#1a1d21", color: "#fff" }}>Outdoor</option>
                              <option value="onepush" style={{ background: "#1a1d21", color: "#fff" }}>One Push</option>
                              <option value="manual" style={{ background: "#1a1d21", color: "#fff" }}>Manual</option>
                            </select>
                          </div>

                          {cam.wbMode !== "auto" && (
                            <div style={{ display: "flex", gap: 8, width: "100%" }}>
                              <div style={{ flex: 1 }}><ExpSlider id="aver-cam-slider-r-gain" label="R Gain" leftLabel="0" rightLabel="255" valueText={"" + cam.rGain} min={0} max={255} val={cam.rGain} onChange={(v) => updCam("rGain", v)} accent={"#ff6b6b"} /></div>
                              <div style={{ flex: 1 }}><ExpSlider id="aver-cam-slider-b-gain" label="B Gain" leftLabel="0" rightLabel="255" valueText={"" + cam.bGain} min={0} max={255} val={cam.bGain} onChange={(v) => updCam("bGain", v)} /></div>
                            </div>
                          )}

                          <div style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.10)",
                            borderRadius: 8,
                            padding: "10px 12px",
                            boxSizing: "border-box",
                            display: "flex",
                            gap: 10,
                            alignItems: "center"
                          }}>
                            <button id="aver-cam-btn-onepush-set" disabled={cam.wbMode !== "onepush"}
                              style={{
                                padding: "6px 14px",
                                fontSize: 12,
                                cursor: cam.wbMode === "onepush" ? "pointer" : "not-allowed",
                                borderRadius: 6,
                                border: cam.wbMode === "onepush" ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(255, 255, 255, 0.05)",
                                background: cam.wbMode === "onepush" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.01)",
                                color: cam.wbMode === "onepush" ? T.text : T.faint,
                                fontFamily: fUI,
                                flexShrink: 0,
                                boxSizing: "border-box",
                                height: "fit-content"
                              }}>
                              Set
                            </button>
                            <span style={{ fontSize: 11, color: T.faint, lineHeight: 1.3 }}>AWB 'One push' set helper</span>
                          </div>
                        </div>

                        {/* 第 2 欄:Saturation / Contrast / Sharpness(實機範圍) */}
                        <div style={{ flex: 1, minWidth: 0, padding: "0 14px", borderRight: `1px solid ${T.line}`, display: "flex", flexDirection: "column", gap: 8 }}>
                          <ExpSlider id="aver-cam-slider-saturation" label="Saturation" leftLabel="0" rightLabel="10" valueText={"" + cam.saturation} min={0} max={10} val={cam.saturation} onChange={(v) => updCam("saturation", v)} />
                          <ExpSlider id="aver-cam-slider-contrast" label="Contrast" leftLabel="0" rightLabel="4" valueText={"" + cam.contrast} min={0} max={4} val={cam.contrast} onChange={(v) => updCam("contrast", v)} />
                          <ExpSlider id="aver-cam-slider-sharpness" label="Sharpness" leftLabel="0" rightLabel="3" valueText={"" + cam.sharpness} min={0} max={3} val={cam.sharpness} onChange={(v) => updCam("sharpness", v)} />
                        </div>

                        {/* 第 3 欄:Noise Filter + Mirror/Flip/LDC + Default */}
                        <div style={{ flex: 1, minWidth: 0, padding: "0 10px 0 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.10)",
                            borderRadius: 8,
                            padding: "10px 12px",
                            boxSizing: "border-box"
                          }}>
                            <div style={{ fontSize: 12.5, color: T.text, marginBottom: 6, fontWeight: 600 }}>Noise Filter</div>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 6, width: "100%" }}>
                              {[["off", "Off"], ["low", "Low"], ["medium", "Med"], ["high", "High"]].map(([id, lb]) => (
                                <div id={`aver-cam-radio-noise-${id}`} key={id} onClick={() => updCam("noiseFilter", id)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                    cursor: "pointer",
                                    flex: 1,
                                    padding: "6px 4px",
                                    borderRadius: 6,
                                    border: cam.noiseFilter === id ? `1px solid ${T.blue}` : "1px solid rgba(255, 255, 255, 0.10)",
                                    background: cam.noiseFilter === id ? T.blue : "rgba(255, 255, 255, 0.03)",
                                    boxSizing: "border-box",
                                    height: "fit-content",
                                    transition: "all 0.15s ease"
                                  }}>
                                  <span style={{ width: 10, height: 10, borderRadius: "50%", border: `1.5px solid ${cam.noiseFilter === id ? "#fff" : T.line2}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {cam.noiseFilter === id && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff" }} />}
                                  </span>
                                  <span style={{ fontSize: 11.5, color: cam.noiseFilter === id ? "#fff" : T.dim, fontWeight: cam.noiseFilter === id ? 600 : 400 }}>{lb}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div style={{ display: "flex", gap: 8, width: "100%" }}>
                            <CamCheck id="aver-cam-check-mirror" label="Mirror" checked={cam.mirror} onChange={(v) => updCam("mirror", v)} />
                            <CamCheck id="aver-cam-check-flip" label="Flip" checked={cam.flip} onChange={(v) => updCam("flip", v)} />
                            <CamCheck id="aver-cam-check-ldc" label="LDC" checked={cam.ldc} onChange={(v) => updCam("ldc", v)} />
                          </div>
                          
                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                            <button id="aver-cam-btn-img-default" onClick={() => setCam({ ...CAM_DEFAULTS, tab: "img" })}
                              style={{
                                padding: "6px 16px",
                                fontSize: 12,
                                cursor: "pointer",
                                borderRadius: 6,
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                background: "rgba(255, 255, 255, 0.05)",
                                color: T.text,
                                fontFamily: fUI,
                                boxSizing: "border-box",
                                height: "fit-content"
                              }}>
                              Default
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        ) : activeMenu === "network" ? (
          (() => {
            const card = { border: `1.5px solid ${T.line}`, borderRadius: 4, background: "#08090a", display: "flex", flexDirection: "column", boxSizing: "border-box" };
            const head = { background: "#22252a", padding: "4px 12px", fontSize: 14, fontWeight: 600, color: T.dim, borderBottom: `1.5px solid ${T.line}` };
            const body = { padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: 12 };
            const lab = { fontSize: 12.5, color: T.dim, marginBottom: 5, fontWeight: 600 };
            const inp = (val, on, dis) => ({ width: "100%", boxSizing: "border-box", background: dis ? "#0a0b0c" : "#101216", border: `1px solid ${T.line2}`, borderRadius: 4, color: dis ? T.faint : T.text, fontSize: 13.5, padding: "8px 10px", fontFamily: fUI, outline: "none" });
            const Inp = ({ k, disabled }) => (<input value={net[k]} disabled={disabled} onChange={(e) => updNet(k, e.target.value)} style={inp(net[k], null, disabled)} />);
            const Radio2 = ({ k, opts = ["on", "off"], labels = ["On", "Off"] }) => (
              <div style={{ display: "flex", gap: 28, padding: "4px 0" }}>
                {opts.map((o, i) => (
                  <div key={o} onClick={() => updNet(k, o)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <span style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${net[k] === o ? T.blue : T.line2}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {net[k] === o && <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.blue }} />}
                    </span>
                    <span style={{ fontSize: 12.5, color: net[k] === o ? T.text : T.dim }}>{labels[i]}</span>
                  </div>
                ))}
              </div>
            );
            const Btn = ({ children, primary, disabled }) => (
              <button disabled={disabled} style={{ padding: "8px 18px", fontSize: 13.5, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: disabled ? "#0d0f11" : "#1a1d21", color: disabled ? T.faint : T.text, fontFamily: fUI }}>{children}</button>
            );
            const sel = { width: "100%", boxSizing: "border-box", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 4, color: T.text, fontSize: 13.5, padding: "8px 10px", fontFamily: fUI };
            const dhcpOn = net.dhcp === "on";
            return (
              <div id="aver-network-wrapper" style={{ width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", overflowY: "auto", paddingRight: 8, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: SP[3] }}>
                {/* Row 1: DHCP / Hostname / NTP */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3] }}>
                  <div style={card}>
                    <div style={head}>DHCP</div>
                    <div style={body}>
                      <Radio2 k="dhcp" />
                      <div><div style={lab}>IP Address</div><Inp k="ip" disabled={dhcpOn} /></div>
                      <div><div style={lab}>Gateway</div><Inp k="gateway" disabled={dhcpOn} /></div>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>Hostname</div>
                    <div style={body}>
                      <div><Inp k="hostname" /></div>
                      <div><div style={lab}>Netmask</div><Inp k="netmask" disabled={dhcpOn} /></div>
                      <div><div style={lab}>DNS</div><Inp k="dns" disabled={dhcpOn} /></div>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>NTP</div>
                    <div style={body}>
                      <Radio2 k="ntp" />
                      <div><div style={lab}>NTP Server</div><Inp k="ntpServer" /></div>
                      <div style={{ marginTop: 4 }}><Btn>Confirm</Btn></div>
                    </div>
                  </div>
                </div>
                {/* Row 2: RTMP / RTSP / HLS */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3] }}>
                  <div style={card}>
                    <div style={head}>RTMP Settings</div>
                    <div style={body}>
                      <div><div style={lab}>Server URL</div><Inp k="rtmpUrl" /></div>
                      <div><div style={lab}>Stream Key</div><Inp k="rtmpKey" /></div>
                      <div style={{ display: "flex", gap: 10 }}><Btn>Start Stream</Btn><Btn disabled>STOP</Btn></div>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>RTSP Security</div>
                    <div style={body}>
                      <Radio2 k="rtspSec" />
                      <div style={lab}>RTSP Audio Enable</div>
                      <Radio2 k="rtspAudio" />
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>HLS Settings</div>
                    <div style={body}>
                      <div><div style={lab}>Stream URL</div><Inp k="hlsUrl" /></div>
                      <div style={{ display: "flex", gap: 10, marginTop: 4 }}><Btn>Start Stream</Btn><Btn disabled>STOP</Btn></div>
                    </div>
                  </div>
                </div>
                {/* Row 3: SRT */}
                <div style={card}>
                  <div style={head}>SRT Settings</div>
                  <div style={{ ...body, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3] }}>
                    <div><div style={lab}>Destination IP</div><Inp k="srtIp" /></div>
                    <div><div style={lab}>Port</div><Inp k="srtPort" /></div>
                    <div><div style={lab}>Encryption</div>
                      <select value={net.srtEnc} onChange={(e) => updNet("srtEnc", e.target.value)} style={sel}>
                        <option>None</option><option>AES-128</option><option>AES-192</option><option>AES-256</option>
                      </select>
                    </div>
                    <div><div style={lab}>Latency (ms)</div><Inp k="srtLatency" /></div>
                    <div><div style={lab}>Passphrase</div><Inp k="srtPass" /></div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <div style={{ fontSize: 12.5, color: T.dim, marginBottom: 8 }}>Connect Status: <span style={{ color: T.faint }}>Disconnected</span></div>
                      <div style={{ display: "flex", gap: 10 }}><Btn>Start Stream</Btn><Btn disabled>STOP</Btn></div>
                    </div>
                  </div>
                </div>
                {/* Row 4: HTTPS / Upload Cert / SSHD */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3] }}>
                  <div style={card}>
                    <div style={head}>HTTPS</div>
                    <div style={body}><Radio2 k="https" opts={["only", "on", "off"]} labels={["Only", "On", "Off"]} /></div>
                  </div>
                  <div style={card}>
                    <div style={head}>Upload Certificate　<span style={{ fontWeight: 400, color: T.faint }}>Cert Status: None</span></div>
                    <div style={{ ...body, flexDirection: "row", alignItems: "center", gap: 12 }}>
                      <Btn>選擇檔案</Btn><span style={{ fontSize: 12.5, color: T.faint }}>未選擇任何檔案</span><Btn disabled>Upload</Btn>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>SSHD</div>
                    <div style={body}><Radio2 k="sshd" /></div>
                  </div>
                </div>
                {/* Row 5: Visca */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3] }}>
                  <div style={card}>
                    <div style={head}>Visca Port Mode</div>
                    <div style={body}>
                      <select value={net.viscaMode} onChange={(e) => updNet("viscaMode", e.target.value)} style={sel}>
                        <option>Default</option><option>TCP</option><option>UDP</option>
                      </select>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>Visca Port Number</div>
                    <div style={{ ...body, flexDirection: "row", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 12.5, color: T.dim }}>Port</span>
                      <input value={net.viscaPort} disabled style={{ ...inp(net.viscaPort, null, true), width: 120 }} />
                      <Btn disabled>Save</Btn>
                    </div>
                  </div>
                  <div />
                </div>
                {/* 802.1X 等其餘區塊（截圖未完整顯示）暫留空白 */}
                <div style={{ ...card, minHeight: 80 }}>
                  <div style={head}>802.1X Enable</div>
                  <div style={{ ...body, color: T.faint, fontSize: 12.5 }}>（內容待補）</div>
                </div>
              </div>
            );
          })()
        ) : activeMenu === "system" ? (
          (() => {
            const card = { border: `1.5px solid ${T.line}`, borderRadius: 4, background: "#08090a", display: "inline-flex", flexDirection: "column", boxSizing: "border-box", alignSelf: "flex-start" };
            const head = { background: "#22252a", padding: "4px 12px", fontSize: 14, fontWeight: 600, color: T.dim, borderBottom: `1.5px solid ${T.line}`, whiteSpace: "nowrap" };
            const body = { padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 };
            const inpStyle = { boxSizing: "border-box", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 4, color: T.text, fontSize: 13.5, padding: "8px 10px", fontFamily: fUI, outline: "none", minWidth: colW(5) };
            const Inp = ({ k, type, w = colW(5) }) => (<input type={type || "text"} value={sys[k]} onChange={(e) => updSys(k, e.target.value)} style={{ ...inpStyle, minWidth: w }} />);
            const lab = { fontSize: 12.5, color: T.dim, marginBottom: 5, fontWeight: 600 };
            const Btn = ({ children }) => (<button style={{ padding: "8px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: "#1a1d21", color: T.text, fontFamily: fUI, whiteSpace: "nowrap" }}>{children}</button>);
            const sel = { ...inpStyle, minWidth: colW(4) };
            const Radio2 = ({ k }) => (
              <div style={{ display: "flex", gap: 28, padding: "2px 0" }}>
                {[["on", "On"], ["off", "Off"]].map(([o, l]) => (
                  <div key={o} onClick={() => updSys(k, o)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <span style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${sys[k] === o ? T.blue : T.line2}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {sys[k] === o && <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.blue }} />}
                    </span>
                    <span style={{ fontSize: 12.5, color: sys[k] === o ? T.text : T.dim }}>{l}</span>
                  </div>
                ))}
              </div>
            );
            const Check = ({ k, label, extra }) => (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, alignSelf: "flex-start", background: "#08090a", border: `1.5px solid ${T.line}`, borderRadius: 4, padding: "10px 14px" }}>
                <div onClick={() => updSys(k, !sys[k])} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <span style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${sys[k] ? T.blue : T.line2}`, background: sys[k] ? T.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }}>{sys[k] && "✓"}</span>
                  <span style={{ fontSize: 13.5, color: T.text, whiteSpace: "nowrap" }}>{label}</span>
                </div>
                {extra}
              </div>
            );
            const bigRow = { width: "100%", boxSizing: "border-box", display: "flex", flexWrap: "wrap", gap: SP[3], alignItems: "flex-start", padding: `${SP[3]}px 0`, borderBottom: `1px solid ${T.line}` };
            const INFO = [["Model Name", "TR315"], ["IP Address", "10.100.10.90"], ["Serial Number", "5313892200034"], ["MAC Address", "00:18:1A:11:C9:6D"], ["Firmware Version", "0.1.0001.18"], ["Lens Firmware Version", "A027"], ["MCU Firmware Version", "BB354DE9"]];
            return (
              <div id="aver-system-wrapper" style={{ width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", overflowY: "auto", paddingRight: 8, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                {/* Row 1: Upgrade Firmware / Factory Default + 設備資訊 */}
                <div style={bigRow}>
                  <div style={{ display: "flex", flexDirection: "column", gap: SP[3] }}>
                    <div style={card}>
                      <div style={head}>Upgrade Firmware</div>
                      <div style={{ ...body, flexDirection: "row", alignItems: "center", gap: 12 }}>
                        <Btn>選擇檔案</Btn><span style={{ fontSize: 12.5, color: T.faint }}>未選擇任何檔案</span><Btn>Upgrade</Btn>
                      </div>
                    </div>
                    <div style={card}>
                      <div style={head}>Factory Default</div>
                      <div style={{ ...body }}><Btn>Reset to Factory Default</Btn></div>
                    </div>
                  </div>
                  <div style={{ ...card, padding: "14px 18px", display: "flex" }}>
                    {INFO.map(([k, v]) => (
                      <div key={k} style={{ display: "flex", gap: 16, fontSize: 13, padding: "3px 0" }}>
                        <span style={{ color: T.dim, width: 170 }}>{k}</span>
                        <span style={{ color: T.text, fontFamily: fMono }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 2: Login / Language / Syslog */}
                <div style={bigRow}>
                  <div style={card}>
                    <div style={head}>Login</div>
                    <div style={body}>
                      <div><div style={lab}>Login Name</div><Inp k="loginName" /></div>
                      <div><div style={lab}>Login Password</div><Inp k="loginPwd" type="password" /></div>
                      <div style={{ display: "flex", gap: 10, marginTop: 2 }}><Btn>Change</Btn><Btn>Cancel</Btn></div>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>Language</div>
                    <div style={body}>
                      <select value={sys.language} onChange={(e) => updSys("language", e.target.value)} style={sel}>
                        <option>English</option><option>繁體中文</option><option>简体中文</option><option>日本語</option>
                      </select>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 2 }}><Btn>Reboot</Btn><Btn>Set Date/Time</Btn></div>
                      <div style={{ display: "flex" }}><Btn>Power Schedule</Btn></div>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>Syslog</div>
                    <div style={body}>
                      <div><div style={lab}>IP Address</div><Inp k="syslogIp" /></div>
                      <div><div style={lab}>Port</div><Inp k="syslogPort" /></div>
                      <Radio2 k="syslog" />
                    </div>
                  </div>
                </div>

                {/* Row 3: Status OSD / Setting / Status Live View + Export Log */}
                <div style={bigRow}>
                  <div style={card}>
                    <div style={head}>Status OSD</div>
                    <div style={body}><Radio2 k="statusOsd" /></div>
                  </div>
                  <div style={card}>
                    <div style={head}>Setting</div>
                    <div style={{ ...body, flexDirection: "row", gap: 10 }}><Btn>Import Setting</Btn><Btn>Export Setting</Btn></div>
                  </div>
                  <div style={card}>
                    <div style={head}>Status Live View</div>
                    <div style={body}><Radio2 k="statusLiveView" /></div>
                  </div>
                  <div style={{ alignSelf: "center" }}><Btn>Export Log</Btn></div>
                </div>

                {/* Row 4: Power Up/Off to Preset / Power Off Completely */}
                <div style={bigRow}>
                  <div style={card}>
                    <div style={head}><Check k="powerUpPreset" label="Power Up to Preset" /></div>
                    <div style={{ ...body, flexDirection: "row", gap: 10, alignItems: "center" }}><Inp k="powerUpVal" w={colW(4)} /><Btn>Save</Btn></div>
                  </div>
                  <div style={card}>
                    <div style={head}><Check k="powerOffPreset" label="Power Off to Preset" /></div>
                    <div style={{ ...body, flexDirection: "row", gap: 10, alignItems: "center" }}><Inp k="powerOffVal" w={colW(4)} /><Btn>Save</Btn></div>
                  </div>
                  <div style={card}>
                    <div style={head}>Power Off Completely</div>
                    <div style={body}><Radio2 k="powerOffComplete" /></div>
                  </div>
                </div>

                {/* Row 5: VISCA Customized Function */}
                <div style={bigRow}>
                  <Btn>VISCA Customized Function</Btn>
                </div>

                {/* Row 6: Sleep to Preset / Sleep Timer */}
                <div style={bigRow}>
                  <div style={card}>
                    <div style={head}>Sleep to Preset</div>
                    <div style={{ ...body, maxWidth: 300 }}>
                      <select value={sys.sleepPreset} onChange={(e) => updSys("sleepPreset", e.target.value)} style={sel}>
                        <option>Preset 20</option><option>Preset 1</option><option>Preset 2</option>
                      </select>
                      <div style={{ fontSize: 11.5, color: T.faint, lineHeight: 1.55 }}>Sleep presets can be enabled in the Zoom/Teams video theme, and presets can be set for sleep positions.</div>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>Sleep Timer</div>
                    <div style={{ ...body, maxWidth: 300 }}>
                      <div style={{ display: "flex", gap: 22 }}>
                        {[["10sec", "10 sec"], ["5min", "5 min"], ["10min", "10 min"]].map(([o, l]) => (
                          <div key={o} onClick={() => updSys("sleepTimer", o)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                            <span style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${sys.sleepTimer === o ? T.blue : T.line2}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {sys.sleepTimer === o && <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.blue }} />}
                            </span>
                            <span style={{ fontSize: 12.5, color: sys.sleepTimer === o ? T.text : T.dim }}>{l}</span>
                          </div>
                        ))}
                      </div>
                      <div onClick={() => updSys("sleepAutoTrack", !sys.sleepAutoTrack)} style={{ display: "flex", gap: 8, cursor: "pointer", alignItems: "flex-start" }}>
                        <span style={{ width: 16, height: 16, flexShrink: 0, borderRadius: 3, border: `1.5px solid ${sys.sleepAutoTrack ? T.blue : T.line2}`, background: sys.sleepAutoTrack ? T.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", marginTop: 1 }}>{sys.sleepAutoTrack && "✓"}</span>
                        <span style={{ fontSize: 11.5, color: T.dim, lineHeight: 1.5 }}>Turn on Auto Tracking or SmartFrame (depending on model) when exiting Sleep Mode.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 7: Help Improving / LED Brightness / Camera Selector */}
                <div style={{ ...bigRow, borderBottom: "none" }}>
                  <div style={card}>
                    <div style={head}>Help Improving AVer Camera</div>
                    <div style={{ ...body, maxWidth: 300 }}>
                      <select value={sys.helpImprove} onChange={(e) => updSys("helpImprove", e.target.value)} style={sel}>
                        <option>Disable</option><option>Enable</option>
                      </select>
                      <div style={{ fontSize: 11.5, color: T.faint, lineHeight: 1.55 }}>Allow providing of anonymous usage data.</div>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>LED Indicator Brightness</div>
                    <div style={{ ...body, minWidth: colW(5) }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", fontFamily: fMono, fontSize: 13, color: T.blue }}>{sys.ledBrightness}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, color: T.faint }}>0</span>
                        <input type="range" min={0} max={10} value={sys.ledBrightness} onChange={(e) => updSys("ledBrightness", parseInt(e.target.value))} className="tr-sl" style={{ "--p": (sys.ledBrightness / 10) * 100 + "%", flex: 1 }} />
                        <span style={{ fontSize: 11, color: T.faint }}>10</span>
                      </div>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>Camera Selector</div>
                    <div style={body}>
                      <select value={sys.cameraSelector} onChange={(e) => updSys("cameraSelector", e.target.value)} style={sel}>
                        <option>1</option><option>2</option><option>3</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : activeMenu === "ndi" ? (
          (() => {
            // 卡片(hug contents):深色橫條 header + 黑底框
            const card = { border: `1.5px solid ${T.line}`, borderRadius: 4, background: "#08090a", display: "inline-flex", flexDirection: "column", boxSizing: "border-box", alignSelf: "flex-start" };
            const head = { background: "#22252a", padding: "4px 12px", fontSize: 14, fontWeight: 600, color: T.dim, borderBottom: `1.5px solid ${T.line}`, whiteSpace: "nowrap" };
            const body = { padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 };
            const inpStyle = { boxSizing: "border-box", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 4, color: T.text, fontSize: 13.5, padding: "8px 10px", fontFamily: fUI, outline: "none", minWidth: colW(5) };
            const sel = { ...inpStyle, minWidth: colW(5) };
            const Inp = ({ k, w = colW(5) }) => (<input value={ndi[k]} onChange={(e) => updNdi(k, e.target.value)} style={{ ...inpStyle, minWidth: w }} />);
            const Radio = ({ k, val, label }) => (
              <div onClick={() => updNdi(k, val)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${ndi[k] === val ? T.blue : T.line2}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {ndi[k] === val && <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.blue }} />}
                </span>
                <span style={{ fontSize: 12.5, color: ndi[k] === val ? T.text : T.dim }}>{label}</span>
              </div>
            );
            const Check = ({ k, label, extra }) => (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, alignSelf: "flex-start", background: "#08090a", border: `1.5px solid ${T.line}`, borderRadius: 4, padding: "10px 14px", boxSizing: "border-box" }}>
                <div onClick={() => updNdi(k, !ndi[k])} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <span style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${ndi[k] ? T.blue : T.line2}`, background: ndi[k] ? T.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }}>{ndi[k] && "✓"}</span>
                  <span style={{ fontSize: 13.5, color: T.text, whiteSpace: "nowrap" }}>{label}</span>
                </div>
                {extra}
              </div>
            );
            const Btn = ({ children }) => (<button style={{ padding: "8px 22px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: "#1a1d21", color: T.text, fontFamily: fUI }}>{children}</button>);
            // 大區塊外框(fill 左右寬度)
            const bigRow = { width: "100%", boxSizing: "border-box", display: "flex", flexWrap: "wrap", gap: SP[3], alignItems: "flex-start", padding: `${SP[3]}px 0`, borderBottom: `1px solid ${T.line}` };
            const fieldLab = { fontSize: 12.5, color: T.dim, marginBottom: 5, fontWeight: 600 };
            return (
              <div id="aver-ndi-wrapper" style={{ width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", overflowY: "auto", paddingRight: 8, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                {/* 頂部:Built-in NDI */}
                <div style={{ ...bigRow }}>
                  <button style={{ padding: "10px 28px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: ndi.mode === "builtin" ? "#1a1d21" : "transparent", color: T.text, fontFamily: fUI }}>Built-in NDI</button>
                </div>

                {/* Video Bandwidth / Stream Video Output / Framerate / Encoding Type */}
                <div style={bigRow}>
                  <div style={card}>
                    <div style={head}>Video Bandwidth</div>
                    <div style={{ ...body, flexDirection: "row", gap: 24, padding: "12px 16px" }}>
                      <Radio k="bandwidth" val="low" label="Low" />
                      <Radio k="bandwidth" val="medium" label="Medium" />
                      <Radio k="bandwidth" val="high" label="High" />
                      <Radio k="bandwidth" val="ndihx3" label="NDI HX3" />
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>Stream Video Output</div>
                    <div style={body}>
                      <select value={ndi.streamOut} onChange={(e) => updNdi("streamOut", e.target.value)} style={sel}>
                        <option>1920x1080</option><option>1280x720</option><option>3840x2160</option>
                      </select>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>Framerate</div>
                    <div style={body}>
                      <select value={ndi.framerate} onChange={(e) => updNdi("framerate", e.target.value)} style={{ ...sel, minWidth: colW(4) }}>
                        <option>60</option><option>50</option><option>30</option><option>25</option>
                      </select>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={head}>Encoding Type</div>
                    <div style={{ ...body, flexDirection: "row", gap: 32, padding: "12px 20px" }}>
                      <Radio k="encoding" val="h264" label="H.264" />
                      <Radio k="encoding" val="h265" label="H.265" />
                    </div>
                  </div>
                </div>

                {/* Local Device Name / Device Channel */}
                <div style={bigRow}>
                  <div style={card}>
                    <div style={head}>Local Device Name</div>
                    <div style={body}><Inp k="deviceName" /></div>
                  </div>
                  <div style={card}>
                    <div style={head}>Device Channel (Camera ID)</div>
                    <div style={body}><Inp k="deviceChannel" /></div>
                  </div>
                </div>

                {/* Receive Group */}
                <div style={bigRow}>
                  <div style={card}>
                    <div style={head}>Receive Group</div>
                    <div style={body}><Inp k="receiveGroup" /></div>
                  </div>
                </div>

                {/* Reliable UDP */}
                <div style={bigRow}>
                  <Check k="reliableUdp" label="Reliable UDP" />
                </div>

                {/* Discovery Server */}
                <div style={bigRow}>
                  <Check k="discoveryServer" label="Discovery Server" />
                  <div style={card}>
                    <div style={head}>Discovery Server Address</div>
                    <div style={body}><Inp k="discoveryAddr" /></div>
                  </div>
                </div>

                {/* Multicast Server + Mask */}
                <div style={bigRow}>
                  <Check k="multicastServer" label="Multicast Server" />
                  <div style={card}>
                    <div style={head}>Multicast Server Mask</div>
                    <div style={body}><Inp k="multicastMask" /></div>
                  </div>
                </div>

                {/* Multicast Address / TTL / Confirm-Cancel */}
                <div style={bigRow}>
                  <div style={card}>
                    <div style={head}>Multicast Server Address</div>
                    <div style={body}><Inp k="multicastAddr" /></div>
                  </div>
                  <div style={card}>
                    <div style={head}>Multicast TTL</div>
                    <div style={body}><Inp k="multicastTtl" w={colW(3)} /></div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignSelf: "flex-end", paddingBottom: 2 }}>
                    <Btn>Confirm</Btn><Btn>Cancel</Btn>
                  </div>
                </div>

                {/* NDI Bridge */}
                <div style={{ ...bigRow, borderBottom: "none" }}>
                  <Check k="ndiBridge" label="NDI Bridge" extra={<span style={{ width: 12, height: 12, borderRadius: "50%", background: "#e0322f", display: "inline-block" }} />} />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: SP[3], flex: 1, minWidth: 0 }}>
                    <div style={card}>
                      <div style={head}>NDI Bridge IP Address</div>
                      <div style={body}><Inp k="bridgeIp" /></div>
                    </div>
                    <div style={card}>
                      <div style={head}>NDI Bridge Name</div>
                      <div style={body}><Inp k="bridgeName" /></div>
                    </div>
                    <div style={card}>
                      <div style={head}>NDI Bridge Port</div>
                      <div style={body}><Inp k="bridgePort" w={colW(4)} /></div>
                    </div>
                    <div style={card}>
                      <div style={head}>NDI Bridge Encryption Key</div>
                      <div style={body}><Inp k="bridgeKey" /></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : activeMenu === "tracking" ? (
          (() => {
            const TRK_TABS = [["presenter", "Presenter"], ["zone", "Zone"], ["hybrid", "Hybrid"], ["framing", "Framing"], ["gesture", "Gesture"], ["face", "Face Enrollment"]];
            const sec = { border: `1px solid ${T.line}`, borderRadius: 6, padding: "8px 10px", background: "rgba(0,0,0,0.12)", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 6 };
            const secTitle = { fontSize: 12.5, color: T.dim, fontWeight: 600, marginBottom: 2 };
            const sel = { boxSizing: "border-box", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 4, color: T.text, fontSize: 13, padding: "5px 8px", fontFamily: fUI, width: "100%" };
            const desc = { fontSize: 11.5, color: T.faint, lineHeight: 1.55 };
            const arrowBtn = { width: 44, height: 44, borderRadius: 8, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
            const secondaryBtn = { padding: "7px 16px", fontSize: 13, cursor: "pointer", borderRadius: 5, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI, whiteSpace: "nowrap" };
            const primaryBtn = { ...secondaryBtn, border: "none", background: T.blue, color: "#fff", fontWeight: 600 };
            const faceFocusCandidate = FACE_ENROLLMENT_CANDIDATES.find((candidate) => candidate.id === faceSelectFlow.candidateId);
            const faceSelectIsFocused = Boolean(faceFocusCandidate && !["ready", "restoring"].includes(faceSelectFlow.stage));
            const faceSelectZoom = faceFocusCandidate ? Math.max(1.4, Math.min(2.25, 290 / faceFocusCandidate.crop.size)) : 1;
            const faceSelectCenterX = faceFocusCandidate ? ((faceFocusCandidate.crop.x + faceFocusCandidate.crop.size / 2) / FACE_ENROLLMENT_DEMO_SIZE.width) * 100 : 50;
            const faceSelectCenterY = faceFocusCandidate ? ((faceFocusCandidate.crop.y + faceFocusCandidate.crop.size / 2) / FACE_ENROLLMENT_DEMO_SIZE.height) * 100 : 50;
            const faceSelectOrigin = faceFocusCandidate
              ? `${faceSelectCenterX}% ${faceSelectCenterY}%`
              : "50% 50%";
            const clampFaceSelectOffset = (desired, center) => {
              const zoomOverflow = faceSelectZoom - 1;
              const minimum = -(100 - center) * zoomOverflow;
              const maximum = center * zoomOverflow;
              return Math.max(minimum, Math.min(maximum, desired));
            };
            const faceSelectPan = faceFocusCandidate ? clampFaceSelectOffset(50 - faceSelectCenterX, faceSelectCenterX) : 0;
            const faceSelectTilt = faceFocusCandidate ? clampFaceSelectOffset(50 - faceSelectCenterY, faceSelectCenterY) : 0;
            const faceSelectFocusedTransform = `translate(${faceSelectPan}%, ${faceSelectTilt}%) scale(${faceSelectZoom})`;
            const faceSelectStageLabel = {
              initializing: "正在偵測人臉...",
              zooming: "正在置中臉部...",
              capturing: "正在擷取人臉...",
              saving: "正在新增人臉...",
              restoring: "已新增人臉",
            }[faceSelectFlow.stage];
            const faceSelectFrameLabel = {
              zooming: "置中",
              capturing: "Capturing",
              saving: "Updating",
              restoring: "Restoring",
            }[faceSelectFlow.stage];
            const eligibleFaceCandidates = FACE_ENROLLMENT_CANDIDATES.filter((candidate) => candidate.status === "eligible");
            const ptzIsWide = ptz.zoom <= 1.001;
            const ptzMoveButtonStyle = { ...arrowBtn, opacity: ptzIsWide ? 0.38 : 1, cursor: ptzIsWide ? "not-allowed" : "pointer" };
            const ptzHomeDisabled = ptzIsWide && Math.abs(ptz.pan) < 0.01 && Math.abs(ptz.tilt) < 0.01;
            const ptzHomeButtonStyle = { ...arrowBtn, fontSize: 15, opacity: ptzHomeDisabled ? 0.38 : 1, cursor: ptzHomeDisabled ? "not-allowed" : "pointer" };
            const TrkCheck = ({ stateKey, label, disabled = false, badge }) => (
              <button type="button" disabled={disabled} onClick={() => updTrk(stateKey, !trk[stateKey])}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: 0, border: "none", background: "transparent", color: disabled ? T.faint : T.text, fontFamily: fUI, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer", textAlign: "left", opacity: disabled ? 0.5 : 1 }}>
                <span style={{ width: 16, height: 16, flexShrink: 0, borderRadius: 3, border: `1.5px solid ${trk[stateKey] ? T.blue : T.line2}`, background: trk[stateKey] ? T.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }}>{trk[stateKey] && "✓"}</span>
                <span>{label}</span>
                {badge && <span style={{ fontSize: 9.5, fontWeight: 700, color: "#fff", background: T.amber, borderRadius: 3, padding: "1px 5px" }}>{badge}</span>}
              </button>
            );
            const TrkSlider = ({ label, stateKey, min, max }) => (
              <div style={sec}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={secTitle}>{label}</span><span style={{ fontFamily: fMono, color: T.blue, fontSize: 13 }}>{trk[stateKey]}</span></div>
                <input type="range" min={min} max={max} value={trk[stateKey]} onChange={(e) => updTrk(stateKey, parseInt(e.target.value))} className="tr-sl" style={{ "--p": ((trk[stateKey] - min) / (max - min)) * 100 + "%", width: "100%" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.faint }}><span>{min}</span><span>{max}</span></div>
              </div>
            );
            return (
              <div id="aver-tracking-wrapper" style={{ width: "min(1200px, 100%)", marginInline: "auto", height: "100%", minHeight: 0, overflow: "hidden", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 }}>
                {/* 上方:預覽 + 方向盤/Zoom + Save to Preset */}
                <div id="aver-trk-preview-row" style={{ flex: "1 1 0", minHeight: 0, display: "flex", gap: 10, alignItems: "stretch" }}>
                  <div id="aver-trk-preview-panel" style={{ flex: "1 1 0", minWidth: 0, position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${T.line}`, background: "#000", minHeight: 0 }}>
                    {trk.tab === "face" ? (
                      <svg id="aver-face-enrollment-live-view" viewBox={`0 0 ${FACE_ENROLLMENT_DEMO_SIZE.width} ${FACE_ENROLLMENT_DEMO_SIZE.height}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block", transform: faceSelectIsFocused ? faceSelectFocusedTransform : `translate(${ptz.pan}%, ${ptz.tilt}%) scale(${ptz.zoom})`, transformOrigin: faceSelectIsFocused ? faceSelectOrigin : "50% 50%", transition: "transform 1.2s cubic-bezier(0.45, 0, 0.55, 1), transform-origin 1.2s cubic-bezier(0.45, 0, 0.55, 1)" }}>
                        <image href={FACE_ENROLLMENT_DEMO_IMAGE} x="0" y="0" width={FACE_ENROLLMENT_DEMO_SIZE.width} height={FACE_ENROLLMENT_DEMO_SIZE.height} preserveAspectRatio="none" />
                        {trk.faceCaptureState === "complete" && FACE_ENROLLMENT_CANDIDATES.map((candidate) => {
                          const isSelected = faceSelectFlow.candidateId === candidate.id;
                          const hideDuringFocus = faceSelectIsFocused && !isSelected;
                          if (hideDuringFocus) return null;
                          const isValidSelectFace = candidate.status === "eligible";
                          const libraryFull = trk.enrolledFaces.length >= 20;
                          const blockedByLibraryFull = libraryFull && isValidSelectFace;
                          const isSelectable = isValidSelectFace && faceSelectFlow.stage === "ready" && !libraryFull;
                          const opensLibraryFullDialog = blockedByLibraryFull && faceSelectFlow.stage === "ready";
                          const opensEnrollmentGuide = !isValidSelectFace;
                          const isInteractiveFaceFrame = isSelectable || opensLibraryFullDialog || opensEnrollmentGuide;
                          const isHovered = isInteractiveFaceFrame && hoveredFaceCandidateId === candidate.id;
                          const shouldPulse = isSelectable && faceSelectCoachmarkVisible;
                          const color = isValidSelectFace ? isHovered ? "#49b7ff" : T.blue : isHovered ? "#ff6666" : "#e24b4b";
                          const label = isValidSelectFace ? "Selectable face" : candidate.label;
                          const actionLabel = "Add Face";
                          const { x, y, size } = candidate.crop;
                          return (
                            <g
                              key={candidate.id}
                              id={`aver-face-box-${candidate.id}`}
                              role={isInteractiveFaceFrame ? "button" : undefined}
                              tabIndex={isInteractiveFaceFrame ? 0 : undefined}
                              aria-label={isValidSelectFace ? `${label}: ${candidate.id}` : "Face cannot be added. Open face enrollment guide."}
                              onClick={() => {
                                if (isSelectable) startFaceAdd(candidate.id);
                                else if (opensLibraryFullDialog) setFaceLibraryFullDialogOpen(true);
                                else if (opensEnrollmentGuide) setFaceEnrollmentTourOpen(true);
                              }}
                              onKeyDown={(event) => {
                                if (isInteractiveFaceFrame && (event.key === "Enter" || event.key === " ")) {
                                  event.preventDefault();
                                  if (isSelectable) startFaceAdd(candidate.id);
                                  else if (opensLibraryFullDialog) setFaceLibraryFullDialogOpen(true);
                                  else setFaceEnrollmentTourOpen(true);
                                }
                              }}
                              onMouseEnter={() => isInteractiveFaceFrame && setHoveredFaceCandidateId(candidate.id)}
                              onMouseLeave={() => setHoveredFaceCandidateId((current) => current === candidate.id ? null : current)}
                              onFocus={() => isInteractiveFaceFrame && setHoveredFaceCandidateId(candidate.id)}
                              onBlur={() => setHoveredFaceCandidateId((current) => current === candidate.id ? null : current)}
                              style={{ cursor: isInteractiveFaceFrame ? "pointer" : "default", pointerEvents: "all", opacity: faceSelectFlow.stage === "restoring" && isSelected ? 0.7 : 1, filter: isHovered ? `drop-shadow(0 0 8px ${isValidSelectFace ? "rgba(30,155,240,0.9)" : "rgba(255,82,82,0.9)"})` : "none", transition: "filter 160ms ease" }}
                            >
                              {shouldPulse && <rect className="aver-face-select-pulse" x={x - 7} y={y - 7} width={size + 14} height={size + 14} fill="none" stroke={T.blue} vectorEffect="non-scaling-stroke" />}
                              <rect x={x} y={y} width={size} height={size} fill={isHovered ? isValidSelectFace ? "rgba(23,145,236,0.13)" : "rgba(226,75,75,0.12)" : "rgba(23,145,236,0.001)"} stroke={color} strokeWidth={isHovered ? "8" : "5"} vectorEffect="non-scaling-stroke" />
                              {false && isSelectable && (
                                <g
                                  id={`aver-face-add-face-${candidate.id}`}
                                  role="button"
                                  tabIndex="0"
                                  aria-label={`${actionLabel}: ${candidate.id}`}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    startFaceAdd(candidate.id);
                                  }}
                                  onFocus={() => setHoveredFaceCandidateId(candidate.id)}
                                  onBlur={() => setHoveredFaceCandidateId((current) => current === candidate.id ? null : current)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      startFaceAdd(candidate.id);
                                    }
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <rect x={x} y={y + size - 30} width={size} height="30" fill="rgba(5,10,15,0.88)" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                  <text x={x + size / 2} y={y + size - 9} textAnchor="middle" fill="#fff" fontSize="17" fontWeight="700" fontFamily={fUI}>◎ {actionLabel}</text>
                                </g>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    ) : (
                      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(meeting_room.png)", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center", transform: `translate(${ptz.pan}%, ${ptz.tilt}%) scale(${ptz.zoom * 1.65})`, transition: "transform 0.1s ease-out" }} />
                    )}
                    {trk.tab === "face" && ((trk.faceCaptureState === "complete" && faceSelectFlow.stage === "ready") || faceSelectFlow.stage === "capturing" || faceSelectFlow.stage === "saving") && (
                      <div
                        id="aver-face-frozen-frame-state"
                        role="status"
                        aria-live="polite"
                        style={{ position: "absolute", top: 12, left: 12, zIndex: 4, minHeight: 26, padding: "0 8px", display: "flex", alignItems: "center", gap: 6, borderRadius: 5, border: `1px solid ${T.line2}`, background: "rgba(8,11,15,0.88)", boxShadow: "0 4px 14px rgba(0,0,0,0.32)", color: "#fff", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.2, pointerEvents: "none" }}
                      >
                        <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: T.faint }} />
                        <span>FROZEN FRAME</span>
                      </div>
                    )}
                    {false && (
                      <div id="aver-face-select-coachmark" role="status" aria-live="polite" style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 4, minHeight: 36, maxWidth: "calc(100% - 28px)", boxSizing: "border-box", padding: "7px 9px 7px 12px", display: "flex", alignItems: "center", gap: 8, borderRadius: 7, border: "1px solid rgba(30,155,240,0.58)", background: "rgba(8,12,17,0.92)", color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.38)", fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>
                        <span aria-hidden="true" style={{ color: T.blue, fontSize: 16, lineHeight: 1 }}>☝</span>
                        <button id="aver-face-select-coachmark-dismiss-button" type="button" aria-label="Dismiss face selection tip" onClick={() => { setFaceSelectCoachmarkVisible(false); setFaceSelectCoachmarkDismissed(true); }} style={{ width: 22, height: 22, padding: 0, marginLeft: 2, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 4, border: "none", background: "transparent", color: T.dim, fontFamily: fUI, fontSize: 16, cursor: "pointer" }}>×</button>
                      </div>
                    )}
                    {trk.tab === "face" && trk.faceCaptureState === "loading" && (
                      <div id="aver-face-enrollment-loading" role="status" aria-live="polite" style={{ position: "absolute", inset: 0, background: "rgba(5,7,9,0.68)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#fff", zIndex: 2 }}>
                        <span className="aver-spinner" aria-hidden="true" style={{ width: 34, height: 34, boxSizing: "border-box", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.26)", borderTopColor: T.blue }} />
                        <span style={{ fontSize: 14, fontWeight: 600 }}>Detecting faces...</span>
                      </div>
                    )}
                    {trk.tab === "face" && faceSelectStageLabel && (
                      <div id="aver-face-recapture-progress" role="status" aria-live="polite" style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 6, background: "rgba(8,10,13,0.88)", border: `1px solid ${T.line2}`, color: "#fff", fontSize: 12.5, fontWeight: 600, zIndex: 3, pointerEvents: "none" }}>
                        {faceSelectFlow.stage !== "restoring" && <span className="aver-spinner" aria-hidden="true" style={{ width: 15, height: 15, boxSizing: "border-box", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.25)", borderTopColor: T.blue }} />}
                        {faceSelectStageLabel}
                      </div>
                    )}
                  </div>
                  <div id="aver-trk-ptz-control-panel" style={{ flexShrink: 0, alignSelf: "flex-start", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, padding: 16 }}>
                    <div style={{ display: "flex", gap: 14 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "44px 44px 44px", gridTemplateRows: "44px 44px 44px", gap: 6, justifyContent: "center" }}>
                        <div /><button id="aver-ptz-up-button" type="button" aria-label="Tilt up" disabled={ptzIsWide} onClick={() => handlePtz("up")} style={ptzMoveButtonStyle}>▲</button><div />
                        <button id="aver-ptz-left-button" type="button" aria-label="Pan left" disabled={ptzIsWide} onClick={() => handlePtz("left")} style={ptzMoveButtonStyle}>◀</button><button id="aver-ptz-home-button" type="button" aria-label="Reset PTZ view" disabled={ptzHomeDisabled} onClick={() => handlePtz("home")} style={ptzHomeButtonStyle}>⌂</button><button id="aver-ptz-right-button" type="button" aria-label="Pan right" disabled={ptzIsWide} onClick={() => handlePtz("right")} style={ptzMoveButtonStyle}>▶</button>
                        <div /><button id="aver-ptz-down-button" type="button" aria-label="Tilt down" disabled={ptzIsWide} onClick={() => handlePtz("down")} style={ptzMoveButtonStyle}>▼</button><div />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, justifyContent: "center" }}>
                        <span style={{ fontSize: 12, color: T.dim }}>Zoom</span>
                        <button id="aver-ptz-zoom-in-button" type="button" aria-label="Zoom in" disabled={ptz.zoom >= 3} onClick={() => handlePtz("zoom_in")} style={{ ...arrowBtn, opacity: ptz.zoom >= 3 ? 0.38 : 1, cursor: ptz.zoom >= 3 ? "not-allowed" : "pointer" }}>＋</button>
                        <button id="aver-ptz-zoom-out-button" type="button" aria-label="Zoom out" disabled={ptzIsWide} onClick={() => handlePtz("zoom_out")} style={ptzMoveButtonStyle}>－</button>
                      </div>
                    </div>
                    <button id="aver-save-preset-button" style={{ padding: "10px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer", borderRadius: 6, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI }}>Save to Preset 1</button>
                    {trk.tab === "face" && (
                      <div id="aver-ptz-face-enrollment-section" style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 10, borderTop: `1px solid ${T.line}` }}>
                        <div id="aver-ptz-face-enrollment-header" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div id="aver-ptz-face-enrollment-title" style={{ fontSize: 12, fontWeight: 600, color: T.dim }}>Face Enrollment</div>
                          <button
                            id="aver-face-enrollment-information-button"
                            type="button"
                            aria-label="Open face enrollment guide"
                            title="Face enrollment guide"
                            onClick={() => setFaceEnrollmentTourOpen(true)}
                            style={{ width: 18, height: 18, padding: 0, borderRadius: "50%", border: `1px solid ${T.faint}`, background: "transparent", color: T.dim, fontFamily: fUI, fontSize: 11, fontWeight: 700, lineHeight: 1, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                          >i</button>
                        </div>
                        <button
                          id={trk.faceCaptureState === "complete" ? "aver-face-resume-live-button" : "aver-face-detect-button"}
                          onClick={trk.faceCaptureState === "complete" ? resumeFaceEnrollmentLiveView : startFaceBatchEnrollment}
                          disabled={trk.faceCaptureState === "loading" || faceSelectFlow.stage !== "ready"}
                          style={{ ...primaryBtn, width: "100%", padding: "8px 8px", opacity: trk.faceCaptureState === "loading" || faceSelectFlow.stage !== "ready" ? 0.48 : 1, cursor: trk.faceCaptureState === "loading" || faceSelectFlow.stage !== "ready" ? "not-allowed" : "pointer" }}
                        >
                          {trk.faceCaptureState === "complete" ? "Resume Live" : "Detect Faces"}
                        </button>
                        {trk.faceCaptureState === "complete" && (
                          <button
                            id="aver-face-add-all-eligible-button"
                            type="button"
                            onClick={addAllEligibleFaces}
                            disabled={faceSelectFlow.stage !== "ready" || eligibleFaceCandidates.length === 0}
                            style={{ ...secondaryBtn, width: "100%", padding: "8px 8px", opacity: faceSelectFlow.stage !== "ready" || eligibleFaceCandidates.length === 0 ? 0.48 : 1, cursor: faceSelectFlow.stage !== "ready" || eligibleFaceCandidates.length === 0 ? "not-allowed" : "pointer" }}
                          >
                            Add All Faces
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tab 列 + 內容(版面同 Camera Settings:邊框面板 + 固定寬藍底分頁 + 分隔線) */}
                <div id="aver-trk-control-panel" style={{ width: "min(1200px, 100%)", flex: "0 0 350px", height: 350, minHeight: 0, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {/* 分頁列 */}
                  <div id="aver-trk-tab-bar" style={{ display: "flex", borderBottom: `1px solid ${T.line}` }}>
                    {TRK_TABS.map(([id, lb]) => (
                      <button key={id} id={`aver-trk-tab-${id}`} onClick={() => updTrk("tab", id)}
                        style={{ flex: "1 1 0", minWidth: 0, padding: "9px 6px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", border: "none", background: trk.tab === id ? T.blue : "transparent", color: trk.tab === id ? "#fff" : T.dim, fontFamily: fUI, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, whiteSpace: "nowrap" }}>
                        {lb}{id === "gesture" && <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: T.amber, borderRadius: 3, padding: "1px 5px" }}>Beta</span>}
                      </button>
                    ))}
                  </div>

                  {/* 分頁內容 */}
                  <div id="aver-trk-tab-content" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 8 }}>
                {trk.tab === "presenter" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, alignItems: "start" }}>
                    {/* 第 1 欄 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={sec}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span style={secTitle}>Tracking Sensitivity</span><span style={{ fontFamily: fMono, color: T.blue, fontSize: 13 }}>{trk.sensitivity}</span></div>
                        <input type="range" min={1} max={3} value={trk.sensitivity} onChange={(e) => updTrk("sensitivity", parseInt(e.target.value))} className="tr-sl" style={{ "--p": ((trk.sensitivity - 1) / 2) * 100 + "%", width: "100%" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.faint }}><span>1</span><span>3</span></div>
                      </div>
                      <div style={sec}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span style={secTitle}>Time of Return to Tracking Point</span><span style={{ fontFamily: fMono, color: T.blue, fontSize: 13 }}>{trk.returnTime}</span></div>
                        <input type="range" min={3} max={10} value={trk.returnTime} onChange={(e) => updTrk("returnTime", parseInt(e.target.value))} className="tr-sl" style={{ "--p": ((trk.returnTime - 3) / 7) * 100 + "%", width: "100%" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.faint }}><span>3</span><span>10</span></div>
                      </div>
                      <div style={sec}>
                        <TrkCheck stateKey="multiPresenterTracking" label="Multi-Presenter Tracking" badge="Beta" />
                      </div>
                      <div style={sec}>
                        <div onClick={() => updTrk("effectiveArea", !trk.effectiveArea)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${trk.effectiveArea ? T.blue : T.line2}`, background: trk.effectiveArea ? T.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }}>{trk.effectiveArea && "✓"}</span>
                            <span style={{ fontSize: 13, color: T.text }}>Effective Tracking Area</span>
                          </span>
                          <button style={{ padding: "5px 14px", fontSize: 12.5, cursor: "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI }}>Set</button>
                        </div>
                      </div>
                    </div>

                    {/* 第 2 欄 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={sec}>
                        <span style={secTitle}>Tracking Point</span>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <input value={trk.presetPoint} onChange={(e) => updTrk("presetPoint", e.target.value)} style={{ ...sel, flex: 1 }} />
                          <button style={{ padding: "7px 16px", fontSize: 13, cursor: "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI }}>Save</button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>
                          <div><div style={{ ...secTitle, marginBottom: 4 }}>People Size</div>
                            <select value={trk.peopleSize} onChange={(e) => updTrk("peopleSize", e.target.value)} style={sel}><option>Upper Body</option><option>Full Body</option><option>Close Up</option></select>
                          </div>
                          <div><div style={{ ...secTitle, marginBottom: 4 }}>Placement</div>
                            <select value={trk.placement} onChange={(e) => updTrk("placement", e.target.value)} style={sel}><option>Center</option><option>Left</option><option>Right</option></select>
                          </div>
                          <div><div style={{ ...secTitle, marginBottom: 4 }}>Height</div>
                            <select value={trk.height} onChange={(e) => updTrk("height", e.target.value)} style={sel}><option>Height1</option><option>Height2</option><option>Height3</option></select>
                          </div>
                        </div>
                      </div>
                      <div style={sec}>
                        <div style={{ display: "flex", gap: 24 }}>
                          <TrkCheck stateKey="autoZoom" label="Auto Zoom" />
                          <TrkCheck stateKey="autoTilt" label="Auto Tilt" />
                        </div>
                        <div style={desc}>When Auto Zoom is off, camera stops zooming in/out automatically and shoots the presenter according to the shot size of the preset you choose.</div>
                        <select value={trk.autoZoomPreset} onChange={(e) => updTrk("autoZoomPreset", e.target.value)} style={sel}><option>Preset 1</option><option>Preset 2</option><option>Preset 3</option></select>
                      </div>
                    </div>

                    {/* 第 3 欄 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={sec}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, ...secTitle }}>Multi-Presenter Detection <span style={{ color: T.faint, fontSize: 11 }}>ⓘ</span></span>
                        <div style={desc}>When two or more people appear, the camera moves to the “Multi-Person Preset Point” to include everyone. Select a preset point wide enough to cover the scene.</div>
                        <select value={trk.multiPresenter} onChange={(e) => updTrk("multiPresenter", e.target.value)} style={sel}><option value="off">Off</option><option value="preset1">Preset 1</option><option value="preset2">Preset 2</option></select>
                      </div>
                      <div style={sec}>
                        <div style={secTitle}>Set Shield Zone</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => updTrk("shieldZone", true)} style={{ ...primaryBtn, flex: 1 }}>Set</button>
                          <button onClick={() => updTrk("shieldZone", false)} style={{ ...secondaryBtn, flex: 1 }}>Clear</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : trk.tab === "zone" ? (
                  <div id="aver-tracking-zone-panel" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: SP[3], alignItems: "start" }}>
                    <div id="aver-tracking-zone-sliders-column" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <TrkSlider label="Tracking Sensitivity" stateKey="sensitivity" min={1} max={3} />
                      <TrkSlider label="Time of Return to Tracking Point" stateKey="returnTime" min={3} max={10} />
                    </div>
                    <div id="aver-tracking-zone-point" style={sec}>
                      <span style={secTitle}>Tracking Point</span>
                      <select id="aver-tracking-zone-point-select" value={trk.zoneTrackingPoint} onChange={(e) => updTrk("zoneTrackingPoint", e.target.value)} style={sel}>
                        {Array.from({ length: 10 }, (_, index) => <option key={index}>{`Preset ${index}`}</option>)}
                      </select>
                    </div>
                  </div>
                ) : trk.tab === "hybrid" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3], alignItems: "start" }}>
                    <div style={sec}>
                      <span style={secTitle}>Tracking Priority</span>
                      <select value={trk.hybridPriority} onChange={(e) => updTrk("hybridPriority", e.target.value)} style={sel}>
                        <option>Presenter</option><option>Zone</option><option>Last Active Target</option>
                      </select>
                      <div style={desc}>Choose which signal takes priority when presenter and zone tracking are both available.</div>
                    </div>
                    <div style={sec}>
                      <span style={secTitle}>Fallback Position</span>
                      <select value={trk.hybridFallback} onChange={(e) => updTrk("hybridFallback", e.target.value)} style={sel}>
                        <option>Zone 1</option><option>Zone 2</option><option>Preset 1</option><option>Tracking Point</option>
                      </select>
                      <div style={desc}>The camera returns here after the active presenter leaves the frame.</div>
                    </div>
                    <TrkSlider label="Target Hold Time" stateKey="hybridHoldTime" min={1} max={10} />
                  </div>
                ) : trk.tab === "framing" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3], alignItems: "start" }}>
                    <div style={sec}>
                      <span style={secTitle}>Framing Mode</span>
                      <select value={trk.framingMode} onChange={(e) => updTrk("framingMode", e.target.value)} style={sel}>
                        <option>Auto Framing</option><option>Single Person</option><option>Group</option>
                      </select>
                      <TrkCheck stateKey="groupFraming" label="Include everyone in frame" />
                    </div>
                    <div style={sec}>
                      <span style={secTitle}>Target Size</span>
                      <select value={trk.framingSize} onChange={(e) => updTrk("framingSize", e.target.value)} style={sel}>
                        <option>Close</option><option>Medium</option><option>Wide</option>
                      </select>
                      <div style={desc}>Controls the amount of headroom and surrounding context kept around detected people.</div>
                    </div>
                    <TrkSlider label="Framing Speed" stateKey="framingSpeed" min={1} max={10} />
                  </div>
                ) : trk.tab === "gesture" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3], alignItems: "start" }}>
                    <div style={sec}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={secTitle}>Gesture Control</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: T.amber, borderRadius: 3, padding: "2px 6px" }}>Beta</span>
                      </div>
                      <TrkCheck stateKey="gestureEnabled" label="Enable gesture commands" />
                      <div style={desc}>Allow supported hand gestures to start or stop tracking without using the web interface.</div>
                    </div>
                    <TrkSlider label="Gesture Confirmation Time" stateKey="gestureTimeout" min={2} max={10} />
                    <div style={sec}>
                      <TrkCheck stateKey="gestureFeedback" label="Show recognition feedback" disabled={!trk.gestureEnabled} />
                      <div style={desc}>A temporary status indicator appears in Live View when a gesture is recognized.</div>
                    </div>
                  </div>
                ) : (
                  <>
                  <div id="aver-face-enrollment" style={{ height: "100%", minHeight: 0, display: "flex" }}>
                    <div id="aver-face-enrollment-action-panel" aria-hidden="true" style={{ display: "none" }}>
                      <div id="aver-face-enrollment-action-header" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>Face Enrollment</span>
                        <button
                          id="aver-face-enrollment-information-button-legacy"
                          type="button"
                          aria-label="Open face enrollment guide"
                          title="Face enrollment guide"
                          onClick={() => setFaceEnrollmentTourOpen(true)}
                          style={{ width: 18, height: 18, padding: 0, borderRadius: "50%", border: `1px solid ${T.faint}`, background: "transparent", color: T.dim, fontFamily: fUI, fontSize: 11, fontWeight: 700, lineHeight: 1, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        >i</button>
                      </div>
                      <div id="aver-face-add-face-hint" style={{ display: "flex", alignItems: "flex-start", gap: 7, padding: "8px 9px", borderRadius: 5, border: `1px solid ${T.line}`, background: "#111419", color: T.dim, fontSize: 11.5, lineHeight: 1.4 }}>
                        <span aria-hidden="true" style={{ color: T.blue, fontWeight: 700 }}>◎</span>
                        <span>
                          {trk.faceCaptureState === "complete"
                            ? "Use Add Face on a blue frame for a closer capture."
                            : trk.faceCaptureState === "loading"
                              ? "Capturing a frozen frame and detecting eligible faces…"
                              : "Click Detect Faces to find eligible faces."}
                        </span>
                      </div>
                    </div>
                    <div id="aver-enrolled-face-panel" style={{ flex: "1 1 0", minWidth: 0, minHeight: 0, padding: 4, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div id="aver-face-enrollment-header" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                          <span id="aver-enrolled-face-count" style={{ fontSize: 16, fontWeight: 500, color: T.text, whiteSpace: "nowrap" }}>Enrolled Face ({trk.enrolledFaces.length}/20)</span>
                          {trk.enrolledFaces.length > 1 && <span id="aver-enrolled-face-management-hint" style={{ fontSize: 11.5, color: T.faint }}>Drag cards to reorder</span>}
                          {trk.enrolledFaces.length >= 20 && (
                            <span id="aver-enrolled-face-library-full-status" role="status" style={{ padding: "3px 7px", borderRadius: 4, border: "1px solid rgba(245,166,35,0.42)", background: "rgba(245,166,35,0.10)", color: "#f5b74f", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                              Face library is full
                            </span>
                          )}
                        </div>
                      </div>
                      {trk.enrolledFaces.length === 0 ? (
                        <div id="aver-face-enrollment-empty-state" style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 9 }}>
                          <div id="aver-face-enrollment-empty-icon" aria-label="No enrolled faces" style={{ width: 78, height: 78, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)" }}>
                            <span aria-hidden="true" style={{ color: T.faint, fontSize: 9, fontWeight: 600, letterSpacing: "0.06em" }}>ICON</span>
                          </div>
                          <span style={{ fontSize: 12, color: T.faint }}>No faces enrolled yet</span>
                        </div>
                      ) : (
                        <div
                          id="aver-enrolled-face-list"
                          aria-label="Enrolled face list"
                          style={{
                            flex: 1,
                            minHeight: 0,
                            overflowY: "auto",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, 104px)",
                            gridAutoRows: "126px",
                            alignContent: "start",
                            justifyContent: "start",
                            gap: 0,
                            paddingTop: 2,
                          }}
                        >
                          {Array.from({ length: 20 }, (_, index) => {
                            const face = trk.enrolledFaces[index];
                            const order = String(index + 1).padStart(2, "0");
                            const slotStyle = {
                              width: 104,
                              height: 126,
                              position: "relative",
                              boxSizing: "border-box",
                              padding: "5px 7px 8px 5px",
                              borderRight: "1px dashed rgba(93,108,124,0.20)",
                              borderBottom: "1px dashed rgba(93,108,124,0.20)",
                            };
                            const slotPlaceholder = (
                              <span
                                aria-hidden="true"
                                style={{ position: "absolute", inset: "5px 7px 8px 5px", borderRadius: 6, border: "1px solid rgba(93,108,124,0.22)", background: "rgba(6,8,11,0.13)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.012)", pointerEvents: "none" }}
                              />
                            );
                            if (!face) {
                              return (
                                <div key={`empty-face-slot-${order}`} id={`aver-enrolled-face-slot-${order}`} style={slotStyle}>
                                  {slotPlaceholder}
                                </div>
                              );
                            }
                            const isDragging = draggedFaceId === face.id;
                            const isEditing = editingFaceId === face.id;
                            return <div key={face.id} id={`aver-enrolled-face-slot-${order}`} style={slotStyle}>
                              {slotPlaceholder}
                              <div
                              id={`aver-enrolled-face-card-${order}`}
                              data-face-id={face.id}
                              draggable={false}
                              onPointerDown={(event) => !isEditing && startFacePointerDrag(event, face.id)}
                              onPointerMove={moveFacePointerDrag}
                              onPointerUp={finishFacePointerDrag}
                              onPointerCancel={finishFacePointerDrag}
                              style={{ position: "relative", zIndex: 1, width: 92, minWidth: 92, height: 113, display: "flex", flexDirection: "column", padding: 0, margin: 0, overflow: "hidden", boxSizing: "border-box", border: `1px solid ${isEditing ? T.blue : T.line2}`, borderRadius: 6, background: isEditing ? "rgba(30,155,240,0.10)" : isDragging ? "rgba(30,155,240,0.05)" : T.panel, outline: isDragging ? "1px dashed rgba(30,155,240,0.65)" : "none", opacity: isDragging ? 0.18 : 1, cursor: isDragging ? "grabbing" : isEditing ? "text" : "grab", touchAction: isEditing ? "auto" : "none", userSelect: "none", transition: "opacity 0.16s ease, background 0.16s ease, border-color 0.16s ease" }}
                            >
                              <div id={`aver-enrolled-face-photo-${order}`} aria-label={`Enrolled face ${index + 1}`} style={{ width: "100%", height: 92, flex: "0 0 92px", boxSizing: "border-box", position: "relative", overflow: "hidden", borderBottom: `1px solid ${isEditing ? T.blue : T.line2}`, backgroundColor: "rgba(23,145,236,0.12)" }}>
                                <FaceEnrollmentCrop candidateId={face.candidateId} label={`Face ${index + 1} photo${face.liveCapturedAt ? ", live capture" : ""}`} recaptured={Boolean(face.liveCapturedAt)} />
                                <span
                                  id={`aver-enrolled-face-priority-${order}`}
                                  aria-label={`Priority P${order}`}
                                  style={{ position: "absolute", top: 3, left: 3, minWidth: 31, height: 18, padding: "0 4px", boxSizing: "border-box", borderRadius: 3, border: "1px solid rgba(255,255,255,0.22)", background: "rgba(8,10,13,0.78)", color: "#fff", fontFamily: fUI, fontSize: 9.5, fontWeight: 700, lineHeight: "16px", cursor: "inherit", textAlign: "center", textShadow: "0 1px 3px #000", pointerEvents: "none" }}
                                >
                                  P{order}
                                </span>
                                <button
                                  id={`aver-enrolled-face-delete-${order}`}
                                  type="button"
                                  draggable={false}
                                  aria-label={`Delete face ${index + 1}`}
                                  onDragStart={(event) => event.preventDefault()}
                                  onClick={(event) => { event.stopPropagation(); setFaceDeleteTarget({ id: face.id, name: face.name, order: index + 1 }); }}
                                  style={{ position: "absolute", top: 3, right: 3, width: 18, height: 18, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 3, border: "1px solid rgba(255,255,255,0.26)", background: "rgba(8,10,13,0.82)", color: "#ff6b6b", fontFamily: fUI, fontSize: 14, lineHeight: 1, cursor: "pointer" }}
                                >×</button>
                              </div>
                              {isEditing ? (
                                <div id={`aver-enrolled-face-name-edit-state-${order}`} style={{ flex: 1, minHeight: 0 }}>
                                  <input
                                    id={`aver-enrolled-face-name-input-${order}`}
                                    aria-label={`Edit name for face ${index + 1}`}
                                    autoFocus
                                    value={editingFaceName}
                                    placeholder="Unnamed"
                                    onChange={(event) => setEditingFaceName(event.target.value)}
                                    onBlur={() => finishInlineFaceNameEdit(true)}
                                    onKeyDown={(event) => {
                                      if (event.key === "Enter") finishInlineFaceNameEdit(true);
                                      if (event.key === "Escape") finishInlineFaceNameEdit(false);
                                    }}
                                    style={{ width: "100%", height: 20, boxSizing: "border-box", padding: "1px 5px", borderRadius: 0, border: `1px solid ${T.blue}`, outline: "none", background: "#0f1216", color: T.text, fontFamily: fUI, fontSize: 11.5 }}
                                  />
                                </div>
                              ) : (
                                <button
                                  id={`aver-enrolled-face-name-${order}`}
                                  type="button"
                                  title="Click to rename"
                                  onClick={() => startInlineFaceNameEdit(face)}
                                  style={{ width: "100%", height: 20, minWidth: 0, padding: "1px 4px", boxSizing: "border-box", border: "none", borderRadius: 0, background: "transparent", color: face.name ? T.text : T.faint, fontFamily: fUI, fontSize: 12, lineHeight: 1.25, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "text" }}
                                >{face.name || "Unnamed"}</button>
                              )}
                              </div>
                            </div>;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {faceEnrollmentTourOpen && (
                    <div id="aver-face-enrollment-tour-modal" role="dialog" aria-modal="true" aria-labelledby="aver-face-enrollment-tour-title" style={{ position: "fixed", inset: 0, zIndex: 75, padding: 16, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div id="aver-face-enrollment-tour-dialog" style={{ width: "min(780px, calc(100vw - 32px))", maxHeight: "calc(100vh - 32px)", overflow: "hidden", borderRadius: 10, border: `1px solid ${T.line2}`, background: "#101216", boxShadow: "0 22px 64px rgba(0,0,0,0.58)", display: "flex", flexDirection: "column" }}>
                        <div id="aver-face-enrollment-tour-header" style={{ minHeight: 48, padding: "0 14px 0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.line2}` }}>
                          <div>
                            <div id="aver-face-enrollment-tour-title" style={{ color: T.text, fontSize: 16, fontWeight: 600 }}>Face Enrollment Guide</div>
                            <div style={{ marginTop: 2, color: T.faint, fontSize: 11.5 }}>Use a clear, front-facing image with enough face detail.</div>
                          </div>
                          <button id="aver-face-enrollment-tour-close-button" type="button" aria-label="Close face enrollment guide" onClick={() => setFaceEnrollmentTourOpen(false)} style={{ width: 30, height: 30, padding: 0, borderRadius: 5, border: "none", background: "transparent", color: T.dim, fontFamily: fUI, fontSize: 20, cursor: "pointer" }}>×</button>
                        </div>
                        <div id="aver-face-enrollment-tour-content" style={{ minHeight: 0, overflow: "hidden", padding: 14, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                          <div id="aver-face-enrollment-tour-face-too-small" style={{ minWidth: 0, padding: 10, borderRadius: 8, border: "1px solid rgba(239,83,80,0.30)", background: "rgba(239,83,80,0.05)" }}>
                            <div style={{ height: 110, padding: 8, boxSizing: "border-box", borderRadius: 6, background: "#090b0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 150, height: 90, position: "relative", overflow: "hidden" }}>
                                <svg role="img" aria-label="Face is too small in the frame" viewBox="430 -5 480 288" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
                                  <image href={FACE_ENROLLMENT_DEMO_IMAGE} x="0" y="0" width={FACE_ENROLLMENT_DEMO_SIZE.width} height={FACE_ENROLLMENT_DEMO_SIZE.height} preserveAspectRatio="none" />
                                  <rect x="592" y="105" width="132" height="145" fill="none" stroke="#ef5350" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                                </svg>
                              </div>
                            </div>
                            <div style={{ marginTop: 8, color: "#ef6c68", fontSize: 12.5, fontWeight: 700 }}>Face too small</div>
                            <div style={{ marginTop: 4, color: T.dim, fontSize: 11.5, lineHeight: 1.4 }}>Move closer or zoom in. The face must be large enough to capture clear facial detail.</div>
                          </div>
                          <div id="aver-face-enrollment-tour-face-blurred" style={{ minWidth: 0, padding: 10, borderRadius: 8, border: "1px solid rgba(239,83,80,0.30)", background: "rgba(239,83,80,0.05)" }}>
                            <div style={{ height: 110, padding: 8, boxSizing: "border-box", borderRadius: 6, background: "#090b0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 90, height: 90, position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", inset: 0, filter: "blur(1.4px)" }}><FaceEnrollmentCrop candidateId="blurred-distance" label="Blurred moving face" /></div>
                                <span aria-hidden="true" style={{ position: "absolute", inset: 5, border: "3px solid #ef5350", boxSizing: "border-box" }} />
                              </div>
                            </div>
                            <div style={{ marginTop: 8, color: "#ef6c68", fontSize: 12.5, fontWeight: 700 }}>Face is blurred</div>
                            <div style={{ marginTop: 4, color: T.dim, fontSize: 11.5, lineHeight: 1.4 }}>Keep the person and camera steady. Facial features must be sharp and clearly visible.</div>
                          </div>
                          <div id="aver-face-enrollment-tour-front-facing" style={{ minWidth: 0, padding: 10, borderRadius: 8, border: "1px solid rgba(30,155,240,0.32)", background: "rgba(30,155,240,0.06)" }}>
                            <div style={{ height: 110, padding: 8, boxSizing: "border-box", borderRadius: 6, background: "#090b0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 90, height: 90, position: "relative", overflow: "hidden" }}>
                                <FaceEnrollmentCrop candidateId="front-center" label="Front-facing person with both cheeks evenly visible" />
                                <span aria-hidden="true" style={{ position: "absolute", inset: 5, border: `3px solid ${T.blue}`, boxSizing: "border-box" }} />
                              </div>
                            </div>
                            <div style={{ marginTop: 8, color: T.blue, fontSize: 12.5, fontWeight: 700 }}>Face the camera</div>
                            <div style={{ marginTop: 4, color: T.dim, fontSize: 11.5, lineHeight: 1.4 }}>Look straight at the camera and keep the left and right cheeks evenly visible.</div>
                          </div>
                          <div id="aver-face-enrollment-tour-recapture" aria-hidden="true" style={{ display: "none" }}>
                            <div id="aver-face-enrollment-tour-recapture-example" aria-label="Select Add Face on the batch face to create another face record" style={{ width: "100%", minWidth: 0, height: 88, padding: 7, boxSizing: "border-box", borderRadius: 6, border: `1px solid ${T.line}`, background: "#090b0f", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                              <div style={{ width: 74, height: 74, position: "relative", overflow: "hidden", border: `2px solid ${T.blue}`, boxSizing: "border-box" }}>
                                <FaceEnrollmentCrop candidateId="front-center" label="Original batch capture" />
                                <span style={{ position: "absolute", left: 3, top: 3, padding: "2px 4px", borderRadius: 3, background: "rgba(8,10,13,0.78)", color: T.dim, fontSize: 8.5, fontWeight: 700 }}>BATCH</span>
                              </div>
                              <span aria-hidden="true" style={{ color: T.blue, fontSize: 20, fontWeight: 700 }}>→</span>
                              <div style={{ width: 74, height: 74, position: "relative", overflow: "hidden", border: `2px solid ${T.blue}`, boxSizing: "border-box" }}>
                                <FaceEnrollmentCrop candidateId="front-center" label="Closer PTZ live capture" recaptured />
                                <span style={{ position: "absolute", left: 3, top: 3, padding: "2px 4px", borderRadius: 3, background: "rgba(8,10,13,0.78)", color: "#fff", fontSize: 8.5, fontWeight: 700 }}>PTZ</span>
                              </div>
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ color: T.blue, fontSize: 13, fontWeight: 700 }}>Add Face</div>
                              <div style={{ marginTop: 4, color: T.dim, fontSize: 11.5, lineHeight: 1.4 }}>Select Add Face on a blue frame. The camera returns to Live View, centers and zooms to the person, then adds a new face record. The original batch record remains unchanged.</div>
                            </div>
                          </div>
                          <div id="aver-face-enrollment-tour-priority-order" style={{ gridColumn: "1 / -1", minWidth: 0, padding: 10, borderRadius: 8, border: `1px solid ${T.line2}`, background: "rgba(255,255,255,0.025)", display: "grid", gridTemplateColumns: "270px minmax(0, 1fr)", alignItems: "center", columnGap: 14 }}>
                            <div id="aver-face-enrollment-tour-priority-example" aria-label="Example of enrolled face cards ordered by priority" style={{ width: "100%", minWidth: 0, boxSizing: "border-box", padding: 7, borderRadius: 6, border: `1px solid ${T.line}`, background: "#171a1f" }}>
                              <div style={{ marginBottom: 5, color: T.text, fontSize: 11.5, fontWeight: 600 }}>Enrolled Face (3/20)</div>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                                {[
                                  { priority: "P01", candidateId: "front-left", name: "Emma" },
                                  { priority: "P02", candidateId: "front-center", name: "James" },
                                  { priority: "P03", candidateId: "front-right", name: "Sophia" },
                                ].map((card) => (
                                  <div key={card.priority} style={{ width: 76, minWidth: 0 }}>
                                    <div style={{ width: 76, height: 70, position: "relative", overflow: "hidden", border: `1px solid ${T.line2}`, boxSizing: "border-box", background: "rgba(23,145,236,0.12)" }}>
                                      <FaceEnrollmentCrop candidateId={card.candidateId} label={`${card.name}, ${card.priority}`} />
                                      <span style={{ position: "absolute", top: 3, left: 3, padding: "2px 4px", borderRadius: 3, border: "1px solid rgba(255,255,255,0.22)", background: "rgba(8,10,13,0.78)", color: "#fff", fontSize: 9, fontWeight: 700, lineHeight: 1 }}>{card.priority}</span>
                                      <span aria-hidden="true" style={{ position: "absolute", top: 3, right: 3, width: 14, height: 14, borderRadius: 2, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(8,10,13,0.82)", color: "#ff6b6b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, lineHeight: 1 }}>×</span>
                                    </div>
                                    <div style={{ paddingTop: 3, color: T.dim, fontSize: 10.5, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.name}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ color: T.text, fontSize: 13, fontWeight: 700 }}>Priority order</div>
                              <div style={{ marginTop: 4, color: T.dim, fontSize: 11.5, lineHeight: 1.4 }}>
                                P01 is the highest priority. Drag a face card to another position to change its priority; the remaining cards will reorder automatically.
                              </div>
                            </div>
                          </div>
                        </div>
                        <div id="aver-face-enrollment-tour-footer" style={{ padding: "10px 14px", display: "flex", justifyContent: "flex-end", borderTop: `1px solid ${T.line2}`, background: "rgba(255,255,255,0.018)" }}>
                          <button id="aver-face-enrollment-tour-confirm-button" type="button" onClick={() => setFaceEnrollmentTourOpen(false)} style={{ ...primaryBtn, minWidth: 92 }}>OK</button>
                        </div>
                      </div>
                    </div>
                  )}
                  {faceDragOverlay && (() => {
                    const overlayFace = trk.enrolledFaces.find((face) => face.id === faceDragOverlay.faceId);
                    if (!overlayFace) return null;
                    const overlayIndex = trk.enrolledFaces.findIndex((face) => face.id === overlayFace.id);
                    const overlayOrder = String(overlayIndex + 1).padStart(2, "0");
                    return (
                      <div
                        id="aver-face-drag-overlay"
                        aria-hidden="true"
                        style={{ position: "fixed", left: faceDragOverlay.x, top: faceDragOverlay.y, width: 96, zIndex: 80, pointerEvents: "none", padding: 4, boxSizing: "border-box", borderRadius: 6, background: "rgba(16,18,22,0.96)", border: `1px solid ${T.blue}`, boxShadow: "0 14px 34px rgba(0,0,0,0.55), 0 0 0 2px rgba(30,155,240,0.16)", transform: "rotate(-2deg) scale(1.04)", transformOrigin: "center", animation: "averFaceDragLift 140ms cubic-bezier(0.2, 0.8, 0.2, 1)" }}
                      >
                        <div style={{ width: 86, height: 86, position: "relative", overflow: "hidden", border: `1px solid ${T.line2}`, boxSizing: "border-box" }}>
                          <FaceEnrollmentCrop candidateId={overlayFace.candidateId} label="Dragging face" />
                          <span style={{ position: "absolute", top: 3, left: 3, color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1, textShadow: "0 1px 3px #000" }}>{overlayOrder}</span>
                        </div>
                        <div style={{ width: "100%", paddingTop: 4, color: overlayFace.name ? T.text : T.faint, fontSize: 11.5, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{overlayFace.name || "Unnamed"}</div>
                      </div>
                    );
                  })()}
                  {false && (
                    <div id="aver-face-edit-modal" role="dialog" aria-modal="true" aria-label="Edit enrolled faces" style={{ position: "fixed", inset: 0, zIndex: 60, padding: 24, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div id="aver-face-edit-dialog" style={{ width: "min(760px, calc(100vw - 48px))", height: "min(660px, calc(100vh - 48px))", display: "flex", flexDirection: "column", overflow: "hidden", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }}>
                        <div id="aver-face-edit-header" style={{ flexShrink: 0, padding: "18px 20px 14px", borderBottom: `1px solid ${T.line2}`, color: T.text, fontSize: 16, fontWeight: 600 }}>Edit data ({faceEditDrafts.length}/20)</div>
                        <div id="aver-face-edit-grid" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 8, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gridAutoRows: 160, alignContent: "start", gap: 10 }}>
                          {faceEditDrafts.map((face, index) => <div key={face.id} id={`aver-face-edit-card-${String(index + 1).padStart(2, "0")}`} data-face-id={face.id} style={{ minWidth: 0, height: 160, boxSizing: "border-box", padding: 6, background: "rgba(255,255,255,0.05)", border: `1px solid ${T.line}`, borderRadius: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 4, alignItems: "flex-start" }}>
                              <div id={`aver-face-edit-photo-${String(index + 1).padStart(2, "0")}`} style={{ width: 70, height: 70, position: "relative", overflow: "hidden", border: `1px solid ${T.line2}` }}>
                                <FaceEnrollmentCrop candidateId={face.candidateId} label={`Face ${index + 1} photo`} />
                                <span style={{ position: "absolute", top: 3, left: 3, color: "#fff", fontSize: 11, fontWeight: 700, textShadow: "0 1px 2px #000" }}>{String(index + 1).padStart(2, "0")}</span>
                              </div>
                              <button id={`aver-face-edit-delete-${String(index + 1).padStart(2, "0")}`} type="button" aria-label={`Delete ${face.name}`} onClick={() => deleteFaceDraft(face.id)} style={{ width: 24, height: 24, padding: 0, border: "none", background: "transparent", color: "#e66", fontSize: 18, cursor: "pointer" }}>×</button>
                            </div>
                            <input id={`aver-face-edit-name-${String(index + 1).padStart(2, "0")}`} aria-label={`Name for face ${index + 1}`} value={face.name} placeholder="Name (optional)" onChange={(e) => updateFaceDraft(face.id, "name", e.target.value)} style={{ ...sel, padding: "5px 6px", fontSize: 12 }} />
                            <label style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 11, color: T.dim }}>Priority
                              <select id={`aver-face-edit-priority-${String(index + 1).padStart(2, "0")}`} aria-label={`Priority for face ${index + 1}`} value={face.priority} onChange={(e) => updateFaceDraft(face.id, "priority", e.target.value)} style={{ ...sel, padding: "4px 6px", fontSize: 12 }}>{Array.from({ length: faceEditDrafts.length }, (_, n) => <option key={n + 1} value={n + 1}>{n + 1}</option>)}</select>
                            </label>
                          </div>)}
                        </div>
                        <div id="aver-face-edit-footer" style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: 16, borderTop: `1px solid ${T.line2}` }}>
                          <button id="aver-face-edit-cancel-button" onClick={() => setFaceEditOpen(false)} style={secondaryBtn}>Cancel</button>
                          <button id="aver-face-edit-save-button" onClick={saveFaceEditor} style={primaryBtn}>OK</button>
                        </div>
                      </div>
                    </div>
                  )}
                  {faceDeleteTarget && (
                    <div id="aver-face-delete-modal" role="dialog" aria-modal="true" aria-labelledby="aver-face-delete-title" style={{ position: "fixed", inset: 0, zIndex: 60, padding: 24, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div id="aver-face-delete-dialog" style={{ width: "min(390px, calc(100vw - 48px))", overflow: "hidden", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }}>
                        <div id="aver-face-delete-title" style={{ padding: "17px 18px 12px", color: T.text, fontSize: 16, fontWeight: 600 }}>Delete enrolled face?</div>
                        <div style={{ padding: "0 18px 18px", color: T.dim, fontSize: 13, lineHeight: 1.55 }}>
                          {faceDeleteTarget.name ? `“${faceDeleteTarget.name}”` : `Face ${String(faceDeleteTarget.order).padStart(2, "0")}`} will be removed.
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, padding: "12px 16px", borderTop: `1px solid ${T.line2}`, background: "rgba(255,255,255,0.02)" }}>
                          <button id="aver-face-delete-cancel-button" type="button" onClick={() => setFaceDeleteTarget(null)} style={secondaryBtn}>Cancel</button>
                          <button id="aver-face-delete-confirm-button" type="button" onClick={confirmFaceDelete} style={secondaryBtn}>OK</button>
                        </div>
                      </div>
                    </div>
                  )}
                  </>
                  )}
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div id="aver-video-audio-wrapper" style={{ display: "flex", flexDirection: "column", gap: SP[3], width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", overflowY: "auto", paddingRight: 8, boxSizing: "border-box" }}>
            
            {/* Video & Audio 設置區容器 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
              
              {/* 頂部的三個獨立 FormField 欄位，寬度與下方 Stream Video Output 相同 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                {/* Power Frequency */}
                <FormField label="Power Frequency">
                  <div style={{ display: "flex", gap: 24, padding: "4px 0" }}>
                    {["50Hz", "59.94Hz", "60Hz"].map((f) => (
                      <VerticalRadio key={f} label={f} checked={videoSettings.powerFreq === f} onChange={() => updVideo("powerFreq", f)} />
                    ))}
                  </div>
                </FormField>

                {/* Video Output Resolution */}
                <FormField label="Video Output Resolution">
                  <Select 
                    val={videoSettings.videoOutRes} 
                    options={["1080μP/59", "1080p/60", "1080p/50", "1080p/30", "720p/60", "720p/59.94"]} 
                    onChange={(v) => updVideo("videoOutRes", v)}
                    style={{ width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }}
                  />
                </FormField>

                {/* Theme Mode */}
                <FormField label="Theme Mode">
                  <Select 
                    val={videoSettings.themeMode} 
                    options={["Standard", "Dark", "Light"]} 
                    onChange={(v) => updVideo("themeMode", v)} 
                    style={{ width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }}
                  />
                </FormField>
              </div>

              {/* Stream Video Output 大卡片 */}
              <ConfigCard title="Stream Video Output">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {/* Row 1, Col 1: Stream Video Output */}
                  <FormField label="Stream Video Output">
                    <Select 
                      val={videoSettings.streamRes} 
                      options={["1920x1080", "1280x720", "640x360"]} 
                      onChange={(v) => updVideo("streamRes", v)} 
                      style={{ width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }}
                    />
                  </FormField>

                  {/* Row 1, Col 2: Bitrate */}
                  <FormField label="Bitrate">
                    <Select 
                      val={videoSettings.streamBitrate} 
                      options={["Auto", "2M", "4M", "8M", "16M"]} 
                      onChange={(v) => updVideo("streamBitrate", v)} 
                      style={{ width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }}
                    />
                  </FormField>

                  {/* Row 1, Col 3: Encoding Type */}
                  <FormField label="Encoding Type">
                    <div style={{ display: "flex", gap: 24, padding: "4px 0" }}>
                      <VerticalRadio label="H.264" checked={videoSettings.streamEncode === "H.264"} onChange={() => updVideo("streamEncode", "H.264")} />
                      <VerticalRadio label="H.265" checked={videoSettings.streamEncode === "H.265"} onChange={() => updVideo("streamEncode", "H.265")} />
                    </div>
                  </FormField>

                  {/* Row 2, Col 1: Framerate */}
                  <FormField label="Framerate">
                    <Select 
                      val={videoSettings.streamFps} 
                      options={["60", "50", "30", "25"]} 
                      onChange={(v) => updVideo("streamFps", v)} 
                      style={{ width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }}
                    />
                  </FormField>

                  {/* Row 2, Col 2: I-VOP Interval (S) */}
                  <FormField label="I-VOP Interval (S)" rightLabel={`${videoSettings.streamI_Vop}s`}>
                    <BodySlider val={videoSettings.streamI_Vop} min={1} max={10} onChange={(v) => updVideo("streamI_Vop", v)} />
                  </FormField>

                  {/* Row 2, Col 3: GOP Value */}
                  <FormField label="GOP Value">
                    <input 
                      type="text" 
                      disabled 
                      value={videoSettings.streamGop} 
                      style={{
                        background: "transparent",
                        border: "none",
                        color: T.faint,
                        fontSize: 14,
                        padding: "4px 0",
                        width: "100%",
                        boxSizing: "border-box",
                        cursor: "not-allowed",
                        outline: "none"
                      }} 
                    />
                  </FormField>

                  {/* Row 3, Col 1: Compatibility Encoding Mode */}
                  <FormField label="Compatibility Encoding Mode">
                    <div style={{ display: "flex", gap: 24, padding: "4px 0" }}>
                      <VerticalRadio label="Off" checked={videoSettings.streamCompat === "Off"} onChange={() => updVideo("streamCompat", "Off")} />
                      <VerticalRadio label="On" checked={videoSettings.streamCompat === "On"} onChange={() => updVideo("streamCompat", "On")} />
                    </div>
                  </FormField>

                  {/* Row 3, Col 2: Rate Control */}
                  <FormField label="Rate Control">
                    <div style={{ display: "flex", gap: 24, padding: "4px 0" }}>
                      <VerticalRadio label="VBR" checked={videoSettings.streamRateCtrl === "VBR"} onChange={() => updVideo("streamRateCtrl", "VBR")} />
                      <VerticalRadio label="CBR" checked={videoSettings.streamRateCtrl === "CBR"} onChange={() => updVideo("streamRateCtrl", "CBR")} />
                    </div>
                  </FormField>

                  {/* Row 3, Col 3: Empty */}
                  <div style={{ minHeight: 84 }} />
                </div>
              </ConfigCard>

              {/* Audio 大卡片 */}
              <ConfigCard title="Audio">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {/* Row 1, Col 1: Audio Input Type */}
                  <FormField label="Audio Input Type">
                    <div style={{ display: "flex", gap: 24, padding: "4px 0" }}>
                      <VerticalRadio label="Line In" checked={videoSettings.audioInputType === "Line In"} onChange={() => updVideo("audioInputType", "Line In")} />
                      <VerticalRadio label="MIC In" checked={videoSettings.audioInputType === "MIC In"} onChange={() => updVideo("audioInputType", "MIC In")} />
                    </div>
                  </FormField>

                  {/* Row 1, Col 2: Audio Volume */}
                  <FormField label="Audio Volume" rightLabel={videoSettings.audioVolume}>
                    <BodySlider val={videoSettings.audioVolume} min={0} max={10} onChange={(v) => updVideo("audioVolume", v)} />
                  </FormField>

                  {/* Row 1, Col 3: USB Audio Enable */}
                  <FormField label="USB Audio Enable">
                    <Select 
                      val={videoSettings.usbAudioEnable} 
                      options={["Enable", "Disable"]} 
                      onChange={(v) => updVideo("usbAudioEnable", v)} 
                      style={{ width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }}
                    />
                  </FormField>

                  {/* Row 2, Col 1: Encoding Type */}
                  <FormField label="Encoding Type">
                    <div style={{ display: "flex", gap: 24, padding: "4px 0" }}>
                      <VerticalRadio label="AAC" checked={videoSettings.audioEncode === "AAC"} onChange={() => {}} />
                    </div>
                  </FormField>

                  {/* Row 2, Col 2: Sampling Rate */}
                  <FormField label="Sampling Rate">
                    <Select 
                      val={videoSettings.audioSampleRate} 
                      options={["48K", "44.1K"]} 
                      disabled 
                      onChange={() => {}} 
                      style={{ width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }}
                    />
                  </FormField>

                  {/* Row 2, Col 3: Empty */}
                  <div style={{ minHeight: 84 }} />
                </div>
              </ConfigCard>
            </div>
          </div>
        )}

        {/* Save as New Scene Modal 彈出視窗 */}
        {saveOpen && (
          <div 
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              animation: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }} 
            onClick={() => setSaveOpen(false)}
          >
            <div 
              style={{
                background: T.panel,
                border: `1px solid ${T.line}`,
                borderRadius: 12,
                width: 420,
                padding: 24,
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.55)",
                animation: "scaleIn 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)"
              }} 
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: T.text }}>Save as New Scene</span>
                <button 
                  onClick={() => setSaveOpen(false)} 
                  style={{ background: "none", border: "none", cursor: "pointer", color: T.dim, fontSize: 16, padding: 0 }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 14, color: T.dim, marginBottom: 6 }}>Scene Name</div>
                  <input 
                    autoFocus 
                    value={scName} 
                    onChange={(e) => setScName(e.target.value)} 
                    placeholder="e.g. Main Stage / Studio" 
                    maxLength={24}
                    style={{ 
                      width: "100%",
                      boxSizing: "border-box",
                      background: "#101216", 
                      border: `1px solid ${T.line2}`, 
                      borderRadius: 6, 
                      color: T.text, 
                      fontSize: 14, 
                      padding: "8px 12px", 
                      outline: "none", 
                      fontFamily: fUI 
                    }} 
                  />
                </div>
                
                <div>
                  <div style={{ fontSize: 14, color: T.dim, marginBottom: 6 }}>Note</div>
                  <input 
                    value={scRemark} 
                    onChange={(e) => setScRemark(e.target.value)} 
                    placeholder="Describe this scene (Optional)" 
                    maxLength={48}
                    style={{ 
                      width: "100%",
                      boxSizing: "border-box",
                      background: "#101216", 
                      border: `1px solid ${T.line2}`, 
                      borderRadius: 6, 
                      color: T.text, 
                      fontSize: 14, 
                      padding: "8px 12px", 
                      outline: "none", 
                      fontFamily: fUI 
                    }} 
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(30,155,240,0.05)", padding: "8px 12px", borderRadius: 6, border: `1px solid rgba(30,155,240,0.15)` }}>
                  <span style={{ color: T.blue, fontSize: 14 }}>ℹ</span>
                  <span style={{ fontSize: 14, color: T.dim }}>Saving will automatically capture the current Live View image as a preview thumbnail.</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button 
                  onClick={() => setSaveOpen(false)} 
                  style={{ 
                    padding: "8px 16px", 
                    fontSize: 14, 
                    cursor: "pointer", 
                    borderRadius: 6, 
                    border: `1px solid ${T.line2}`, 
                    background: "transparent", 
                    color: T.dim, 
                    fontFamily: fUI 
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={saveNewScene} 
                  style={{ 
                    padding: "8px 20px", 
                    fontSize: 14, 
                    fontWeight: 600, 
                    cursor: "pointer", 
                    borderRadius: 6, 
                    border: "none", 
                    background: T.blue, 
                    color: "#fff", 
                    fontFamily: fUI 
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Scene Info Modal 彈出視窗 */}
        {editingScene != null && (() => {
          const es = scenes.find((x) => x.id === editingScene);
          if (!es) return null;
          return (
            <div 
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                animation: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              }} 
              onClick={() => setEditingScene(null)}
            >
              <div 
                style={{
                  background: T.panel,
                  border: `1px solid ${T.line}`,
                  borderRadius: 12,
                  width: 420,
                  padding: 24,
                  boxShadow: "0 12px 36px rgba(0, 0, 0, 0.55)",
                  animation: "scaleIn 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }} 
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 18, fontWeight: 600, color: T.text }}>Edit Scene Info</span>
                  <button 
                    onClick={() => setEditingScene(null)} 
                    style={{ background: "none", border: "none", cursor: "pointer", color: T.dim, fontSize: 16, padding: 0 }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 14, color: T.dim, marginBottom: 6 }}>Scene Name</div>
                    <input 
                      autoFocus 
                      value={edName} 
                      onChange={(e) => setEdName(e.target.value)} 
                      placeholder="Scene Name" 
                      maxLength={24}
                      style={{ 
                        width: "100%",
                        boxSizing: "border-box",
                        background: "#101216", 
                        border: `1px solid ${T.line2}`, 
                        borderRadius: 6, 
                        color: T.text, 
                        fontSize: 14, 
                        padding: "8px 12px", 
                        outline: "none", 
                        fontFamily: fUI 
                      }} 
                    />
                  </div>
                  
                  <div>
                    <div style={{ fontSize: 14, color: T.dim, marginBottom: 6 }}>Note</div>
                    <input 
                      value={edRemark} 
                      onChange={(e) => setEdRemark(e.target.value)} 
                      placeholder="Scene Description" 
                      maxLength={48}
                      style={{ 
                        width: "100%",
                        boxSizing: "border-box",
                        background: "#101216", 
                        border: `1px solid ${T.line2}`, 
                        borderRadius: 6, 
                        color: T.text, 
                        fontSize: 14, 
                        padding: "8px 12px", 
                        outline: "none", 
                        fontFamily: fUI 
                      }} 
                    />
                  </div>


                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button 
                    onClick={() => setEditingScene(null)} 
                    style={{ 
                      padding: "8px 16px", 
                      fontSize: 14, 
                      cursor: "pointer", 
                      borderRadius: 6, 
                      border: `1px solid ${T.line2}`, 
                      background: "transparent", 
                      color: T.dim, 
                      fontFamily: fUI 
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveSceneMeta} 
                    style={{ 
                      padding: "8px 20px", 
                      fontSize: 14, 
                      fontWeight: 600, 
                      cursor: "pointer", 
                      borderRadius: 6, 
                      border: "none", 
                      background: T.blue, 
                      color: "#fff", 
                      fontFamily: fUI 
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Delete Scene Modal 彈出視窗 */}
        {deletingScene != null && (
          <div 
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              animation: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }} 
            onClick={() => setDeletingScene(null)}
          >
            <div 
              style={{
                background: T.panel,
                border: `1px solid ${T.line}`,
                borderRadius: 12,
                width: 400,
                padding: 24,
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.55)",
                animation: "scaleIn 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)"
              }} 
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: T.text }}>Delete Scene</span>
                <button 
                  onClick={() => setDeletingScene(null)} 
                  style={{ background: "none", border: "none", cursor: "pointer", color: T.dim, fontSize: 16, padding: 0 }}
                >
                  ✕
                </button>
              </div>

              <div style={{ fontSize: 14, color: T.dim, marginBottom: 24, lineHeight: 1.6 }}>
                Are you sure you want to delete the custom scene「<span style={{ color: "#fff", fontWeight: 600 }}>{deletingScene.name}</span>」"?<br />
                This action will permanently remove the saved scene and cannot be undone.
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button 
                  onClick={() => setDeletingScene(null)} 
                  style={{ 
                    padding: "8px 16px", 
                    fontSize: 14, 
                    cursor: "pointer", 
                    borderRadius: 6, 
                    border: `1px solid ${T.line2}`, 
                    background: "transparent", 
                    color: T.dim, 
                    fontFamily: fUI 
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { deleteScene(deletingScene); setDeletingScene(null); }} 
                  style={{ 
                    padding: "8px 20px", 
                    fontSize: 14, 
                    fontWeight: 600, 
                    cursor: "pointer", 
                    borderRadius: 6, 
                    border: "none", 
                    background: "#e05c5c", 
                    color: "#fff", 
                    fontFamily: fUI 
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 右側懸浮工具(最高層級):Multi-Matrix 樣式切換鈕(僅 multi 區) + 導覽 i 鈕。
            Matrix 視覺化與版面切換鈕已依 PM 定案移除。 */}
        </div>
        {activeMenu === "paint" && (
          <div style={{ 
            position: "absolute", 
            right: 24, 
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 9999, 
            display: "flex", 
            flexDirection: "column", 
            gap: 12, 
            alignItems: "flex-end",
            pointerEvents: "none"
          }}>
            {/* [PM 定案] Matrix 採「色相環」、Multi-Matrix 採「Radar Wheel 2」、版面採「Classic Layout」,
                對應的設計切換鈕(matrixVizToggle / paintStyleToggle / paintLayoutToggle)均已移除。 */}
            {/* [2026-06 暫時移除 onboarding 流程] 導覽「i」按鈕已移除;需恢復時還原 {onbInfoBtn()}。 */}
          </div>
        )}
      </div>


      {/* Paint/Look 導覽 Onboarding 彈窗 */}
      {activeMenu === "paint" && onboardingModal()}
      {/* ===== 多段 Grid Debug 網格覆蓋層 ===== */}
      {gridDebug === "viewport-24" && (
        <div id="aver-grid-viewport-24" aria-hidden style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 999999,
          display: "grid",
          gridTemplateColumns: `repeat(${GRIDSYS.columns}, minmax(0,1fr))`,
          columnGap: GRIDSYS.gutter,
          padding: `0 ${GRIDSYS.margin}px`,
          boxSizing: "border-box"
        }}>
          {Array.from({ length: GRIDSYS.columns }).map((_, i) => (
            <div key={i} style={{
              position: "relative",
              background: (i >= 4 && i <= 21) ? "rgba(255, 64, 96, 0.09)" : "rgba(255, 64, 96, 0.045)",
              borderLeft: "1px solid rgba(255, 64, 96, 0.25)",
              borderRight: "1px solid rgba(255, 64, 96, 0.25)"
            }}>
              <span style={{ position: "absolute", top: 2, left: 3, fontSize: 9, fontFamily: fMono, color: "rgba(255,96,128,0.8)", fontWeight: "bold" }}>C{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      {gridDebug === "container-24" && (
        <div id="aver-grid-container-24" aria-hidden style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 220,
          right: 0,
          pointerEvents: "none",
          zIndex: 999999,
          display: "flex",
          justifyContent: "center"
        }}>
          <div style={{
            width: "100%",
            maxWidth: "1350px",
            height: "100%",
            padding: "0 24px",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "repeat(24, 1fr)",
            columnGap: "16px",
            position: "relative"
          }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} style={{
                background: "rgba(0, 180, 255, 0.03)",
                borderLeft: "1px dashed rgba(0, 180, 255, 0.18)",
                borderRight: "1px dashed rgba(0, 180, 255, 0.18)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                boxSizing: "border-box"
              }}>
                <span style={{ fontSize: 9, fontFamily: fMono, color: "#00b4ff", background: "rgba(10, 20, 30, 0.88)", padding: "1px 4px", borderRadius: 3, fontWeight: "bold" }}>C{i + 1}</span>
                <span style={{ fontSize: 9, fontFamily: fMono, color: "#00b4ff", background: "rgba(10, 20, 30, 0.88)", padding: "1px 4px", borderRadius: 3, fontWeight: "bold" }}>C{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {resetLivePresetTarget && (
        <div
          id="aver-live-preset-reset-modal"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setResetLivePresetTarget(null); }}
          style={{ position: "fixed", inset: 0, zIndex: 100, padding: 24, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div id="aver-live-preset-reset-dialog" role="dialog" aria-modal="true" aria-labelledby="aver-live-preset-reset-title" style={{ width: "min(400px, calc(100vw - 48px))", overflow: "hidden", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.58)" }}>
            <div id="aver-live-preset-reset-title" style={{ padding: "17px 18px 10px", color: T.text, fontSize: 16, fontWeight: 600 }}>Reset preset?</div>
            <div style={{ padding: "0 18px 18px", color: T.dim, fontSize: 13, lineHeight: 1.55 }}>
              Reset {resetLivePresetTarget.name}? The saved image and PTZ settings will be cleared.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, padding: "12px 16px", borderTop: `1px solid ${T.line2}`, background: "rgba(255,255,255,0.02)" }}>
              <button id="aver-live-preset-reset-cancel-button" type="button" onClick={() => setResetLivePresetTarget(null)} style={{ height: 31, padding: "0 16px", borderRadius: 5, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button id="aver-live-preset-reset-confirm-button" type="button" onClick={confirmResetLivePreset} style={{ height: 31, padding: "0 16px", borderRadius: 5, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI, fontSize: 13, cursor: "pointer" }}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {faceEnrollmentNoDataDialogOpen && (
        <div
          id="aver-face-enrollment-no-data-modal"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setFaceEnrollmentNoDataDialogOpen(false); }}
          style={{ position: "fixed", inset: 0, zIndex: 110, padding: 24, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div id="aver-face-enrollment-no-data-dialog" role="dialog" aria-modal="true" aria-labelledby="aver-face-enrollment-no-data-title" aria-describedby="aver-face-enrollment-no-data-message" style={{ width: "min(390px, calc(100vw - 48px))", overflow: "hidden", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.58)" }}>
            <div id="aver-face-enrollment-no-data-title" style={{ padding: "17px 18px 10px", color: T.text, fontSize: 16, fontWeight: 600 }}>Face Enrollment unavailable</div>
            <div id="aver-face-enrollment-no-data-message" style={{ padding: "0 18px 18px", color: T.dim, fontSize: 13, lineHeight: 1.55 }}>No data to enable Face Enrollment.</div>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 16px", borderTop: `1px solid ${T.line2}`, background: "rgba(255,255,255,0.02)" }}>
              <button id="aver-face-enrollment-no-data-confirm-button" type="button" autoFocus onClick={() => setFaceEnrollmentNoDataDialogOpen(false)} style={{ height: 31, minWidth: 76, padding: "0 18px", borderRadius: 5, border: `1px solid ${T.line2}`, background: T.panel2, color: T.text, fontFamily: fUI, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>OK</button>
            </div>
          </div>
        </div>
      )}

      {faceLibraryFullDialogOpen && (
        <div
          id="aver-face-library-full-modal"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setFaceLibraryFullDialogOpen(false); }}
          style={{ position: "fixed", inset: 0, zIndex: 110, padding: 24, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div id="aver-face-library-full-dialog" role="dialog" aria-modal="true" aria-labelledby="aver-face-library-full-title" aria-describedby="aver-face-library-full-message" style={{ width: "min(390px, calc(100vw - 48px))", overflow: "hidden", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.58)" }}>
            <div id="aver-face-library-full-title" style={{ padding: "17px 18px 10px", color: T.text, fontSize: 16, fontWeight: 600 }}>Face library is full</div>
            <div id="aver-face-library-full-message" style={{ padding: "0 18px 18px", color: T.dim, fontSize: 13, lineHeight: 1.55 }}>No more can be saved.</div>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 16px", borderTop: `1px solid ${T.line2}`, background: "rgba(255,255,255,0.02)" }}>
              <button id="aver-face-library-full-confirm-button" type="button" autoFocus onClick={() => setFaceLibraryFullDialogOpen(false)} style={{ height: 31, minWidth: 76, padding: "0 18px", borderRadius: 5, border: `1px solid ${T.line2}`, background: T.panel2, color: T.text, fontFamily: fUI, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>OK</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div id="aver-toast" className="aver-toast" role="status" aria-live="polite" style={{ position: "fixed", top: 18, left: "50%", zIndex: 1000, minWidth: 0, maxWidth: "min(360px, calc(100vw - 32px))", padding: "8px 13px", borderRadius: 6, border: `1px solid ${T.line2}`, background: "rgba(16,18,22,0.96)", color: T.text, boxShadow: "0 10px 30px rgba(0,0,0,0.45)", fontFamily: fUI, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      {gridDebug === "pixel-8" && (
        <div id="aver-grid-pixel-8" aria-hidden style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 999998,
          backgroundImage: "radial-gradient(rgba(224, 64, 255, 0.18) 1px, transparent 1px)",
          backgroundSize: "8px 8px"
        }} />
      )}

      <button 
        onClick={() => setGridDebug((prev) => {
          if (prev === "off") return "viewport-24";
          if (prev === "viewport-24") return "container-24";
          if (prev === "container-24") return "pixel-8";
          return "off";
        })} 
        title="格線檢查模式 (V24:全畫面 | C24:內容區對齊 | P8:8px微格)"
        style={{ 
          position: "absolute", 
          left: 10, 
          bottom: 10, 
          zIndex: 1000000, 
          width: 34, 
          height: 26, 
          borderRadius: 6, 
          border: `1px solid ${
            gridDebug === "viewport-24" ? "#ff4060" : 
            gridDebug === "container-24" ? "#00b4ff" : 
            gridDebug === "pixel-8" ? "#e040ff" : 
            T.line2
          }`, 
          background: 
            gridDebug === "viewport-24" ? "rgba(255,64,96,0.2)" : 
            gridDebug === "container-24" ? "rgba(0,180,255,0.15)" : 
            gridDebug === "pixel-8" ? "rgba(224,64,255,0.15)" : 
            "rgba(22,24,27,0.85)", 
          color: 
            gridDebug === "viewport-24" ? "#ff8098" : 
            gridDebug === "container-24" ? "#00b4ff" : 
            gridDebug === "pixel-8" ? "#e040ff" : 
            T.faint, 
          fontSize: 10, 
          fontWeight: 700, 
          cursor: "pointer", 
          fontFamily: fMono,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease"
        }}
      >
        {
          gridDebug === "viewport-24" ? "V24" : 
          gridDebug === "container-24" ? "C24" : 
          gridDebug === "pixel-8" ? "P8" : 
          "#"
        }
      </button>
    </div>
  );
}
