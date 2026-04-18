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
          <div className="bg-m3-error-container text-m3-error rounded-[20px] px-4 py-3 text-sm max-w-sm w-full text-center">
            {error}
          </div>
        )}

        {/* Character showcase */}
        <div className="flex items-center gap-10 sm:gap-20">
          <div className="p-3 sm:p-5 rounded-[20px] bg-m3-alpha-container">
            <AlphaAvatar className="w-16 h-16 sm:w-24 sm:h-24" />
          </div>

          <span className="text-3xl sm:text-5xl font-black text-m3-outline-variant tracking-tighter">VS</span>

          <div className="p-3 sm:p-5 rounded-[20px] bg-m3-omega-container">
            <OmegaAvatar className="w-16 h-16 sm:w-24 sm:h-24" />
          </div>
        </div>

        <p className="text-m3-secondary text-sm text-center leading-relaxed">
          設定論辯主題，讓兩位 AI 為你展開辯論
        </p>

        <button
          onClick={onOpenSettings}
          className="bg-m3-accent hover:bg-[#003380] active:bg-[#002870] text-white rounded-[20px] px-8 py-3 font-semibold text-sm sm:text-base transition-colors cursor-pointer shadow-md"
        >
          設定論辯主題
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {/* Centered max-width container for readability on large screens */}
      <div className="max-w-3xl mx-auto px-4 flex flex-col gap-6">
        {topic && (
          <div className="text-center py-2 border-b border-m3-outline-variant pb-4">
            <span className="text-xs text-m3-secondary uppercase tracking-wide">論辯主題</span>
            <p className="text-sm font-semibold text-m3-primary mt-1">{topic}</p>
          </div>
        )}

        {error && (
          <div className="bg-m3-error-container text-m3-error rounded-[20px] px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {phase === 'synthesis' && (
          <div className="text-center text-m3-secondary text-sm animate-pulse py-2">正在生成總結...</div>
        )}

        {(phase === 'researchA' || phase === 'researchB') && messages.length === (phase === 'researchB' ? 1 : 0) && (
          <div className="text-center text-m3-secondary text-sm animate-pulse py-2">正在搜尋主題相關資料...</div>
        )}

        {synthesis && (
          <div className="bg-m3-synth-container rounded-[28px] p-5">
            <h3 className="text-base font-semibold text-m3-on-synth mb-3">論辯總結</h3>
            <div className="prose prose-sm max-w-none text-m3-on-synth [--tw-prose-headings:theme(colors.m3-on-synth)] [--tw-prose-bold:theme(colors.m3-on-synth)]">
              <ReactMarkdown>{synthesis}</ReactMarkdown>
            </div>

            {phase === 'finished' && (
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handleExportMd}
                  className="bg-[#006A60] hover:bg-[#005550] active:bg-[#004840] text-white rounded-[16px] px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
                >
                  匯出 MD 記錄
                </button>
                <button
                  onClick={handleGenerateMarp}
                  disabled={marpLoading}
                  className="bg-[#6750A4] hover:bg-[#5B45A2] active:bg-[#503DA0] text-white rounded-[16px] px-4 py-2 text-sm font-semibold disabled:opacity-40 transition-colors cursor-pointer"
                >
                  {marpLoading ? '生成中...' : '生成 Marp 簡報'}
                </button>
              </div>
            )}

            {marpError && (
              <p className="text-m3-error text-xs mt-2">{marpError}</p>
            )}

            {marpMd && (
              <div className="mt-4 relative">
                <button
                  onClick={handleCopyMarp}
                  className="absolute top-2 right-2 text-xs bg-m3-surface border border-m3-outline-variant text-m3-secondary rounded-lg px-2 py-1 hover:bg-m3-surface-1 cursor-pointer transition-colors"
                >
                  {marpCopied ? '已複製！' : '複製'}
                </button>
                <pre className="bg-m3-surface border border-m3-outline-variant text-m3-primary font-mono rounded-[16px] p-4 text-xs overflow-x-auto max-h-80 whitespace-pre-wrap">
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
              className="bg-m3-accent hover:bg-[#003380] active:bg-[#002870] text-white rounded-[20px] px-8 py-3 font-semibold transition-colors shadow-md cursor-pointer"
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
