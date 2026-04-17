import { useState } from 'react'
import { ROLE_A_DEFAULT, ROLE_B_DEFAULT } from '../lib/prompts'
import { DEFAULT_ROUNDS, DEFAULT_MODEL, DEFAULT_AUTO_MODE, DEFAULT_USE_RESEARCH } from '../constants'
import { AlphaAvatar, OmegaAvatar } from './CharacterAvatar'

export function ConfigPanel({ open, onClose, onStart, onClearKey, disabled }) {
  const [roleA, setRoleA] = useState(ROLE_A_DEFAULT)
  const [roleB, setRoleB] = useState(ROLE_B_DEFAULT)
  const [topic, setTopic] = useState('')
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS)
  const [model, setModel] = useState(DEFAULT_MODEL)
  const [autoMode, setAutoMode] = useState(DEFAULT_AUTO_MODE)
  const [useResearch, setUseResearch] = useState(DEFAULT_USE_RESEARCH)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    onStart({ roleA, roleB, topic: topic.trim(), rounds, model, autoMode, useResearch })
  }

  if (!open) return null

  const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none transition-colors'
  const focusSky = 'focus:border-sky-500'
  const focusAmber = 'focus:border-amber-500'

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center sm:px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={disabled ? undefined : onClose}
      />

      {/* Dialog — wider on desktop to support 2-column roles */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto flex flex-col shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 flex items-center justify-between px-5 py-4 z-10">
          <h2 className="text-base font-bold text-slate-100">論辯設定</h2>
          {!disabled && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200 cursor-pointer"
              aria-label="關閉設定"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="4" y1="4" x2="14" y2="14" />
                <line x1="14" y1="4" x2="4" y2="14" />
              </svg>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 pb-8">

          {/* Topic — full width */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
              論辯主題
            </label>
            <textarea
              className={`${inputCls} ${focusSky} h-20 resize-none rounded-xl px-3 py-3 placeholder-slate-500`}
              placeholder="例：SDD 流程是否值得導入？或「針對新創公司要不要導入微服務架構展開論辯」"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              autoFocus
            />
          </div>

          {/* Roles — 1 col mobile / 2 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Role A */}
            <div className="bg-slate-800/50 border border-sky-900/50 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlphaAvatar className="w-7 h-7 flex-shrink-0" />
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">角色 A</span>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">名稱</label>
                <input
                  className={`${inputCls} ${focusSky}`}
                  value={roleA.name}
                  onChange={(e) => setRoleA({ ...roleA, name: e.target.value })}
                  placeholder="角色名稱"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">系統提示詞</label>
                <textarea
                  className={`${inputCls} ${focusSky} h-36 resize-none text-xs text-slate-300`}
                  value={roleA.systemPrompt}
                  onChange={(e) => setRoleA({ ...roleA, systemPrompt: e.target.value })}
                />
              </div>
            </div>

            {/* Role B */}
            <div className="bg-slate-800/50 border border-amber-900/50 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <OmegaAvatar className="w-7 h-7 flex-shrink-0" />
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">角色 B</span>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">名稱</label>
                <input
                  className={`${inputCls} ${focusAmber}`}
                  value={roleB.name}
                  onChange={(e) => setRoleB({ ...roleB, name: e.target.value })}
                  placeholder="角色名稱"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">系統提示詞</label>
                <textarea
                  className={`${inputCls} ${focusAmber} h-36 resize-none text-xs text-slate-300`}
                  value={roleB.systemPrompt}
                  onChange={(e) => setRoleB({ ...roleB, systemPrompt: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Options — 2 col mobile / 4 col desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">回合數</label>
              <input
                type="number"
                min={1}
                max={10}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className={`${inputCls} ${focusSky}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">進行模式</label>
              <select
                value={autoMode ? 'auto' : 'manual'}
                onChange={(e) => setAutoMode(e.target.value === 'auto')}
                className={`${inputCls} ${focusSky}`}
              >
                <option value="manual">手動</option>
                <option value="auto">自動</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">開場研究</label>
              <select
                value={useResearch ? 'on' : 'off'}
                onChange={(e) => setUseResearch(e.target.value === 'on')}
                className={`${inputCls} ${focusSky}`}
              >
                <option value="off">關閉</option>
                <option value="on">開啟</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">模型</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className={`${inputCls} ${focusSky}`}
                placeholder="gemini-2.5-flash"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={disabled || !topic.trim()}
            className="w-full bg-sky-600 hover:bg-sky-500 active:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 font-semibold text-sm transition-colors cursor-pointer mt-1"
          >
            {disabled ? '論辯進行中...' : '開始論辯'}
          </button>

          <button
            type="button"
            onClick={onClearKey}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            清除 API Key
          </button>
        </form>
      </div>
    </div>
  )
}
