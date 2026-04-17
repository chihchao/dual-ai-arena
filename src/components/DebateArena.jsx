import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { MessageBubble } from './MessageBubble'
import { generateContent } from '../lib/gemini'
import { MARP_PROMPT } from '../lib/prompts'

export function DebateArena({ messages, phase, error, synthesis, waitingForContinue, continueReason, onContinue, apiKey, topic, model }) {
  const bottomRef = useRef(null)
  const [marpMd, setMarpMd] = useState('')
  const [marpLoading, setMarpLoading] = useState(false)
  const [marpCopied, setMarpCopied] = useState(false)
  const [marpError, setMarpError] = useState(null)

  const handleExportMd = () => {
    const lines = []
    if (topic) lines.push(`# ${topic}\n`)
    messages.forEach((m) => {
      lines.push(`## ${m.name || m.role}\n`)
      lines.push(`${m.content}\n`)
    })
    if (synthesis) {
      lines.push(`## 辯論總結\n`)
      lines.push(`${synthesis}\n`)
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${topic || 'debate'}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleGenerateMarp = async () => {
    setMarpLoading(true)
    setMarpError(null)
    try {
      const history = messages.map((m) => ({ role: m.role, name: m.name, content: m.content }))
      const result = await generateContent(apiKey, { systemPrompt: MARP_PROMPT, topic, history, model })
      setMarpMd(result)
    } catch (err) {
      setMarpError(err.message || '生成失敗')
    } finally {
      setMarpLoading(false)
    }
  }

  const handleCopyMarp = async () => {
    await navigator.clipboard.writeText(marpMd)
    setMarpCopied(true)
    setTimeout(() => setMarpCopied(false), 2000)
  }

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

      {(phase === 'researchA' || phase === 'researchB') && messages.length === (phase === 'researchB' ? 1 : 0) && (
        <div className="text-center text-gray-400 text-sm animate-pulse">正在搜尋主題相關資料...</div>
      )}

      {synthesis && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-indigo-800 mb-3">辯論總結</h3>
          <div className="prose prose-sm prose-indigo max-w-none">
            <ReactMarkdown>{synthesis}</ReactMarkdown>
          </div>

          {phase === 'finished' && (
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleExportMd}
                className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-emerald-700 transition"
              >
                匯出 MD 記錄
              </button>
              <button
                onClick={handleGenerateMarp}
                disabled={marpLoading}
                className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-purple-700 disabled:opacity-40 transition"
              >
                {marpLoading ? '生成中...' : '生成 Marp 簡報'}
              </button>
            </div>
          )}

          {marpError && (
            <p className="text-red-600 text-xs mt-2">⚠️ {marpError}</p>
          )}

          {marpMd && (
            <div className="mt-4 relative">
              <button
                onClick={handleCopyMarp}
                className="absolute top-2 right-2 text-xs bg-white border border-gray-200 rounded px-2 py-1 hover:bg-gray-50"
              >
                {marpCopied ? '已複製！' : '複製'}
              </button>
              <pre className="bg-gray-900 text-green-300 rounded-xl p-4 text-xs overflow-x-auto max-h-80 whitespace-pre-wrap">
                {marpMd}
              </pre>
            </div>
          )}
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
