
# 系統需求規格書：Dual-AI Arena (雙 AI 論辯競技場)

## 1. 專案概述 (Project Overview)
* **專案名稱**：Dual-AI Arena
* **專案目標**：建立一個純前端的 Web 應用程式，透過兩個具備不同立場的 AI（Role A 支持方 & Role B 反對方）針對特定主題進行論辯。系統旨在協助使用者澄清概念、進行壓力測試、比較方案優劣，並在論辯結束後自動提煉共識與生成教學簡報。
* **核心價值**：
    * **思辨加速**：透過對立立場挖掘盲點。
    * **規格精煉**：將模糊想法轉化為具體的分歧與共識清單。
    * **教學應用**：一鍵轉換為 Marp 簡報，方便課堂展示。

---

## 2. 系統架構與技術棧 (System Architecture & Tech Stack)
* **前端框架**：React.js (v18+)
* **建置工具**：Vite
* **UI 框架**：Tailwind CSS（響應式設計）
* **AI SDK**：`@google/genai`（支援 Gemini 2.5 系列模型）
* **搜尋工具**：Google Search API grounding（研究階段與論辯輪次皆啟用）
* **部署平台**：GitHub Pages（純靜態部署）
* **資料存儲**：Browser LocalStorage（僅用於儲存 API Key）

---

## 3. 功能需求 (Functional Requirements)

### 3.1 憑證與安全性 (Credentials & Security)
* **API Key 授權**：使用者需於首次使用前輸入個人 Google Gemini API Key。
* **本地化儲存**：API Key 僅存於 `localStorage`，禁止上傳至任何後端伺服器。
* **安全性原則**：系統完全運行於客戶端。

### 3.2 配置中心 (Configuration Center)
* **角色設定 (Role Customization)**：
    * 提供兩個獨立的編輯區域，設定 Role A 與 Role B 的 **名稱** 與 **系統提示詞**。
    * 預設角色：Alpha（支持方）與 Omega（反對方）。
    * 設定面板為 modal 底部抽屜（mobile）/ 居中 dialog（desktop），支援 2 欄 role 卡片。
* **流程設定 (Flow Controls)**：
    * **論辯主題**：使用者輸入核心問題。
    * **回合數控制**：可設定雙方往返次數（預設 3，最大 10）。
    * **模型選擇**：自由輸入模型 ID（預設 `gemini-2.5-flash-lite`）。
    * **進行模式**：自動模式（連續執行）或手動模式（每輪需點擊繼續）。
    * **開場研究**：可選擇是否在論辯前執行搜尋研究階段（預設關閉）。

### 3.3 論辯執行引擎 (Debate Engine)
* **狀態機器 (State Machine)**：
    `idle → researchA → researchB → runningA → runningB → synthesis → finished`
* **開場研究階段（可選）**：
    * 論辯開始前，雙方角色各自使用 Google Search grounding 搜尋主題相關資訊。
    * 研究摘要附加至各自的 system prompt 作為事實依據。
* **脈絡維護**：`buildContextMessage()` 將完整對話歷史嵌入每輪請求。
* **打字機效果**：Streaming API 即時呈現文字生成過程；串流中訊息框帶 `animate-pulse`。
* **Google Search Grounding**：論辯輪次預設啟用 `googleSearch` tool。
* **自動重試 (Auto Retry)**：
    * 429 / 503 錯誤自動重試，最多 5 次，指數退避（3s → 60s）。
    * 超過重試次數後暫停，顯示「稍待繼續」按鈕由使用者手動恢復。

### 3.4 總結與分析模組 (Synthesis Module)
* **共識與分歧清單**：
    * 所有回合結束後自動觸發非串流 API 請求。
    * 輸出格式：`## 共識 (Consensus)` 與 `## 分歧 (Conflict)` 兩個 Markdown 區塊。
* **匯出 MD 記錄**：
    * 點擊「匯出 MD 記錄」，下載包含主題、所有訊息、總結的 `.md` 檔案。
* **Marp 簡報生成器**：
    * 點擊「生成 Marp 簡報」後，AI 根據完整論辯記錄生成 Marp Markdown。
    * 格式要求：`theme: gaia`，含主題、雙方論點、攻防摘要、總結。
    * 提供代碼預覽框（最高 320px，可捲動）與一鍵複製功能。

### 3.5 角色視覺設計 (Character Avatars)
* **AlphaAvatar**：藍色（sky）系 SVG 機器人，天線 + 笑臉造型，代表支持方。
* **OmegaAvatar**：琥珀（amber）系 SVG 機器人，Omega 符號額頭 + 嚴肅眼神，代表反對方。
* 兩個 avatar 均用於 ConfigPanel 角色卡片標題、MessageBubble 訊息頭像、DebateArena idle 頁面展示。

---

## 4. 預設系統提示詞 (Default System Prompts)

| 模組 | 角色定位 | 核心規則 |
| :--- | :--- | :--- |
| **Role A (Alpha)** | 支持方 | 站在支持立場，針對對方最新論點具體反駁，約 500 字，直接切入論點 |
| **Role B (Omega)** | 反對方 | 站在反對立場，挑戰假設與風險，約 500 字，直接切入論點 |
| **Synthesis** | 中立分析 | 輸出 `## 共識 (Consensus)` 與 `## 分歧 (Conflict)` 結構化 Markdown |
| **Marp** | 簡報工程師 | 生成 `theme: gaia` Marp Markdown，僅輸出代碼，不加說明 |
| **Research** | 情蒐員 | 使用 Google Search grounding 蒐集事實、數據、案例 |

---

## 5. 介面流程 (User Journey)

1. **進入首頁**：檢查 `localStorage` API Key，若無則彈出輸入 Modal。
2. **首次進入**：有 Key 但未曾設定過，自動開啟設定面板。
3. **設定參數**：在 ConfigPanel 中設定主題、角色、回合數、模型、模式與研究開關。
4. **啟動論辯**：點擊「開始論辯」，依設定執行研究→論辯→總結流程。
5. **即時觀看**：單欄垂直訊息流，Alpha 訊息靠左、Omega 訊息靠右，研究訊息以虛線框區分。
6. **手動模式**：每輪結束後顯示「繼續下一輪 →」按鈕。
7. **查看結案**：自動生成共識/分歧總結卡片（indigo/purple 漸層背景）。
8. **匯出成果**：下載 MD 記錄，或生成 Marp 代碼複製至簡報工具。

---

## 6. 部署規格 (Deployment Specification)
* **環境變數**：不使用 `.env` 儲存密鑰，API Key 由使用者動態提供。
* **GitHub Pages 設定**：
    * `deploy.yml` 利用 GitHub Actions 自動化編譯與推送至 `gh-pages` 分支。
    * Vite `base: '/dual-ai-arena/'`。

---

## 7. 非功能性需求 (Non-functional Requirements)
* **響應式**：ConfigPanel 在 mobile 為底部抽屜，desktop 為居中 dialog（max-w-2xl）；角色卡片 mobile 1 欄、desktop 2 欄。
* **Markdown 渲染**：所有訊息泡泡與總結卡片使用 `react-markdown` + `prose-invert`。
* **穩健性**：429/503 自動重試，超過後由使用者決定是否繼續；非可重試錯誤直接顯示錯誤訊息並重置至 idle。
* **無障礙**：SVG 元素包含 `role="img"` 與 `aria-label`。
