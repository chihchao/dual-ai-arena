import { GoogleGenAI } from '@google/genai'
import { ROLE_SUGGESTION_PROMPT } from './prompts'

export function isRetryable(err) {
  const code = err?.error?.code ?? err?.code
  if ([429, 503].includes(code)) return true
  const msg = err?.message ?? ''
  return msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429') || msg.includes('Resource has been exhausted')
}

/**
 * Builds the user message content string for a debate turn.
 * @param {string} topic
 * @param {Array<{role: 'A'|'B', name: string, content: string}>} history
 * @returns {string}
 */
export function buildContextMessage(topic, history) {
  let msg = `討論情境：${topic}\n\n`
  if (history.length === 0) {
    msg += '請針對此情境，直接提出你的核心立場與第一個論點。約 500 字，不做背景說明，直接陳述你的觀點。'
  } else {
    msg += '以下是目前的論辯紀錄：\n\n'
    for (const entry of history) {
      msg += `【${entry.name}】\n${entry.content}\n\n`
    }
    msg += '請從你的立場出發，針對對方剛才的論點提出明確反駁，並強化你自己的主張。約 500 字，直接切入反駁，不做摘要或總結。'
  }
  return msg
}

/**
 * Streams a pre-debate research turn for a role, using Google Search grounding.
 * @param {string} apiKey
 * @param {{ systemPrompt: string, topic: string, model: string }} opts
 * @yields {string} text chunks
 */
export async function* streamResearchTurn(apiKey, { systemPrompt, topic, model }) {
  const ai = new GoogleGenAI({ apiKey })
  const prompt = `討論情境：${topic}\n\n請使用搜尋工具查詢此情境相關的最新資訊，並整理出重要的事實、數據、案例與各方觀點，作為你後續論辯的事實依據。`

  const response = await ai.models.generateContentStream({
    model,
    config: {
      systemInstruction: systemPrompt,
      tools: [{ googleSearch: {} }],
    },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  })

  for await (const chunk of response) {
    const text = chunk.text
    if (text) yield text
  }
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

  const config = { systemInstruction: systemPrompt }
  if (useSearch) {
    config.tools = [{ googleSearch: {} }]
  }

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
  })

  for await (const chunk of response) {
    const text = chunk.text
    if (text) yield text
  }
}

function buildReviewMessage(topic, history) {
  let msg = `討論情境：${topic}\n\n以下是完整的論辯紀錄：\n\n`
  for (const entry of history) {
    msg += `【${entry.name}】\n${entry.content}\n\n`
  }
  return msg
}

/**
 * Generates opposing role suggestions for a given debate topic.
 * @param {string} apiKey
 * @param {{ topic: string, model: string }} opts
 * @returns {Promise<{ roleA: { name: string, systemPrompt: string }, roleB: { name: string, systemPrompt: string } }>}
 */
export async function generateRoleSuggestions(apiKey, { topic, model }) {
  const ai = new GoogleGenAI({ apiKey })
  const response = await ai.models.generateContent({
    model,
    config: { systemInstruction: ROLE_SUGGESTION_PROMPT },
    contents: [{ role: 'user', parts: [{ text: `論辯主題：${topic}` }] }],
  })
  const raw = response.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const parsed = JSON.parse(raw)
  if (!parsed.roleA?.name || !parsed.roleA?.systemPrompt || !parsed.roleB?.name || !parsed.roleB?.systemPrompt) {
    throw new Error('AI 回傳格式不正確')
  }
  return parsed
}

/**
 * Non-streaming call for synthesis and Marp generation.
 * @param {string} apiKey
 * @param {{ systemPrompt: string, topic: string, history: Array, model: string }} opts
 * @returns {Promise<string>}
 */
export async function generateContent(apiKey, { systemPrompt, topic, history, model }) {
  const ai = new GoogleGenAI({ apiKey })
  const userMessage = buildReviewMessage(topic, history)

  const response = await ai.models.generateContent({
    model,
    config: { systemInstruction: systemPrompt },
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
  })

  return response.text
}
