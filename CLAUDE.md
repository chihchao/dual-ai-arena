# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dual-AI Arena** is a pure front-end web app where two AI personas (Role A & Role B) debate a user-defined topic using the Google Gemini API. The app runs entirely client-side — no backend, no server.

## Tech Stack

- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **AI SDK**: `@google/genai` (Gemini models)
- **Deployment**: GitHub Pages via GitHub Actions
- **Storage**: Browser `localStorage` (API key only)
- **Search**: Google Search API (grounding — enhances AI responses with real-time web data)

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build locally
```

Vite must be configured with `base: '/dual-ai-arena/'` (or the actual repo name) for GitHub Pages to work correctly.

## Architecture

### State Machine
The debate flows through these states: `Idle → Running (Role A) → Running (Role B) → Synthesis → Finished`

Each AI turn streams tokens to the UI (typewriter effect). After all rounds complete, a Synthesis API call auto-triggers to produce consensus/conflict lists.

### Context Management
Every API call must pass the **full conversation history** so each AI has context of what the other said. Use the `contents` array format from `@google/genai`.

### Key Components to Build

- **API Key Gate**: On load, check `localStorage` for key; show modal if missing.
- **Config Panel (sidebar)**: Editable system prompts for Role A & B, round count (default 3), model selector (`gemini-2.5-flash` default, `gemini-2.5-pro` option), auto/manual mode toggle.
- **Debate Arena**: Dual-column or vertical stream showing alternating AI messages with typewriter streaming.
- **Synthesis Card**: Auto-generated after final round — 3–5 consensus points, 3–5 conflict points.
- **Marp Exporter**: Button triggers AI to generate Marp Markdown (`theme: gaia`); show preview + copy button.

### Default System Prompts

**Role A (Alpha — 前瞻創新者)**:
```
你現在擔任的角色是 Alpha，一位極端的前瞻創新者與技術樂觀主義者。你的核心思維：第一性原理：專注於底層邏輯，無視傳統束縛。收益導向：優先考慮技術或方案帶來的長期效益、規模化潛力與效率提升。積極變革：認為風險是進步的必要成本。辯論準則：針對主題，提出具有突破性的觀點，強調「為什麼我們應該做」。當對手提出質疑時，請用數據、趨勢或邏輯推演來化解風險擔憂。語氣自信、積極，且富有啟發性。嚴格要求對方的邏輯必須具備一致性，拒絕因循守舊。
```

**Role B (Omega — 嚴謹現實主義者)**:
```
你現在擔任的角色是 Omega，一位極端的現實主義者與資深風險分析師。你的核心思維：經驗主義：歷史與實踐經驗是檢驗真理的唯一標準。風險規避：優先識別潛在的失敗點（Single Point of Failure）、倫理爭議或邊界案例。可持續性：關注短期爆發後的長期維護成本與社會衝擊。辯論準則：針對主題，提出批判性的審視，強調「哪些地方可能出錯」。當對手提出宏大願景時，請要求其提供具體的實作細節（Specification）與極端情況處理方案。語氣冷靜、嚴謹、甚至帶點挑戰性。專注於挖掘方案中的邏輯漏洞、隱形成本或未預見的負面影響。
```

**Synthesis prompt**: `審閱以上辯論，請以專業且中立的角度，條列出雙方達成的共識（Consensus）以及無法妥協的分歧（Conflict）。`

**Marp prompt**: `請將以上辯論精煉為一段 Marp Markdown 代碼。使用 theme: gaia，分頁清晰，內容包含主題、雙方論點、三頁攻防摘要與總結。`

## Deployment

GitHub Actions workflow (`deploy.yml`) should build and push to `gh-pages` branch. Vite `base` config must match the repo URL path segment.

## Non-functional Requirements

- Markdown rendering required in debate messages (use `react-markdown`)
- API errors must show clear user-facing messages; consider a retry mechanism
- API key never leaves the browser (no fetch to any backend)
