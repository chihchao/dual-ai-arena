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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 pb-safe">
      <div className="bg-m3-surface rounded-t-[28px] sm:rounded-[28px] w-full max-w-md shadow-xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-[14px] bg-m3-alpha-container flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#001D3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-m3-primary">設定 Gemini API Key</h2>
        </div>
        <p className="text-m3-secondary text-sm mb-6">
          API Key 僅儲存於本機瀏覽器，不會上傳至任何伺服器。
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="AIza..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-m3-bg border border-m3-outline-variant focus:border-m3-accent rounded-xl px-4 py-3 text-sm text-m3-primary placeholder-m3-outline outline-none transition-colors"
            autoFocus
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="bg-m3-accent hover:bg-[#003380] active:bg-[#002870] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-[20px] py-3 font-semibold text-sm transition-colors cursor-pointer"
          >
            儲存並開始
          </button>
        </form>
      </div>
    </div>
  )
}
