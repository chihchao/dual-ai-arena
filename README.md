# Dual-AI Arena — 雙 AI 論辯競技場

讓兩個 AI 角色針對你指定的主題展開論辯，自動提煉共識與分歧，並一鍵生成 Marp 簡報。

純前端應用，完全在瀏覽器中運行，不需後端伺服器。

---

## 功能亮點

- **雙角色論辯** — Alpha（支持方）與 Omega（反對方）交替發言，每輪約 500 字
- **AI 角色建議** — 輸入主題後一鍵讓 AI 生成雙方角色名稱與系統提示詞
- **開場研究**（可選）— 論辯前雙方各自以 Google Search grounding 蒐集事實依據
- **即時串流** — 逐字輸出打字機效果，可感受 AI 思考過程
- **自動 / 手動模式** — 自動連續執行，或手動控制每輪節奏
- **自動重試** — 遇到 429 / 503 速率限制時，指數退避自動重試，不中斷論辯
- **論辯總結** — 所有回合結束後自動生成共識（Consensus）與分歧（Conflict）清單
- **匯出 MD 記錄** — 下載完整論辯記錄的 Markdown 檔案
- **Marp 簡報生成** — 一鍵生成 `theme: gaia` 簡報代碼，複製即可在 Marp 使用
- **完全客戶端** — API Key 僅存於瀏覽器 `localStorage`，不經過任何後端

---

## 快速開始

### 前置需求

- [Google Gemini API Key](https://aistudio.google.com/apikey)（免費方案即可）

### 本地開發

```bash
git clone https://github.com/imchihchao/dual-ai-arena.git
cd dual-ai-arena
npm install
npm run dev
```

開啟瀏覽器前往 `http://localhost:5173/dual-ai-arena/`，輸入 API Key 即可開始使用。

### 線上版本

部署於 GitHub Pages：`https://chihchao.github.io/dual-ai-arena/`

---

## 使用說明

1. **輸入 API Key** — 首次開啟會彈出輸入框，Key 僅存在本機瀏覽器中
2. **設定論辯** — 點擊右上角齒輪，填入：
   - 論辯主題（例：「新創公司是否應該導入微服務架構？」）
   - 自訂角色名稱與系統提示詞（或點擊「AI 建議角色提示詞」自動生成）
   - 回合數（1–10，預設 3）
   - 進行模式（自動 / 手動）
   - 開場研究開關
   - 模型（預設 `gemini-2.5-flash-lite`）
3. **開始論辯** — 點擊「開始論辯」，觀看雙方交鋒
4. **查看結果** — 論辯結束後自動顯示共識/分歧總結
5. **匯出** — 下載 MD 記錄，或生成 Marp 簡報代碼

---

## 技術棧

| 項目 | 說明 |
|------|------|
| React 18 + Vite | 前端框架與建置工具 |
| Tailwind CSS | 樣式 |
| `@google/genai` | Gemini API SDK，支援 streaming 與 Google Search grounding |
| `react-markdown` | 論辯訊息與總結的 Markdown 渲染 |
| GitHub Actions | 自動部署至 GitHub Pages |

### 支援模型

- `gemini-2.5-flash-lite`（預設，速度最快）
- `gemini-2.5-flash`
- `gemini-2.5-pro`
- 任意可用的 Gemini 模型 ID（自由輸入）

---

## 開發指令

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 生產環境建置
npm run preview  # 預覽建置結果
```

---

## 授權

MIT
