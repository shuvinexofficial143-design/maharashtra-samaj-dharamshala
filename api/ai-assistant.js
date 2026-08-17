const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions'

function loadLocalDevelopmentEnv() {
  if (process.env.GROQ_API_KEY || typeof process.loadEnvFile !== 'function') return
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'development') return

  try {
    process.loadEnvFile('.env.local')
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.error('Local AI environment could not be loaded:', error instanceof Error ? error.message : 'Unknown error')
    }
  }
}

function sendJson(response, status, payload) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(payload))
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  loadLocalDevelopmentEnv()
  const apiKey = process.env.GROQ_API_KEY
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
  if (!apiKey) {
    sendJson(response, 503, { error: 'Live AI is not configured. Demo mode remains available.' })
    return
  }

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body
    const lang = body?.lang === 'hi' ? 'Hindi with simple English terms where helpful' : 'clear Indian English'
    const messages = Array.isArray(body?.messages)
      ? body.messages.slice(-8).filter(message => (message?.role === 'user' || message?.role === 'assistant') && typeof message?.content === 'string').map(message => ({ role: message.role, content: message.content.slice(0, 800) }))
      : []
    if (!messages.length) {
      sendJson(response, 400, { error: 'A valid message is required.' })
      return
    }
    const context = JSON.stringify(body?.context ?? {}).slice(0, 5000)
    const system = `You are the AI Travel & Stay Guide for an unofficial presentation website concept. Reply in ${lang}. Use only the provided public demo context. Never claim live room inventory, official darshan timings, confirmed bookings, payments, or verified property facts. Clearly call tariffs and room information illustrative. Keep answers practical, warm, concise, and direct guests to management when confirmation is needed. Public demo context: ${context}`

    const groqResponse = await fetch(GROQ_CHAT_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, ...messages], temperature: 0.35, max_completion_tokens: 500 }),
    })
    if (!groqResponse.ok) {
      const providerBody = await groqResponse.text()
      console.error(`Groq request failed with HTTP ${groqResponse.status}: ${providerBody.slice(0, 500)}`)
      sendJson(response, 502, { error: 'Live AI provider request failed.' })
      return
    }
    const result = await groqResponse.json()
    const answer = result?.choices?.[0]?.message?.content
    if (typeof answer !== 'string' || !answer.trim()) {
      sendJson(response, 502, { error: 'Live AI returned an empty response.' })
      return
    }
    sendJson(response, 200, { answer: answer.trim() })
  } catch (error) {
    console.error('AI assistant request failed:', error instanceof Error ? error.message : 'Unknown error')
    sendJson(response, 500, { error: 'The AI request could not be completed.' })
  }
}
