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
