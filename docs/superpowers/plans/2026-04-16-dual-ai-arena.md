# Dual-AI Arena Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pure client-side React app where two Gemini AI personas debate a topic, then auto-generate a consensus/conflict summary and a Marp presentation.

**Architecture:** React 18 + Vite SPA. A central `useDebateEngine` hook owns all state (phase, messages, history) and drives API calls. Components are purely presentational. All Gemini calls stream tokens directly into the UI for a typewriter effect.

**Tech Stack:** React 18, Vite, Tailwind CSS v4, `@google/genai`, `react-markdown`, Vitest + @testing-library/react, GitHub Actions → GitHub Pages

---

## File Structure

```
dual-ai-arena/
├── vite.config.js              # base: '/dual-ai-arena/', vitest config
├── index.html
├── src/
│   ├── main.jsx                # ReactDOM.createRoot entry
│   ├── App.jsx                 # Root: ApiKeyModal overlay + two-column layout
│   ├── constants.js            # MODELS array, DEFAULT_ROUNDS, DEFAULT_AUTO_MODE
│   ├── lib/
│   │   ├── storage.js          # getApiKey / setApiKey / clearApiKey (localStorage)
│   │   ├── prompts.js          # ROLE_A_DEFAULT, ROLE_B_DEFAULT, SYNTHESIS_PROMPT, MARP_PROMPT
│   │   └── gemini.js           # streamDebateTurn(apiKey, opts) async generator
│   ├── hooks/
│   │   └── useDebateEngine.js  # State machine + orchestration, calls gemini.js
│   ├── components/
│   │   ├── ApiKeyModal.jsx     # Full-screen overlay, input + save
│   │   ├── ConfigPanel.jsx     # Left sidebar: roles, rounds, model, mode, topic, start
│   │   ├── MessageBubble.jsx   # Single debate message (role badge + markdown)
│   │   ├── DebateArena.jsx     # Scrolling list of MessageBubbles + Next Turn button
│   │   ├── SynthesisCard.jsx   # Consensus/conflict lists, rendered from synthesis text
│   │   └── MarpExporter.jsx    # Generate + copy Marp markdown
│   └── test/
│       └── setup.js            # @testing-library/jest-dom import
├── src/lib/storage.test.js
├── src/lib/prompts.test.js
├── src/lib/gemini.test.js
├── src/hooks/useDebateEngine.test.js
└── .github/workflows/deploy.yml
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `vite.config.js`
- Create: `src/index.css`
- Create: `src/test/setup.js`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Scaffold Vite + React project**

Run in `/Users/chao/Project/dual-ai-arena/`:
```bash
npm create vite@latest . -- --template react
```
Confirm overwrite of existing files if prompted (only `spec.md`, `CLAUDE.md`, `docs/` are existing — say yes to scaffold).

- [ ] **Step 2: Install all dependencies**

```bash
npm install
npm install @google/genai react-markdown
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Replace `vite.config.js`**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/dual-ai-arena/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})
```

- [ ] **Step 4: Replace `src/index.css` with Tailwind v4 import**

```css
@import "tailwindcss";
```

- [ ] **Step 5: Create test setup file**

Create `src/test/setup.js`:
```javascript
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Add test script to `package.json`**

Add to `"scripts"` in `package.json`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite server running at `http://localhost:5173/dual-ai-arena/`

- [ ] **Step 8: Commit**

```bash
git init
git add vite.config.js package.json package-lock.json src/ index.html public/ .gitignore
git commit -m "chore: scaffold Vite + React + Tailwind project"
```

---

## Task 2: Storage Utilities

**Files:**
- Create: `src/lib/storage.js`
- Create: `src/lib/storage.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/lib/storage.test.js`:
```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { getApiKey, setApiKey, clearApiKey } from './storage'

const KEY = 'gemini_api_key'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('getApiKey returns null when not set', () => {
    expect(getApiKey()).toBeNull()
  })

  it('setApiKey stores the key', () => {
    setApiKey('abc123')
    expect(localStorage.getItem(KEY)).toBe('abc123')
  })

  it('getApiKey returns stored key', () => {
    localStorage.setItem(KEY, 'mykey')
    expect(getApiKey()).toBe('mykey')
  })

  it('clearApiKey removes the key', () => {
    localStorage.setItem(KEY, 'mykey')
    clearApiKey()
    expect(localStorage.getItem(KEY)).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- src/lib/storage.test.js
```
Expected: FAIL — `storage.js` not found

