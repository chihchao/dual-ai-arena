import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebateEngine } from './useDebateEngine'

// Mock gemini module
vi.mock('../lib/gemini', () => ({
  streamDebateTurn: vi.fn(),
  generateContent: vi.fn(),
}))

import { streamDebateTurn, generateContent } from '../lib/gemini'

async function* fakeStream(chunks) {
  for (const chunk of chunks) yield chunk
}

describe('useDebateEngine', () => {
  beforeEach(() => vi.clearAllMocks())

  it('starts in idle phase', () => {
    const { result } = renderHook(() => useDebateEngine())
    expect(result.current.phase).toBe('idle')
    expect(result.current.messages).toEqual([])
  })

  it('reset returns to idle and clears messages', async () => {
    streamDebateTurn.mockReturnValue(fakeStream(['hello']))
    generateContent.mockResolvedValue('## 共識\n- x\n\n## 分歧\n- y')

    const { result } = renderHook(() => useDebateEngine())

    await act(async () => {
      await result.current.startDebate({
        apiKey: 'key',
        topic: 'test',
        roleA: { name: 'Alpha', systemPrompt: 'sp-a' },
        roleB: { name: 'Omega', systemPrompt: 'sp-b' },
        rounds: 1,
        model: 'gemini-2.5-flash-preview-04-17',
        autoMode: true,
      })
    })

    act(() => result.current.reset())
    expect(result.current.phase).toBe('idle')
    expect(result.current.messages).toEqual([])
  })

  it('adds a message for Role A after first turn', async () => {
    streamDebateTurn.mockReturnValue(fakeStream(['AI is ', 'great']))
    generateContent.mockResolvedValue('## 共識\n- x\n\n## 分歧\n- y')

    const { result } = renderHook(() => useDebateEngine())

    await act(async () => {
      await result.current.startDebate({
        apiKey: 'key',
        topic: 'test',
        roleA: { name: 'Alpha', systemPrompt: 'sp-a' },
        roleB: { name: 'Omega', systemPrompt: 'sp-b' },
        rounds: 1,
        model: 'gemini-2.5-flash-preview-04-17',
        autoMode: true,
      })
    })

    const alphaMsg = result.current.messages.find((m) => m.role === 'A')
    expect(alphaMsg).toBeDefined()
    expect(alphaMsg.content).toContain('AI is great')
  })

  it('phase is finished after all rounds in autoMode', async () => {
    streamDebateTurn.mockReturnValue(fakeStream(['response']))
    generateContent.mockResolvedValue('## 共識\n- x\n\n## 分歧\n- y')

    const { result } = renderHook(() => useDebateEngine())

    await act(async () => {
      await result.current.startDebate({
        apiKey: 'key',
        topic: 'test',
        roleA: { name: 'Alpha', systemPrompt: 'sp-a' },
        roleB: { name: 'Omega', systemPrompt: 'sp-b' },
        rounds: 1,
        model: 'gemini-2.5-flash-preview-04-17',
        autoMode: true,
      })
    })

    expect(result.current.phase).toBe('finished')
  })
})
