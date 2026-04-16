import { describe, it, expect } from 'vitest'
import { buildContextMessage } from './gemini'

describe('buildContextMessage', () => {
  it('returns just the topic when history is empty', () => {
    const result = buildContextMessage('AI 的未來', [])
    expect(result).toContain('AI 的未來')
  })

  it('includes previous messages formatted with speaker names', () => {
    const history = [
      { role: 'A', name: 'Alpha', content: 'AI is great' },
      { role: 'B', name: 'Omega', content: 'AI has risks' },
    ]
    const result = buildContextMessage('AI 的未來', history)
    expect(result).toContain('Alpha')
    expect(result).toContain('AI is great')
    expect(result).toContain('Omega')
    expect(result).toContain('AI has risks')
  })
})