- [ ] **Step 3: Implement `src/lib/storage.js`**

```javascript
const KEY = 'gemini_api_key'

export const getApiKey = () => localStorage.getItem(KEY)
export const setApiKey = (key) => localStorage.setItem(KEY, key)
export const clearApiKey = () => localStorage.removeItem(KEY)
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm run test:run -- src/lib/storage.test.js
```
Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/storage.js src/lib/storage.test.js
git commit -m "feat: add localStorage API key helpers"
```

---

## Task 3: Constants and Default Prompts

**Files:**
- Create: `src/constants.js`
- Create: `src/lib/prompts.js`
- Create: `src/lib/prompts.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/lib/prompts.test.js`:
```javascript
import { describe, it, expect } from 'vitest'
import { ROLE_A_DEFAULT, ROLE_B_DEFAULT, SYNTHESIS_PROMPT, MARP_PROMPT } from './prompts'

describe('prompts', () => {
  it('ROLE_A_DEFAULT contains Alpha', () => {
    expect(ROLE_A_DEFAULT.systemPrompt).toContain('Alpha')
  })

  it('ROLE_B_DEFAULT contains Omega', () => {
    expect(ROLE_B_DEFAULT.systemPrompt).toContain('Omega')
  })

  it('ROLE_A_DEFAULT has a name', () => {
    expect(ROLE_A_DEFAULT.name).toBe('Alpha')
  })

  it('ROLE_B_DEFAULT has a name', () => {
    expect(ROLE_B_DEFAULT.name).toBe('Omega')
  })

  it('SYNTHESIS_PROMPT is a non-empty string', () => {
    expect(typeof SYNTHESIS_PROMPT).toBe('string')
    expect(SYNTHESIS_PROMPT.length).toBeGreaterThan(0)
  })

  it('MARP_PROMPT mentions gaia theme', () => {
    expect(MARP_PROMPT).toContain('gaia')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- src/lib/prompts.test.js
```
Expected: FAIL — `prompts.js` not found

- [ ] **Step 3: Create `src/lib/prompts.js`**

```javascript
export const ROLE_A_DEFAULT = {
  name: 'Alpha',
  systemPrompt:
    '你現在擔任的角色是 Alpha，一位極端的前瞻創新者與技術樂觀主義者。你的核心思維：第一性原理：專注於底層邏輯，無視傳統束縛。收益導向：優先考慮技術或方案帶來的長期效益、規模化潛力與效率提升。積極變革：認為風險是進步的必要成本。辯論準則：針對主題，提出具有突破性的觀點，強調「為什麼我們應該做」。當對手提出質疑時，請用數據、趨勢或邏輯推演來化解風險擔憂。語氣自信、積極，且富有啟發性。嚴格要求對方的邏輯必須具備一致性，拒絕因循守舊。',
}

export const ROLE_B_DEFAULT = {
  name: 'Omega',
  systemPrompt:
    '你現在擔任的角色是 Omega，一位極端的現實主義者與資深風險分析師。你的核心思維：經驗主義：歷史與實踐經驗是檢驗真理的唯一標準。風險規避：優先識別潛在的失敗點（Single Point of Failure）、倫理爭議或邊界案例。可持續性：關注短期爆發後的長期維護成本與社會衝擊。辯論準則：針對主題，提出批判性的審視，強調「哪些地方可能出錯」。當對手提出宏大願景時，請要求其提供具體的實作細節（Specification）與極端情況處理方案。語氣冷靜、嚴謹、甚至帶點挑戰性。專注於挖掘方案中的邏輯漏洞、隱形成本或未預見的負面影響。',
}

export const SYNTHESIS_PROMPT =
  '審閱以上辯論，請以專業且中立的角度，條列出雙方達成的共識（Consensus）以及無法妥協的分歧（Conflict）。請用以下格式回應：\n\n## 共識 (Consensus)\n- ...\n\n## 分歧 (Conflict)\n- ...'

export const MARP_PROMPT =
  '請將以上辯論精煉為一段 Marp Markdown 代碼。使用 `theme: gaia`，分頁清晰，內容包含主題、雙方論點、三頁攻防摘要與總結。只輸出 Markdown 代碼，不要加任何說明。'
```

- [ ] **Step 4: Create `src/constants.js`**

```javascript
export const MODELS = [
  { id: 'gemini-2.5-flash-preview-04-17', label: 'Gemini 2.5 Flash (預設)' },
  { id: 'gemini-2.5-pro-preview-03-25', label: 'Gemini 2.5 Pro' },
]

export const DEFAULT_MODEL = MODELS[0].id
export const DEFAULT_ROUNDS = 3
export const DEFAULT_AUTO_MODE = true
```

- [ ] **Step 5: Run tests**

```bash
npm run test:run -- src/lib/prompts.test.js
```
Expected: 6 tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/prompts.js src/lib/prompts.test.js src/constants.js
git commit -m "feat: add default prompts and model constants"
```

---

## Task 4: Gemini API Client

**Files:**
- Create: `src/lib/gemini.js`
- Create: `src/lib/gemini.test.js`

The Gemini client wraps `@google/genai`. Each debate turn sends the full conversation history as a formatted context string so both AIs have complete awareness of the exchange.

- [ ] **Step 1: Write failing tests**

Create `src/lib/gemini.test.js`:
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildContextMessage } from './gemini'

describe('buildContextMessage', () => {
  it('returns just the topic when history is empty', () => {
    const result = buildContextMessage('AI 的未來', [])
    expect(result).toContain('AI 的未來')
  })

  it('includes previous messages formatted with speaker names', () => {
    const history = [
      { role: 'A', name: 'Alpha', content: 'AI is great' },
      { role: 'B', name: 'Omega', content: 'AI has risks' },
    ]
    const result = buildContextMessage('AI 的未來', history)
    expect(result).toContain('Alpha')
    expect(result).toContain('AI is great')
    expect(result).toContain('Omega')
    expect(result).toContain('AI has risks')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- src/lib/gemini.test.js
```
Expected: FAIL — `gemini.js` not found

- [ ] **Step 3: Implement `src/lib/gemini.js`**

```javascript
import { GoogleGenAI } from '@google/genai'

/**
 * Builds the user message content string for a debate turn.
 * @param {string} topic
 * @param {Array<{role: 'A'|'B', name: string, content: string}>} history
 * @returns {string}
 */
export function buildContextMessage(topic, history) {
  let msg = `辯論主題：${topic}\n\n`
  if (history.length === 0) {
    msg += '請開始你的論述。'
  } else {
    msg += '以下是目前的辯論紀錄：\n\n'
    for (const entry of history) {
      msg += `【${entry.name}】\n${entry.content}\n\n`
    }
    msg += '請針對對方的論點繼續你的回應。'
  }
  return msg
}

/**
 * Streams a single debate turn from the Gemini API.
 * @param {string} apiKey
 * @param {{ systemPrompt: string, topic: string, history: Array, model: string, useSearch?: boolean }} opts
 * @yields {string} text chunks
 */
export async function* streamDebateTurn(apiKey, { systemPrompt, topic, history, model, useSearch = true }) {
  const ai = new GoogleGenAI({ apiKey })
  const userMessage = buildContextMessage(topic, history)

  const config = {
    systemInstruction: systemPrompt,
  }
  if (useSearch) {
    config.tools = [{ googleSearch: {} }]
  }

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
  })

  for await (const chunk of response) {
    const text = chunk.text()
    if (text) yield text
  }
}

/**
 * Non-streaming call for synthesis and Marp generation.
 * @param {string} apiKey
 * @param {{ systemPrompt: string, topic: string, history: Array, model: string }} opts
 * @returns {Promise<string>}
 */
export async function generateContent(apiKey, { systemPrompt, topic, history, model }) {
  const ai = new GoogleGenAI({ apiKey })
  const userMessage = buildContextMessage(topic, history)

  const response = await ai.models.generateContent({
    model,
    config: { systemInstruction: systemPrompt },
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
  })

  return response.text()
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run -- src/lib/gemini.test.js
```
Expected: 2 tests PASS (only `buildContextMessage` is tested — the API calls require a live key)

- [ ] **Step 5: Commit**

```bash
git add src/lib/gemini.js src/lib/gemini.test.js
git commit -m "feat: add Gemini streaming and content generation helpers"
```

---

## Task 5: Debate Engine Hook

**Files:**
- Create: `src/hooks/useDebateEngine.js`
- Create: `src/hooks/useDebateEngine.test.js`

This hook owns the full state machine. Phases: `idle → runningA → runningB → synthesis → finished`.

- [ ] **Step 1: Write failing tests**

Create `src/hooks/useDebateEngine.test.js`:
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebateEngine } from './useDebateEngine'

// Mock gemini module
vi.mock('../lib/gemini', () => ({
  streamDebateTurn: vi.fn(),
  generateContent: vi.fn(),
}))

import { streamDebateTurn, generateContent } from '../lib/gemini'

async function* fakeStream(chunks) {
  for (const chunk of chunks) yield chunk
}

describe('useDebateEngine', () => {
  beforeEach(() => vi.clearAllMocks())

  it('starts in idle phase', () => {
    const { result } = renderHook(() => useDebateEngine())
    expect(result.current.phase).toBe('idle')
    expect(result.current.messages).toEqual([])
  })

  it('reset returns to idle and clears messages', async () => {
    streamDebateTurn.mockReturnValue(fakeStream(['hello']))
    generateContent.mockResolvedValue('## 共識\n- x\n\n## 分歧\n- y')

    const { result } = renderHook(() => useDebateEngine())

    await act(async () => {
      await result.current.startDebate({
        apiKey: 'key',
        topic: 'test',
        roleA: { name: 'Alpha', systemPrompt: 'sp-a' },
        roleB: { name: 'Omega', systemPrompt: 'sp-b' },
        rounds: 1,
        model: 'gemini-2.5-flash-preview-04-17',
        autoMode: true,
      })
    })

    act(() => result.current.reset())
    expect(result.current.phase).toBe('idle')
    expect(result.current.messages).toEqual([])
  })

  it('adds a message for Role A after first turn', async () => {
    streamDebateTurn.mockReturnValue(fakeStream(['AI is ', 'great']))
    generateContent.mockResolvedValue('## 共識\n- x\n\n## 分歧\n- y')

    const { result } = renderHook(() => useDebateEngine())

    await act(async () => {
      await result.current.startDebate({
        apiKey: 'key',
        topic: 'test',
        roleA: { name: 'Alpha', systemPrompt: 'sp-a' },
        roleB: { name: 'Omega', systemPrompt: 'sp-b' },
        rounds: 1,
        model: 'gemini-2.5-flash-preview-04-17',
        autoMode: true,
      })
    })

    const alphaMsg = result.current.messages.find((m) => m.role === 'A')
    expect(alphaMsg).toBeDefined()
    expect(alphaMsg.content).toContain('AI is great')
  })

  it('phase is finished after all rounds in autoMode', async () => {
    streamDebateTurn.mockReturnValue(fakeStream(['response']))
    generateContent.mockResolvedValue('## 共識\n- x\n\n## 分歧\n- y')

    const { result } = renderHook(() => useDebateEngine())

    await act(async () => {
      await result.current.startDebate({
        apiKey: 'key',
        topic: 'test',
        roleA: { name: 'Alpha', systemPrompt: 'sp-a' },
        roleB: { name: 'Omega', systemPrompt: 'sp-b' },
        rounds: 1,
        model: 'gemini-2.5-flash-preview-04-17',
        autoMode: true,
      })
    })

    expect(result.current.phase).toBe('finished')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- src/hooks/useDebateEngine.test.js
```
Expected: FAIL — `useDebateEngine.js` not found

- [ ] **Step 3: Implement `src/hooks/useDebateEngine.js`**

```javascript
import { useState, useCallback, useRef } from 'react'
import { streamDebateTurn, generateContent } from '../lib/gemini'
import { SYNTHESIS_PROMPT } from '../lib/prompts'

export function useDebateEngine() {
  const [phase, setPhase] = useState('idle')
  const [messages, setMessages] = useState([])
  const [synthesis, setSynthesis] = useState(null)
  const [error, setError] = useState(null)
  const historyRef = useRef([])

  const appendMessage = (role, name, content) => {
    setMessages((prev) => [...prev, { role, name, content, id: Date.now() + Math.random() }])
  }

  const runTurn = async (role, name, systemPrompt, topic, apiKey, model) => {
    let accumulated = ''
    const msgId = Date.now() + Math.random()
    setMessages((prev) => [...prev, { role, name, content: '', id: msgId, streaming: true }])

    for await (const chunk of streamDebateTurn(apiKey, {
      systemPrompt,
      topic,
      history: historyRef.current,
      model,
      useSearch: true,
    })) {
      accumulated += chunk
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, content: accumulated } : m))
      )
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, streaming: false } : m))
    )

    historyRef.current = [...historyRef.current, { role, name, content: accumulated }]
    return accumulated
  }

  const startDebate = useCallback(async ({ apiKey, topic, roleA, roleB, rounds, model, autoMode }) => {
    setError(null)
    setSynthesis(null)
    setMessages([])
    historyRef.current = []

    try {
      for (let round = 0; round < rounds; round++) {
        setPhase('runningA')
        await runTurn('A', roleA.name, roleA.systemPrompt, topic, apiKey, model)

        setPhase('runningB')
        await runTurn('B', roleB.name, roleB.systemPrompt, topic, apiKey, model)
      }

      setPhase('synthesis')
      const summaryText = await generateContent(apiKey, {
        systemPrompt: SYNTHESIS_PROMPT,
        topic,
        history: historyRef.current,
        model,
      })
      setSynthesis(summaryText)
      setPhase('finished')
    } catch (err) {
      setError(err.message || '發生未知錯誤')
      setPhase('idle')
    }
  }, [])

  const reset = useCallback(() => {
    setPhase('idle')
    setMessages([])
    setSynthesis(null)
    setError(null)
    historyRef.current = []
  }, [])

  return { phase, messages, synthesis, error, startDebate, reset }
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run -- src/hooks/useDebateEngine.test.js
```
Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useDebateEngine.js src/hooks/useDebateEngine.test.js
git commit -m "feat: implement debate engine state machine hook"
```

---

## Task 6: ApiKeyModal Component

**Files:**
- Create: `src/components/ApiKeyModal.jsx`

- [ ] **Step 1: Create `src/components/ApiKeyModal.jsx`**

```jsx
import { useState } from 'react'
import { setApiKey } from '../lib/storage'

export function ApiKeyModal({ onSave }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    setApiKey(trimmed)
    onSave(trimmed)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">設定 Gemini API Key</h2>
        <p className="text-gray-500 text-sm mb-6">
          API Key 僅儲存於本機瀏覽器，不會上傳至任何伺服器。
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="AIza..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="bg-blue-600 text-white rounded-lg py-2 font-semibold disabled:opacity-40 hover:bg-blue-700 transition"
          >
            儲存並開始
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Start dev server and verify modal renders**

```bash
npm run dev
```
Temporarily edit `src/App.jsx` to render `<ApiKeyModal onSave={console.log} />`.
Open `http://localhost:5173/dual-ai-arena/` and confirm the modal appears with password input.

- [ ] **Step 3: Commit**

```bash
git add src/components/ApiKeyModal.jsx
git commit -m "feat: add API key modal component"
```

---

## Task 7: ConfigPanel Component

**Files:**
- Create: `src/components/ConfigPanel.jsx`

- [ ] **Step 1: Create `src/components/ConfigPanel.jsx`**

```jsx
import { useState } from 'react'
import { ROLE_A_DEFAULT, ROLE_B_DEFAULT } from '../lib/prompts'
import { MODELS, DEFAULT_ROUNDS, DEFAULT_MODEL, DEFAULT_AUTO_MODE } from '../constants'

export function ConfigPanel({ onStart, onClearKey, disabled }) {
  const [roleA, setRoleA] = useState(ROLE_A_DEFAULT)
  const [roleB, setRoleB] = useState(ROLE_B_DEFAULT)
  const [topic, setTopic] = useState('')
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS)
  const [model, setModel] = useState(DEFAULT_MODEL)
  const [autoMode, setAutoMode] = useState(DEFAULT_AUTO_MODE)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    onStart({ roleA, roleB, topic: topic.trim(), rounds, model, autoMode })
  }

  return (
    <aside className="w-80 min-h-screen bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-4 overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-800">Dual-AI Arena ⚔️</h1>

      {/* Role A */}
      <section className="bg-white rounded-xl p-3 shadow-sm border border-blue-100">
        <label className="block text-xs font-semibold text-blue-600 mb-1">角色 A 名稱</label>
        <input
          className="w-full border rounded px-2 py-1 text-sm mb-2"
          value={roleA.name}
          onChange={(e) => setRoleA({ ...roleA, name: e.target.value })}
        />
        <label className="block text-xs font-semibold text-blue-600 mb-1">系統提示詞</label>
        <textarea
          className="w-full border rounded px-2 py-1 text-xs h-28 resize-none"
          value={roleA.systemPrompt}
          onChange={(e) => setRoleA({ ...roleA, systemPrompt: e.target.value })}
        />
      </section>

      {/* Role B */}
      <section className="bg-white rounded-xl p-3 shadow-sm border border-red-100">
        <label className="block text-xs font-semibold text-red-600 mb-1">角色 B 名稱</label>
        <input
          className="w-full border rounded px-2 py-1 text-sm mb-2"
          value={roleB.name}
          onChange={(e) => setRoleB({ ...roleB, name: e.target.value })}
        />
        <label className="block text-xs font-semibold text-red-600 mb-1">系統提示詞</label>
        <textarea
          className="w-full border rounded px-2 py-1 text-xs h-28 resize-none"
          value={roleB.systemPrompt}
          onChange={(e) => setRoleB({ ...roleB, systemPrompt: e.target.value })}
        />
      </section>

      {/* Flow controls */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">辯論主題</label>
          <textarea
            className="w-full border rounded px-2 py-1 text-sm h-16 resize-none"
            placeholder="例：SDD 流程是否值得導入？"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">回合數</label>
            <input
              type="number"
              min={1}
              max={10}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">模式</label>
            <select
              value={autoMode ? 'auto' : 'manual'}
              onChange={(e) => setAutoMode(e.target.value === 'auto')}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="auto">自動</option>
              <option value="manual">手動</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">模型</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={disabled || !topic.trim()}
          className="bg-indigo-600 text-white rounded-lg py-2 font-semibold disabled:opacity-40 hover:bg-indigo-700 transition"
        >
          {disabled ? '辯論中...' : '開始辯論'}
        </button>
      </form>

      <button
        onClick={onClearKey}
        className="text-xs text-gray-400 hover:text-red-500 mt-auto"
      >
        清除 API Key
      </button>
    </aside>
  )
}
```

- [ ] **Step 2: Verify in browser**

Render `<ConfigPanel onStart={console.log} onClearKey={() => {}} disabled={false} />` in App.jsx. Confirm all fields and start button are visible.

- [ ] **Step 3: Commit**

```bash
git add src/components/ConfigPanel.jsx
git commit -m "feat: add config panel sidebar"
```

---

## Task 8: MessageBubble and DebateArena Components

**Files:**
- Create: `src/components/MessageBubble.jsx`
- Create: `src/components/DebateArena.jsx`

- [ ] **Step 1: Create `src/components/MessageBubble.jsx`**

```jsx
import ReactMarkdown from 'react-markdown'

export function MessageBubble({ message }) {
  const isA = message.role === 'A'
  return (
    <div className={`flex flex-col gap-1 ${isA ? 'items-start' : 'items-end'}`}>
      <span
        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          isA ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {message.name}
      </span>
      <div
        className={`max-w-2xl rounded-2xl px-4 py-3 text-sm prose prose-sm ${
          isA
            ? 'bg-blue-50 text-gray-800 rounded-tl-none'
            : 'bg-red-50 text-gray-800 rounded-tr-none'
        } ${message.streaming ? 'animate-pulse' : ''}`}
      >
        <ReactMarkdown>{message.content || '▌'}</ReactMarkdown>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/DebateArena.jsx`**

```jsx
import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'

export function DebateArena({ messages, phase, error }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (phase === 'idle') {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
        設定左側參數後，點擊「開始辯論」
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {phase === 'synthesis' && (
        <div className="text-center text-gray-400 text-sm animate-pulse">正在生成總結...</div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Render `<DebateArena messages={[{id:1, role:'A', name:'Alpha', content:'**Hello**', streaming:false}]} phase="runningA" error={null} />`. Confirm the bubble renders with markdown bold.

- [ ] **Step 4: Commit**

```bash
git add src/components/MessageBubble.jsx src/components/DebateArena.jsx
git commit -m "feat: add message bubble and debate arena components"
```

---

## Task 9: SynthesisCard Component

**Files:**
- Create: `src/components/SynthesisCard.jsx`

- [ ] **Step 1: Create `src/components/SynthesisCard.jsx`**

```jsx
import ReactMarkdown from 'react-markdown'

export function SynthesisCard({ synthesis }) {
  if (!synthesis) return null

  return (
    <div className="mx-6 mb-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-indigo-800 mb-3">辯論總結</h3>
      <div className="prose prose-sm prose-indigo max-w-none">
        <ReactMarkdown>{synthesis}</ReactMarkdown>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Render with `synthesis="## 共識\n- 雙方同意 AI 有潛力\n\n## 分歧\n- 風險評估不同"`. Confirm markdown sections render as headings and bullet points.

- [ ] **Step 3: Commit**

```bash
git add src/components/SynthesisCard.jsx
git commit -m "feat: add synthesis card component"
```

---

## Task 10: MarpExporter Component

**Files:**
- Create: `src/components/MarpExporter.jsx`

- [ ] **Step 1: Create `src/components/MarpExporter.jsx`**

```jsx
import { useState } from 'react'
import { generateContent } from '../lib/gemini'
import { MARP_PROMPT } from '../lib/prompts'

export function MarpExporter({ apiKey, topic, history, model }) {
  const [marpMd, setMarpMd] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await generateContent(apiKey, {
        systemPrompt: MARP_PROMPT,
        topic,
        history,
        model,
      })
      setMarpMd(result)
    } catch (err) {
      setError(err.message || '生成失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(marpMd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-6 mb-6">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-purple-700 disabled:opacity-40 transition"
      >
        {loading ? '生成中...' : '生成 Marp 簡報'}
      </button>

      {error && (
        <p className="text-red-600 text-xs mt-2">⚠️ {error}</p>
      )}

      {marpMd && (
        <div className="mt-4 relative">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-xs bg-white border border-gray-200 rounded px-2 py-1 hover:bg-gray-50"
          >
            {copied ? '已複製！' : '複製'}
          </button>
          <pre className="bg-gray-900 text-green-300 rounded-xl p-4 text-xs overflow-x-auto max-h-80 whitespace-pre-wrap">
            {marpMd}
          </pre>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MarpExporter.jsx
git commit -m "feat: add Marp exporter component"
```

---

## Task 11: App Integration

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`
- Modify: `index.html`

- [ ] **Step 1: Update `index.html` title**

Change `<title>` to `Dual-AI Arena`.

- [ ] **Step 2: Update `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 3: Replace `src/App.jsx`**

```jsx
import { useState, useRef } from 'react'
import { getApiKey, clearApiKey } from './lib/storage'
import { useDebateEngine } from './hooks/useDebateEngine'
import { ApiKeyModal } from './components/ApiKeyModal'
import { ConfigPanel } from './components/ConfigPanel'
import { DebateArena } from './components/DebateArena'
import { SynthesisCard } from './components/SynthesisCard'
import { MarpExporter } from './components/MarpExporter'
import { DEFAULT_MODEL } from './constants'

export default function App() {
  const [apiKey, setApiKey] = useState(() => getApiKey())
  const { phase, messages, synthesis, error, startDebate, reset } = useDebateEngine()
  const debateConfigRef = useRef({ topic: '', model: DEFAULT_MODEL, history: [] })

  const handleStart = ({ roleA, roleB, topic, rounds, model, autoMode }) => {
    debateConfigRef.current = { topic, model }
    startDebate({ apiKey, topic, roleA, roleB, rounds, model, autoMode })
  }

  const handleClearKey = () => {
    clearApiKey()
    setApiKey(null)
    reset()
  }

  const isRunning = phase === 'runningA' || phase === 'runningB' || phase === 'synthesis'

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {!apiKey && <ApiKeyModal onSave={setApiKey} />}

      <ConfigPanel
        onStart={handleStart}
        onClearKey={handleClearKey}
        disabled={isRunning}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <DebateArena messages={messages} phase={phase} error={error} />
        <SynthesisCard synthesis={synthesis} />
        {phase === 'finished' && (
          <MarpExporter
            apiKey={apiKey}
            topic={debateConfigRef.current.topic}
            history={messages.map((m) => ({ role: m.role, name: m.name, content: m.content }))}
            model={debateConfigRef.current.model}
          />
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Delete Vite boilerplate files**

```bash
rm src/App.css src/assets/react.svg
```
Remove the Vite logo import line from `index.html` if present.

- [ ] **Step 5: Run full test suite**

```bash
npm run test:run
```
Expected: all tests PASS

- [ ] **Step 6: Test in browser**

```bash
npm run dev
```

Golden path:
1. Open `http://localhost:5173/dual-ai-arena/` — API Key modal should appear
2. Enter a test key and save — modal closes
3. Set topic "AI 是否該取代人類工作？", keep defaults
4. Click 開始辯論 — messages should stream in alternating bubbles
5. After all rounds, synthesis card appears
6. Click 生成 Marp 簡報 — Marp markdown appears with copy button

- [ ] **Step 7: Commit**

```bash
git add src/App.jsx src/main.jsx index.html
git commit -m "feat: integrate all components into App"
```

---

## Task 12: GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

- [ ] **Step 2: Verify build passes locally**

```bash
npm run build
```
Expected: `dist/` folder created with `index.html` and assets. No errors.

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deploy to GitHub Pages"
git remote add origin https://github.com/<your-username>/dual-ai-arena.git
git push -u origin main
```

After push: visit GitHub → Settings → Pages → set source to `gh-pages` branch. Wait for Actions to complete, then open `https://<username>.github.io/dual-ai-arena/`.

---

## Self-Review Against Spec

| Spec Requirement | Covered by Task |
|---|---|
| API Key → localStorage, never sent to backend | Task 2, Task 6 |
| Role A/B name + system prompt editing | Task 7 |
| Debate topic input | Task 7 |
| Round count control (default 3) | Task 3, Task 7 |
| Model selector (Flash default / Pro) | Task 3, Task 7 |
| Auto/manual mode toggle | Task 7 |
| Full conversation history in each API call | Task 4, Task 5 |
| State machine Idle→RunningA→RunningB→Synthesis→Finished | Task 5 |
| Typewriter/streaming effect | Task 5, Task 8 |
| Google Search API grounding | Task 4 (`useSearch: true`) |
| Synthesis: 3-5 consensus + 3-5 conflict | Task 3 (SYNTHESIS_PROMPT format) |
| Markdown rendering | Task 8 (react-markdown in MessageBubble) |
| Marp generation (gaia theme) | Task 3, Task 10 |
| Marp preview + copy to clipboard | Task 10 |
| GitHub Pages deployment with base path | Task 1, Task 12 |
| Error display + no retry (error shown in UI) | Task 5, Task 8 |
