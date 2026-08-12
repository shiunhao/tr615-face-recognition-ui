# TR615 UX 設計紀錄（截至 2026/07/25）

> 本文件簡要記錄 2026/07/25（含）以前已建立或確認的設計內容，作為後續版本比較基準。

## 1. 專案範圍

- 以既有 TR615 React Web UI 為基礎持續開發，保留 Live View、Paint / Look、Camera Settings、Video & Audio、Network、Tracking Settings、NDI、System 等功能。
- 人臉辨識功能主要整合於 `Tracking Settings > Face Enrollment`。
- 整體維持 TR615 深色介面、藍色主要操作與既有側邊選單風格。
- 原型主要程式仍集中於 `src/TR615PaintLookV6.jsx`，採漸進式調整，未全面重寫。

## 2. Face Enrollment 資訊架構

畫面主要分為三部分：

1. **Live View**：顯示示範場景、人臉偵測框與即時狀態。
2. **Enrollment Mode / Face Data**：選擇登錄方式並執行登錄。
3. **Enrolled Face Library**：顯示最多 20 筆已登錄人物資料。

## 3. 登錄流程

### Enroll All Faces

- 點擊 `Enroll All Faces` 後進行約 1 秒的模擬運算。
- 一次加入畫面中所有符合條件的正面人臉。
- 側臉、模糊、遮擋、距離過遠等人臉不會加入資料庫。
- 允許重複登錄同一張臉。
- 新增卡片會依建立順序自動產生編號與 Priority。

### Select Face

- 切換模式時顯示短暫的即時偵測 Loading。
- 藍框代表可選人物；紅框代表無法登錄的人臉。
- 點選可用人臉後，模擬 PTZ 緩慢置中與縮放，使人臉達到適合截圖的大小。
- 截圖完成後加入人臉資料庫，再恢復原本 Live View 取景。

## 4. 人臉框與狀態

- **藍框**：符合登錄條件／可選取。
- **紅框**：側臉、低品質、模糊或其他不符合條件的臉。
- **灰框（Library full）**：資料庫已滿，原本可登錄的人臉不可再加入。
- 支援多人同時出現在畫面上的 Demo 狀態。
- 示範場景使用歐美辦公室／會議環境，包含正面、側面及動態模糊人物。

## 5. Enrolled Face Library

- 容量上限為 **20 人**，面板以格位呈現卡片可放置位置。
- 卡片包含人臉縮圖、順序編號、名稱與刪除操作。
- 卡片順序即為 Priority：`P01` 優先度最高，之後依序排列。
- 支援拖曳卡片改變排序，其他卡片會補位並顯示過渡動畫。
- 點擊名稱可直接進入重新命名狀態。
- 刪除前需顯示二次確認視窗；刪除後由後方卡片遞補。
- Priority 可透過卡片上的順序控制介面調整，降低只依賴拖曳造成的理解門檻。

## 6. 引導與例外狀態

- Enrollment Mode 標題旁設有 Information 入口，說明藍框、紅框與 Priority 操作。
- 已規劃／呈現以下狀態：
  - 無人臉與空資料庫
  - 可登錄／不可登錄人臉
  - 多人臉
  - Library full
  - Loading、儲存中與完成提示
  - 刪除確認
  - 連線、辨識或儲存失敗的錯誤提示方向

## 7. PTZ 與版面原則

- Live View 旁保留方向、Home、Zoom In／Out 與 Save to Preset 控制。
- PTZ 動畫以實體攝影機的移動速度為基準，不採瞬間跳轉。
- Tracking Settings 預覽區縮小，控制面板高度提高，使內容盡量在一般筆電解析度內完整呈現。
- 左側選單切換動畫已朝統一的淡入／位移過渡方向整理。

## 8. 當時版本節點

- `14f7617` — Add Face Enrollment UX prototype
- `1d8a152` — Improve face enrollment card management
- `9e1f9be` — Refine face enrollment guidance and PTZ controls

以上內容可視為 2026/07/25 前的 Face Enrollment UX 基準版本；後續模式整併、Preset 系統重設計與 Figma 畫面整理不納入本次紀錄。
