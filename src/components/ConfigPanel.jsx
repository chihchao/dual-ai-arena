import { useState } from 'react'
import { ROLE_A_DEFAULT, ROLE_B_DEFAULT } from '../lib/prompts'
import { DEFAULT_ROUNDS, DEFAULT_MODEL, DEFAULT_AUTO_MODE } from '../constants'

export function ConfigPanel({ onStart, onClearKey, disabled }) {
  const [roleA, setRoleA] = useState(ROLE_A_DEFAULT)
  const [roleB, setRoleB] = useState(ROLE_B_DEFAULT)
  const [topic, setTopic] = useState('')
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS)
  const [model, setModel] = useState(DEFAULT_MODEL)
  const [autoMode, setAutoMode] = useState(DEFAULT_AUTO_MODE)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    onStart({ roleA, roleB, topic: topic.trim(), rounds, model, autoMode })
  }

  return (
    <aside className="w-80 min-h-screen bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-4 overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-800">Dual-AI Arena ⚔️</h1>

      {/* Role A */}
      <section className="bg-white rounded-xl p-3 shadow-sm border border-blue-100">
        <label className="block text-xs font-semibold text-blue-600 mb-1">角色 A 名稱</label>
        <input
          className="w-full border rounded px-2 py-1 text-sm mb-2"
          value={roleA.name}
          onChange={(e) => setRoleA({ ...roleA, name: e.target.value })}
        />
        <label className="block text-xs font-semibold text-blue-600 mb-1">系統提示詞</label>
        <textarea
          className="w-full border rounded px-2 py-1 text-xs h-28 resize-none"
          value={roleA.systemPrompt}
          onChange={(e) => setRoleA({ ...roleA, systemPrompt: e.target.value })}
        />
      </section>

      {/* Role B */}
      <section className="bg-white rounded-xl p-3 shadow-sm border border-red-100">
        <label className="block text-xs font-semibold text-red-600 mb-1">角色 B 名稱</label>
        <input
          className="w-full border rounded px-2 py-1 text-sm mb-2"
          value={roleB.name}
          onChange={(e) => setRoleB({ ...roleB, name: e.target.value })}
        />
        <label className="block text-xs font-semibold text-red-600 mb-1">系統提示詞</label>
        <textarea
          className="w-full border rounded px-2 py-1 text-xs h-28 resize-none"
          value={roleB.systemPrompt}
          onChange={(e) => setRoleB({ ...roleB, systemPrompt: e.target.value })}
        />
      </section>

      {/* Flow controls */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">辯論主題</label>
          <textarea
            className="w-full border rounded px-2 py-1 text-sm h-16 resize-none"
            placeholder="例：SDD 流程是否值得導入？"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">回合數</label>
            <input
              type="number"
              min={1}
              max={10}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">模式</label>
            <select
              value={autoMode ? 'manual' : 'auto'}
              onChange={(e) => setAutoMode(e.target.value === 'auto')}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="manual">手動</option>
              <option value="auto">自動</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">模型</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="例：gemini-2.5-flash"
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !topic.trim()}
          className="bg-indigo-600 text-white rounded-lg py-2 font-semibold disabled:opacity-40 hover:bg-indigo-700 transition"
        >
          {disabled ? '辯論中...' : '開始辯論'}
        </button>
      </form>

      <button
        onClick={onClearKey}
        className="text-xs text-gray-400 hover:text-red-500 mt-auto"
      >
        清除 API Key
      </button>
    </aside>
  )
}
