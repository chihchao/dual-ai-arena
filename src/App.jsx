import { useState, useRef } from 'react'
import { getApiKey, clearApiKey } from './lib/storage'
import { useDebateEngine } from './hooks/useDebateEngine'
import { ApiKeyModal } from './components/ApiKeyModal'
import { ConfigPanel } from './components/ConfigPanel'
import { DebateArena } from './components/DebateArena'
import { DEFAULT_MODEL } from './constants'

export default function App() {
  const [apiKey, setApiKey] = useState(() => getApiKey())
  const {
    phase, messages, synthesis, error,
    waitingForContinue, continueReason, continueDebate,
    startDebate, reset,
  } = useDebateEngine()
  const debateConfigRef = useRef({ topic: '', model: DEFAULT_MODEL })

  const handleStart = ({ roleA, roleB, topic, rounds, model, autoMode }) => {
    debateConfigRef.current = { topic, model }
    startDebate({ apiKey, topic, roleA, roleB, rounds, model, autoMode })
  }

  const handleClearKey = () => {
    clearApiKey()
    setApiKey(null)
    reset()
  }

  const isRunning = ['researchA', 'researchB', 'runningA', 'runningB', 'synthesis'].includes(phase)

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {!apiKey && <ApiKeyModal onSave={setApiKey} />}

      <ConfigPanel
        onStart={handleStart}
        onClearKey={handleClearKey}
        disabled={isRunning || waitingForContinue}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <DebateArena
          messages={messages}
          phase={phase}
          error={error}
          synthesis={synthesis}
          waitingForContinue={waitingForContinue}
          continueReason={continueReason}
          onContinue={continueDebate}
          apiKey={apiKey}
          topic={debateConfigRef.current.topic}
          model={debateConfigRef.current.model}
        />
      </main>
    </div>
  )
}
