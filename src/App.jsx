import { useState, useRef, useEffect } from 'react'
import { getApiKey, clearApiKey } from './lib/storage'
import { useDebateEngine } from './hooks/useDebateEngine'
import { ApiKeyModal } from './components/ApiKeyModal'
import { ConfigPanel } from './components/ConfigPanel'
import { DebateArena } from './components/DebateArena'
import { DEFAULT_MODEL } from './constants'

const VISITED_KEY = 'dual_arena_visited'

export default function App() {
  const [apiKey, setApiKey] = useState(() => getApiKey())
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    if (apiKey && !localStorage.getItem(VISITED_KEY)) {
      setSettingsOpen(true)
    }
  }, [apiKey])
  const {
    phase, messages, synthesis, error,
    waitingForContinue, continueReason, continueDebate,
    startDebate, reset,
  } = useDebateEngine()
  const debateConfigRef = useRef({ topic: '', model: DEFAULT_MODEL })

  const handleStart = ({ roleA, roleB, topic, rounds, model, autoMode, useResearch }) => {
    localStorage.setItem(VISITED_KEY, '1')
    debateConfigRef.current = { topic, model }
    startDebate({ apiKey, topic, roleA, roleB, rounds, model, autoMode, useResearch })
    setSettingsOpen(false)
  }

  const handleClearKey = () => {
    clearApiKey()
    setApiKey(null)
    reset()
  }

  const isRunning = ['researchA', 'researchB', 'runningA', 'runningB', 'synthesis'].includes(phase)

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 flex flex-col">
      {!apiKey && <ApiKeyModal onSave={setApiKey} />}

      <ConfigPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onStart={handleStart}
        onClearKey={handleClearKey}
        disabled={isRunning || waitingForContinue}
      />

      <header className="sticky top-0 z-10 h-14 bg-slate-900/95 backdrop-blur border-b border-slate-800 flex items-center px-4 gap-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14.5 2L9 7.5 3 9l4 4-1 5 5-2.5L16 20l1-6 4-3.5-5.5-1z" />
        </svg>
        <h1 className="font-bold text-base flex-1 tracking-tight">Dual-AI Arena</h1>
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-slate-400 hover:text-slate-200"
          aria-label="開啟設定"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        <DebateArena
          messages={messages}
          phase={phase}
          error={error}
          synthesis={synthesis}
          waitingForContinue={waitingForContinue}
          continueReason={continueReason}
          onContinue={continueDebate}
          onOpenSettings={() => setSettingsOpen(true)}
          apiKey={apiKey}
          topic={debateConfigRef.current.topic}
          model={debateConfigRef.current.model}
        />
      </main>
    </div>
  )
}
