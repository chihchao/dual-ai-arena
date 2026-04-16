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
