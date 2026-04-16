import { useState, useCallback, useRef } from 'react'
import { streamDebateTurn, generateContent } from '../lib/gemini'
import { SYNTHESIS_PROMPT } from '../lib/prompts'

export function useDebateEngine() {
  const [phase, setPhase] = useState('idle')
  const [messages, setMessages] = useState([])
  const [synthesis, setSynthesis] = useState(null)
  const [error, setError] = useState(null)
  const historyRef = useRef([])

  const runTurn = useCallback(async (role, name, systemPrompt, topic, apiKey, model) => {
    let accumulated = ''
    const msgId = crypto.randomUUID()
    setMessages((prev) => [...prev, { role, name, content: '', id: msgId, streaming: true }])

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

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, streaming: false } : m))
    )

    historyRef.current = [...historyRef.current, { role, name, content: accumulated }]
    return accumulated
  }, [])

  const startDebate = useCallback(async ({ apiKey, topic, roleA, roleB, rounds, model, autoMode }) => {
    setError(null)
    setSynthesis(null)
    setMessages([])
    historyRef.current = []

    try {
      for (let round = 0; round < rounds; round++) {
        setPhase('runningA')
        await runTurn('A', roleA.name, roleA.systemPrompt, topic, apiKey, model)

        setPhase('runningB')
        await runTurn('B', roleB.name, roleB.systemPrompt, topic, apiKey, model)
      }

      setPhase('synthesis')
      const summaryText = await generateContent(apiKey, {
        systemPrompt: SYNTHESIS_PROMPT,
        topic,
        history: historyRef.current,
        model,
      })
      setSynthesis(summaryText)
      setPhase('finished')
    } catch (err) {
      setError(err.message || '發生未知錯誤')
      setPhase('idle')
    }
  }, [])

  const reset = useCallback(() => {
    setPhase('idle')
    setMessages([])
    setSynthesis(null)
    setError(null)
    historyRef.current = []
  }, [])

  return { phase, messages, synthesis, error, startDebate, reset }
}
