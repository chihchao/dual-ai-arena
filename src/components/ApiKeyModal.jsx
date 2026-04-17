import { useState } from 'react'
import { setApiKey } from '../lib/storage'

export function ApiKeyModal({ onSave }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    setApiKey(trimmed)
    onSave(trimmed)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 pb-safe">
      <div className="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-100">設定 Gemini API Key</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          API Key 僅儲存於本機瀏覽器，不會上傳至任何伺服器。
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="AIza..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
            autoFocus
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="bg-sky-600 hover:bg-sky-500 active:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 font-semibold text-sm transition-colors cursor-pointer"
          >
            儲存並開始
          </button>
        </form>
      </div>
    </div>
  )
}
