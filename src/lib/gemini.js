import { GoogleGenAI } from '@google/genai'

const RETRYABLE_CODES = [429, 503]
const MAX_RETRIES = 3

function isRetryable(err) {
  const code = err?.error?.code ?? err?.code
  return RETRYABLE_CODES.includes(code)
}

async function withRetry(fn) {
  let delay = 5000
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt < MAX_RETRIES && isRetryable(err)) {
        await new Promise((r) => setTimeout(r, delay))
        delay *= 2
      } else {
        throw err
      }
    }
  }
}

/**
 * Builds the user message content string for a debate turn.
 * @param {string} topic
 * @param {Array<{role: 'A'|'B', name: string, content: string}>} history
 * @returns {string}
 */
export function buildContextMessage(topic, history) {
  let msg = `辯論主題：${topic}\n\n`
  if (history.length === 0) {
    msg += '請開始你的論述。'
  } else {
    msg += '以下是目前的辯論紀錄：\n\n'
    for (const entry of history) {
      msg += `【${entry.name}】\n${entry.content}\n\n`
    }
    msg += '請針對對方的論點繼續你的回應。'
  }
  return msg
}

/**
 * Streams a single debate turn from the Gemini API.
 * @param {string} apiKey
 * @param {{ systemPrompt: string, topic: string, history: Array, model: string, useSearch?: boolean }} opts
 * @yields {string} text chunks
 */
export async function* streamDebateTurn(apiKey, { systemPrompt, topic, history, model, useSearch = true }) {
  const ai = new GoogleGenAI({ apiKey })
  const userMessage = buildContextMessage(topic, history)

  const config = {
    systemInstruction: systemPrompt,
  }
  if (useSearch) {
    config.tools = [{ googleSearch: {} }]
  }

  const response = await withRetry(() =>
    ai.models.generateContentStream({
      model,
      config,
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    })
  )

  for await (const chunk of response) {
    const text = chunk.text
    if (text) yield text
  }
}

/**
 * Non-streaming call for synthesis and Marp generation.
 * @param {string} apiKey
 * @param {{ systemPrompt: string, topic: string, history: Array, model: string }} opts
 * @returns {Promise<string>}
 */
export async function generateContent(apiKey, { systemPrompt, topic, history, model }) {
  const ai = new GoogleGenAI({ apiKey })
  const userMessage = buildContextMessage(topic, history)

  const response = await withRetry(() =>
    ai.models.generateContent({
      model,
      config: { systemInstruction: systemPrompt },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    })
  )

  return response.text
}
