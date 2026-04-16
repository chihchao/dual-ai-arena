import { describe, it, expect, beforeEach } from 'vitest'
import { getApiKey, setApiKey, clearApiKey } from './storage'

const KEY = 'gemini_api_key'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('getApiKey returns null when not set', () => {
    expect(getApiKey()).toBeNull()
  })

  it('setApiKey stores the key', () => {
    setApiKey('abc123')
    expect(localStorage.getItem(KEY)).toBe('abc123')
  })

  it('getApiKey returns stored key', () => {
    localStorage.setItem(KEY, 'mykey')
    expect(getApiKey()).toBe('mykey')
  })

  it('clearApiKey removes the key', () => {
    localStorage.setItem(KEY, 'mykey')
    clearApiKey()
    expect(localStorage.getItem(KEY)).toBeNull()
  })
})
