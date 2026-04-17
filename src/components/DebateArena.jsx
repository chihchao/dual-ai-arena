import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { MessageBubble } from './MessageBubble'
import { AlphaAvatar, OmegaAvatar } from './CharacterAvatar'
import { generateContent } from '../lib/gemini'
import { MARP_PROMPT } from '../lib/prompts'

export function DebateArena({ messages, phase, error, synthesis, waitingForContinue, continueReason, onContinue, onOpenSettings, apiKey, topic, model }) {
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
      lines.push(`## 論辯總結\n`)
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
      <div className="flex-1 flex flex-col items-center justify-center gap-8 sm:gap-10 px-6 py-12">
        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-400 rounded-xl px-4 py-3 text-sm max-w-sm w-full text-center">
            {error}
          </div>
        )}

        {/* Character showcase */}
        <div className="flex items-center gap-10 sm:gap-20">
          <div className="p-3 sm:p-5 rounded-2xl bg-sky-950/40 border border-sky-900/60">
            <AlphaAvatar className="w-16 h-16 sm:w-24 sm:h-24" />
          </div>

          <span className="text-3xl sm:text-5xl font-black text-slate-700 tracking-tighter">VS</span>

          <div className="p-3 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-900/60">
            <OmegaAvatar className="w-16 h-16 sm:w-24 sm:h-24" />
          </div>
        </div>

        <p className="text-slate-500 text-sm text-center leading-relaxed">
          設定論辯主題，讓兩位 AI 為你展開辯論
        </p>

        <button
          onClick={onOpenSettings}
          className="bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white rounded-xl px-8 py-3 font-semibold text-sm sm:text-base transition-colors cursor-pointer shadow-lg shadow-sky-900/30"
        >
          設定論辯主題
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {/* Centered max-width container for readability on large screens */}
      <div className="max-w-3xl mx-auto px-4 flex flex-col gap-4">
        {topic && (
          <div className="text-center py-2 border-b border-slate-800 pb-4">
            <span className="text-xs text-slate-500 uppercase tracking-wide">論辯主題</span>
            <p className="text-sm font-semibold text-slate-300 mt-1">{topic}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-400 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {phase === 'synthesis' && (
          <div className="text-center text-slate-500 text-sm animate-pulse py-2">正在生成總結...</div>
        )}

        {(phase === 'researchA' || phase === 'researchB') && messages.length === (phase === 'researchB' ? 1 : 0) && (
          <div className="text-center text-slate-500 text-sm animate-pulse py-2">正在搜尋主題相關資料...</div>
        )}

        {synthesis && (
          <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-800/50 rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-indigo-300 mb-3">論辯總結</h3>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{synthesis}</ReactMarkdown>
            </div>

            {phase === 'finished' && (
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handleExportMd}
                  className="bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
                >
                  匯出 MD 記錄
                </button>
                <button
                  onClick={handleGenerateMarp}
                  disabled={marpLoading}
                  className="bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40 transition-colors cursor-pointer"
                >
                  {marpLoading ? '生成中...' : '生成 Marp 簡報'}
                </button>
              </div>
            )}

            {marpError && (
              <p className="text-red-400 text-xs mt-2">{marpError}</p>
            )}

            {marpMd && (
              <div className="mt-4 relative">
                <button
                  onClick={handleCopyMarp}
                  className="absolute top-2 right-2 text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded px-2 py-1 hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  {marpCopied ? '已複製！' : '複製'}
                </button>
                <pre className="bg-slate-950 text-green-400 rounded-xl p-4 text-xs overflow-x-auto max-h-80 whitespace-pre-wrap border border-slate-800">
                  {marpMd}
                </pre>
              </div>
            )}
          </div>
        )}

        {waitingForContinue && (
          <div className="flex justify-center py-4">
            <button
              onClick={onContinue}
              className="bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white rounded-xl px-8 py-3 font-semibold transition-colors shadow-lg cursor-pointer"
            >
              {continueReason === 'retry' ? '稍待繼續' : '繼續下一輪 →'}
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
