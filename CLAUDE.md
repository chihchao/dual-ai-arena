# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dual-AI Arena** is a pure front-end web app where two AI personas (Role A & Role B) debate a user-defined topic using the Google Gemini API. The app runs entirely client-side — no backend, no server.

## Tech Stack

- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **AI SDK**: `@google/genai` (Gemini 2.5 series models)
- **Deployment**: GitHub Pages via GitHub Actions
- **Storage**: Browser `localStorage` (API key only)
- **Search**: Google Search API grounding (used in both research phase and debate turns)

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build locally
```

Vite must be configured with `base: '/dual-ai-arena/'` for GitHub Pages.

## Architecture

### State Machine
`idle → researchA → researchB → runningA → runningB → synthesis → finished`

Research phases are optional (controlled by `useResearch` flag). Each debate turn streams tokens to the UI. Synthesis is non-streaming.

### Context Management
`buildContextMessage()` in `src/lib/gemini.js` constructs the user message for each turn, embedding the full conversation history from `historyRef` so each AI has context of all prior messages.

### Retry Logic
`withRetry()` in `useDebateEngine` auto-retries up to 5 times with exponential backoff (starting at 3s, max 60s) for 429/503 errors. After exhausting retries it pauses and shows a "稍待繼續" button for the user.

### Key Files

| File | Responsibility |
|------|---------------|
| `src/App.jsx` | Root — API key gate, settings open/close, `isRunning` guard |
| `src/hooks/useDebateEngine.js` | Core state machine, retry logic, streaming orchestration |
| `src/lib/gemini.js` | `streamDebateTurn`, `streamResearchTurn`, `generateContent`, `buildContextMessage` |
| `src/lib/prompts.js` | Default system prompts for Role A/B, synthesis, Marp, research |
| `src/lib/storage.js` | `getApiKey` / `clearApiKey` (localStorage) |
| `src/constants.js` | `MODELS`, `DEFAULT_MODEL`, `DEFAULT_ROUNDS`, `DEFAULT_AUTO_MODE`, `DEFAULT_USE_RESEARCH` |
| `src/components/ConfigPanel.jsx` | Settings modal (roles, topic, rounds, model, mode, research toggle) |
| `src/components/DebateArena.jsx` | Message stream, synthesis card, Marp generation, MD export |
| `src/components/MessageBubble.jsx` | Single message — supports `type: 'research'` variant with search icon badge |
| `src/components/CharacterAvatar.jsx` | SVG avatars — `AlphaAvatar` (blue/sky) and `OmegaAvatar` (amber) |
| `src/components/ApiKeyModal.jsx` | API key entry modal |

> `SynthesisCard.jsx` and `MarpExporter.jsx` exist as files but synthesis/Marp UI is currently inline in `DebateArena.jsx`.

### Available Models (`src/constants.js`)
- `gemini-2.5-flash-lite` — default
- `gemini-2.5-flash`
- `gemini-2.5-pro`

Model field in ConfigPanel is a free-text input (not a dropdown) to allow using any model ID.

### Default System Prompts (`src/lib/prompts.js`)

**Role A (Alpha — 支持方)**: Argue in favor of the topic; rebut opponent's latest point; ~500 words per turn.

**Role B (Omega — 反對方)**: Argue against the topic; challenge assumptions and risks; ~500 words per turn.

**Synthesis**: Output structured Markdown with `## 共識 (Consensus)` and `## 分歧 (Conflict)` sections.

**Marp**: Generate Marp Markdown with `theme: gaia`; output code only, no explanations.

**Research**: Use Google Search grounding to gather facts, data, and examples before the debate.

## Deployment

GitHub Actions workflow (`deploy.yml`) builds and pushes to `gh-pages` branch. Vite `base` must match `/dual-ai-arena/`.

## Non-functional Requirements

- Markdown rendering via `react-markdown` in all message bubbles and synthesis
- API errors show in-UI messages; retryable errors (429/503) auto-retry before prompting user
- API key never leaves the browser
