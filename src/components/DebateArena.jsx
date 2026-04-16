import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'

export function DebateArena({ messages, phase, error }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
      <div ref={bottomRef} />
    </div>
  )
}
