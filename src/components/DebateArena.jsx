import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { MessageBubble } from './MessageBubble'

export function DebateArena({ messages, phase, error, synthesis, waitingForContinue, continueReason, onContinue }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, synthesis, waitingForContinue])

  if (phase === 'idle') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm max-w-md">
            ⚠️ {error}
          </div>
        )}
        <span className="text-gray-400 text-lg">設定左側參數後，點擊「開始辯論」</span>
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

      {synthesis && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-indigo-800 mb-3">辯論總結</h3>
          <div className="prose prose-sm prose-indigo max-w-none">
            <ReactMarkdown>{synthesis}</ReactMarkdown>
          </div>
        </div>
      )}

      {waitingForContinue && (
        <div className="flex justify-center py-2">
          <button
            onClick={onContinue}
            className="bg-indigo-600 text-white rounded-lg px-8 py-2.5 font-semibold hover:bg-indigo-700 transition shadow"
          >
            {continueReason === 'retry' ? '稍待繼續' : '繼續下一輪 →'}
          </button>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
