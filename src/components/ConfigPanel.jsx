import { useState } from 'react'
import { ROLE_A_DEFAULT, ROLE_B_DEFAULT } from '../lib/prompts'
import { DEFAULT_ROUNDS, DEFAULT_MODEL, DEFAULT_AUTO_MODE, DEFAULT_USE_RESEARCH } from '../constants'
import { AlphaAvatar, OmegaAvatar } from './CharacterAvatar'
import { generateRoleSuggestions } from '../lib/gemini'

export function ConfigPanel({ open, onClose, onStart, onClearKey, disabled, apiKey }) {
  const [roleA, setRoleA] = useState(ROLE_A_DEFAULT)
  const [roleB, setRoleB] = useState(ROLE_B_DEFAULT)
  const [topic, setTopic] = useState('')
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS)
  const [model, setModel] = useState(DEFAULT_MODEL)
  const [autoMode, setAutoMode] = useState(DEFAULT_AUTO_MODE)
  const [useResearch, setUseResearch] = useState(DEFAULT_USE_RESEARCH)
  const [suggesting, setSuggesting] = useState(false)
  const [suggestError, setSuggestError] = useState(null)

  const handleSuggest = async () => {
    setSuggesting(true)
    setSuggestError(null)
    try {
      const result = await generateRoleSuggestions(apiKey, { topic: topic.trim(), model })
      setRoleA(result.roleA)
      setRoleB(result.roleB)
    } catch (err) {
      setSuggestError(err.message || 'AI 建議失敗')
    } finally {
      setSuggesting(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    onStart({ roleA, roleB, topic: topic.trim(), rounds, model, autoMode, useResearch })
  }

  if (!open) return null

  const inputCls = 'w-full bg-m3-bg border border-m3-outline-variant rounded-xl px-3 py-2.5 text-base leading-relaxed text-m3-primary outline-none transition-colors placeholder-m3-outline'
  const focusAccent = 'focus:border-m3-accent'

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center sm:px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={disabled ? undefined : onClose}
      />

      {/* M3 Dialog — wider on desktop to support 2-column roles */}
      <div className="relative bg-m3-surface rounded-t-[28px] sm:rounded-[28px] w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto flex flex-col shadow-xl">

        {/* Header */}
        <div className="sticky top-0 bg-m3-surface border-b border-m3-outline-variant flex items-center justify-between px-5 py-4 z-10">
          <h2 className="text-lg font-semibold text-m3-primary">論辯設定</h2>
          {!disabled && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-m3-surface-1 transition-colors text-m3-secondary hover:text-m3-primary cursor-pointer"
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
            <label className="block text-sm font-medium text-m3-secondary mb-2 uppercase tracking-wide">
              論辯主題
            </label>
            <textarea
              className={`${inputCls} ${focusAccent} h-20 resize-none px-3 py-3`}
              placeholder="例：SDD 流程是否值得導入？或「針對新創公司要不要導入微服務架構展開論辯」"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              autoFocus
            />
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={handleSuggest}
                disabled={!topic.trim() || suggesting || disabled}
                className="bg-m3-surface-1 hover:bg-m3-surface-2 active:bg-m3-alpha-container disabled:opacity-40 disabled:cursor-not-allowed text-m3-accent border border-m3-outline-variant rounded-[16px] px-4 py-2 text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
                {suggesting ? 'AI 思考中...' : 'AI 建議角色提示詞'}
              </button>
              {suggestError && (
                <span className="text-sm text-m3-error">{suggestError}</span>
              )}
            </div>
          </div>

          {/* Roles — 1 col mobile / 2 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Role A */}
            <div className="bg-m3-alpha-container/40 rounded-[20px] p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlphaAvatar className="w-7 h-7 flex-shrink-0" />
                <span className="text-xs font-semibold text-m3-on-alpha uppercase tracking-wide">角色 A</span>
              </div>
              <div>
                <label className="block text-sm text-m3-secondary mb-1">名稱</label>
                <input
                  className={`${inputCls} ${focusAccent}`}
                  value={roleA.name}
                  onChange={(e) => setRoleA({ ...roleA, name: e.target.value })}
                  placeholder="角色名稱"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-m3-secondary mb-1">系統提示詞</label>
                <textarea
                  className={`${inputCls} ${focusAccent} h-40 resize-none text-sm leading-relaxed`}
                  value={roleA.systemPrompt}
                  onChange={(e) => setRoleA({ ...roleA, systemPrompt: e.target.value })}
                />
              </div>
            </div>

            {/* Role B */}
            <div className="bg-m3-omega-container/40 rounded-[20px] p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <OmegaAvatar className="w-7 h-7 flex-shrink-0" />
                <span className="text-xs font-semibold text-m3-on-omega uppercase tracking-wide">角色 B</span>
              </div>
              <div>
                <label className="block text-sm text-m3-secondary mb-1">名稱</label>
                <input
                  className={`${inputCls} ${focusAccent}`}
                  value={roleB.name}
                  onChange={(e) => setRoleB({ ...roleB, name: e.target.value })}
                  placeholder="角色名稱"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-m3-secondary mb-1">系統提示詞</label>
                <textarea
                  className={`${inputCls} ${focusAccent} h-40 resize-none text-sm leading-relaxed`}
                  value={roleB.systemPrompt}
                  onChange={(e) => setRoleB({ ...roleB, systemPrompt: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Options — 2 col mobile / 4 col desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium text-m3-secondary mb-2">回合數</label>
              <input
                type="number"
                min={1}
                max={10}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className={`${inputCls} ${focusAccent}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-m3-secondary mb-2">進行模式</label>
              <select
                value={autoMode ? 'auto' : 'manual'}
                onChange={(e) => setAutoMode(e.target.value === 'auto')}
                className={`${inputCls} ${focusAccent}`}
              >
                <option value="manual">手動</option>
                <option value="auto">自動</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-m3-secondary mb-2">開場研究</label>
              <select
                value={useResearch ? 'on' : 'off'}
                onChange={(e) => setUseResearch(e.target.value === 'on')}
                className={`${inputCls} ${focusAccent}`}
              >
                <option value="off">關閉</option>
                <option value="on">開啟</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-m3-secondary mb-2">模型</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className={`${inputCls} ${focusAccent}`}
                placeholder="gemini-2.5-flash"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={disabled || !topic.trim()}
            className="w-full bg-m3-accent hover:bg-[#003380] active:bg-[#002870] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-[20px] py-3.5 font-semibold text-base transition-colors cursor-pointer mt-1"
          >
            {disabled ? '論辯進行中...' : '開始論辯'}
          </button>

          <button
            type="button"
            onClick={onClearKey}
            className="text-xs text-m3-outline hover:text-m3-error transition-colors cursor-pointer"
          >
            清除 API Key
          </button>
        </form>
      </div>
    </div>
  )
}
