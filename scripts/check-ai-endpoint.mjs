const endpoint = 'https://maharashtra-samaj-dharamshala.vercel.app/api/ai-assistant'

const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lang: 'en',
    messages: [{ role: 'user', content: 'Is the room information illustrative?' }],
    context: {
      property: 'Maharashtra Samaj Dharamshala',
      demoBoundary: 'Demo/client presentation only.',
    },
  }),
})

const payload = await response.json().catch(() => ({}))
const answerPresent = typeof payload.answer === 'string' && payload.answer.trim().length > 0
console.log(`status=${response.status}`)
console.log(`answer-present=${answerPresent}`)
if (!response.ok && typeof payload.error === 'string') console.log(`api-error=${payload.error}`)
process.exitCode = response.ok && answerPresent ? 0 : 1
