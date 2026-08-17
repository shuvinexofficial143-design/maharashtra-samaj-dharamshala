import { nearbyPlaces, rooms, siteConfig } from '../../data/site'
import { getDemoAssistantResponse } from './demoAssistant'
import type { AssistantReply, AssistantRequest } from './types'

type AssistantFetcher = (input: string, init: RequestInit) => Promise<{ ok: boolean; json: () => Promise<unknown> }>

type AssistantDependencies = {
  endpoint?: string
  fetcher?: AssistantFetcher
}

function buildPublicContext() {
  return {
    property: siteConfig.businessName,
    location: siteConfig.location,
    rooms: rooms.map(room => ({ name: room.name.en, occupancy: room.occupancy, cooling: room.cooling.en, demoTariff: room.tariff })),
    nearbyPlaces: nearbyPlaces.map(place => place.name.en),
    demoBoundary: siteConfig.disclaimer,
  }
}

export function isLiveAssistantConfigured(endpoint = import.meta.env.VITE_AI_API_ENDPOINT): boolean {
  return Boolean(endpoint?.trim())
}

export async function getAssistantReply(request: AssistantRequest, dependencies: AssistantDependencies = {}): Promise<AssistantReply> {
  const demoReply = () => getDemoAssistantResponse(request.prompt, request.lang)
  const endpoint = dependencies.endpoint ?? import.meta.env.VITE_AI_API_ENDPOINT?.trim()
  const fetcher = dependencies.fetcher ?? fetch
  if (!endpoint) return { content: demoReply(), mode: 'demo' }

  try {
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lang: request.lang,
        messages: [...(request.history ?? []).slice(-8), { role: 'user', content: request.prompt.slice(0, 800) }],
        context: buildPublicContext(),
      }),
      signal: request.signal,
    })
    if (!response.ok) throw new Error('AI endpoint unavailable')
    const payload = await response.json() as { answer?: unknown }
    if (typeof payload.answer !== 'string' || !payload.answer.trim()) throw new Error('AI response was empty')
    return { content: payload.answer.trim(), mode: 'live' }
  } catch {
    return { content: demoReply(), mode: 'demo', recovered: true }
  }
}
