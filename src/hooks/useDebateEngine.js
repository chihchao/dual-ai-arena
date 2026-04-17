import { useState, useCallback, useRef } from 'react'
import { streamDebateTurn, streamResearchTurn, generateContent, isRetryable } from '../lib/gemini'
import { SYNTHESIS_PROMPT, RESEARCH_PROMPT } from '../lib/prompts'

const MAX_AUTO_RETRIES = 5

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

export function useDebateEngine() {
  const [phase, setPhase] = useState('idle')
  const [messages, setMessages] = useState([])
  const [synthesis, setSynthesis] = useState(null)
  const [error, setError] = useState(null)
  const [waitingForContinue, setWaitingForContinue] = useState(false)
  const [continueReason, setContinueReason] = useState(null) // 'manual' | 'retry'
  const historyRef = useRef([])
  const continueResolverRef = useRef(null)

  const waitForUser = useCallback((reason) => {
    setContinueReason(reason)
    setWaitingForContinue(true)
    return new Promise((resolve) => {
      continueResolverRef.current = resolve
    })
  }, [])

  const continueDebate = useCallback(() => {
    setWaitingForContinue(false)
    setContinueReason(null)
    continueResolverRef.current?.()
  }, [])

  // Runs a single API call with up to MAX_AUTO_RETRIES auto-retries (exponential backoff).
  // After exhausting retries, pauses and waits for the user to click "稍待繼續".
  const withRetry = useCallback(async (fn) => {
    let delay = 3000
    for (let attempt = 0; ; attempt++) {
      try {
        return await fn()
      } catch (err) {
        if (!isRetryable(err)) throw err
        if (attempt < MAX_AUTO_RETRIES) {
          await sleep(delay)
          delay = Math.min(delay * 2, 60000)
        } else {
          // Exhausted auto-retries — wait for user
          await waitForUser('retry')
          delay = 3000 // reset backoff after user resumes
          attempt = -1  // restart retry counter (will become 0 after ++)
        }
      }
    }
  }, [waitForUser])

  const runResearch = useCallback(async (role, name, topic, apiKey, model) => {
    let accumulated = ''
    const msgId = crypto.randomUUID()
    setMessages((prev) => [
      ...prev,
      { role, name, content: '', id: msgId, type: 'research', streaming: true },
    ])

    try {
      for await (const chunk of streamResearchTurn(apiKey, {
        systemPrompt: RESEARCH_PROMPT,
        topic,
        model,
      })) {
        accumulated += chunk
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, content: accumulated } : m))
        )
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== msgId))
      throw err
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, streaming: false } : m))
    )
    return accumulated
  }, [])

  const runTurn = useCallback(async (role, name, systemPrompt, topic, apiKey, model) => {
    let accumulated = ''
    const msgId = crypto.randomUUID()
    setMessages((prev) => [...prev, { role, name, content: '', id: msgId, streaming: true }])

    try {
      for await (const chunk of streamDebateTurn(apiKey, {
        systemPrompt,
        topic,
        history: historyRef.current,
        model,
        useSearch: true,
      })) {
        accumulated += chunk
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, content: accumulated } : m))
        )
      }
    } catch (err) {
      // Remove the partial message so retry starts clean
      setMessages((prev) => prev.filter((m) => m.id !== msgId))
      throw err
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, streaming: false } : m))
    )

    historyRef.current = [...historyRef.current, { role, name, content: accumulated }]
    return accumulated
  }, [])

  const startDebate = useCallback(async ({ apiKey, topic, roleA, roleB, rounds, model, autoMode, useResearch }) => {
    setError(null)
    setSynthesis(null)
    setMessages([])
    historyRef.current = []

    try {
      let promptA = roleA.systemPrompt
      let promptB = roleB.systemPrompt

      if (useResearch) {
        setPhase('researchA')
        const researchA = await withRetry(() => runResearch('A', roleA.name, topic, apiKey, model))

        setPhase('researchB')
        const researchB = await withRetry(() => runResearch('B', roleB.name, topic, apiKey, model))

        promptA = `${roleA.systemPrompt}\n\n## 你對本主題的搜尋研究摘要\n${researchA}`
        promptB = `${roleB.systemPrompt}\n\n## 你對本主題的搜尋研究摘要\n${researchB}`
      }

      for (let round = 0; round < rounds; round++) {
        setPhase('runningA')
        await withRetry(() => runTurn('A', roleA.name, promptA, topic, apiKey, model))

        if (!autoMode) await waitForUser('manual')

        setPhase('runningB')
        await withRetry(() => runTurn('B', roleB.name, promptB, topic, apiKey, model))

        if (!autoMode && round < rounds - 1) await waitForUser('manual')
      }

      setPhase('synthesis')
      const summaryText = await withRetry(() =>
        generateContent(apiKey, {
          systemPrompt: SYNTHESIS_PROMPT,
          topic,
          history: historyRef.current,
          model,
        })
      )
      setSynthesis(summaryText)
      setPhase('finished')
    } catch (err) {
      setError(err.message || '發生未知錯誤')
      setPhase('idle')
    }
  }, [runTurn, withRetry, waitForUser])

  const reset = useCallback(() => {
    setPhase('idle')
    setMessages([])
    setSynthesis(null)
    setError(null)
    setWaitingForContinue(false)
    setContinueReason(null)
    historyRef.current = []
  }, [])

  return { phase, messages, synthesis, error, waitingForContinue, continueReason, continueDebate, startDebate, reset }
}
