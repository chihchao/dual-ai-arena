import { describe, it, expect } from 'vitest'
import { ROLE_A_DEFAULT, ROLE_B_DEFAULT, SYNTHESIS_PROMPT, MARP_PROMPT } from './prompts'

describe('prompts', () => {
  it('ROLE_A_DEFAULT contains Alpha', () => {
    expect(ROLE_A_DEFAULT.systemPrompt).toContain('Alpha')
  })

  it('ROLE_B_DEFAULT contains Omega', () => {
    expect(ROLE_B_DEFAULT.systemPrompt).toContain('Omega')
  })

  it('ROLE_A_DEFAULT has a name', () => {
    expect(ROLE_A_DEFAULT.name).toBe('Alpha')
  })

  it('ROLE_B_DEFAULT has a name', () => {
    expect(ROLE_B_DEFAULT.name).toBe('Omega')
  })

  it('SYNTHESIS_PROMPT is a non-empty string', () => {
    expect(typeof SYNTHESIS_PROMPT).toBe('string')
    expect(SYNTHESIS_PROMPT.length).toBeGreaterThan(0)
  })

  it('MARP_PROMPT mentions gaia theme', () => {
    expect(MARP_PROMPT).toContain('gaia')
  })
})
