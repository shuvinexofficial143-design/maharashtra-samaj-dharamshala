import { describe, expect, it, vi } from 'vitest'
import { getDemoAssistantResponse } from './demoAssistant'
import { getAssistantReply } from './assistantService'

describe('AI assistant foundation', () => {
  it('uses site-aware demo guidance for family rooms', () => {
    expect(getDemoAssistantResponse('Which room is best for a family?', 'en')).toContain('Family Room')
  })

  it('returns bilingual booking guidance', () => {
    expect(getDemoAssistantResponse('मैं booking कैसे करूँ?', 'hi')).toContain('Booking page')
    expect(getDemoAssistantResponse('How do I book?', 'en')).toContain('MSD-DEMO')
  })

  it('uses a configured live proxy when it succeeds', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ answer: 'Live assistant answer' }) })
    await expect(getAssistantReply({ prompt: 'Help', lang: 'en' }, { endpoint: '/api/ai-assistant', fetcher })).resolves.toEqual({ content: 'Live assistant answer', mode: 'live' })
  })

  it('falls back to demo guidance when the live proxy fails', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('network unavailable'))
    const reply = await getAssistantReply({ prompt: 'Which room is best for a family?', lang: 'en' }, { endpoint: '/api/ai-assistant', fetcher })
    expect(reply.mode).toBe('demo')
    expect(reply.recovered).toBe(true)
    expect(reply.content).toContain('Family Room')
  })
})
