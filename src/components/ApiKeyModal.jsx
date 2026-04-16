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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">設定 Gemini API Key</h2>
        <p className="text-gray-500 text-sm mb-6">
          API Key 僅儲存於本機瀏覽器，不會上傳至任何伺服器。
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="AIza..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="bg-blue-600 text-white rounded-lg py-2 font-semibold disabled:opacity-40 hover:bg-blue-700 transition"
          >
            儲存並開始
          </button>
        </form>
      </div>
    </div>
  )
}
