import type { Lang } from '../../types'

export type AssistantRole = 'user' | 'assistant'

export type AssistantMessage = {
  id: string
  role: AssistantRole
  content: string
  mode?: 'demo' | 'live'
  recovered?: boolean
}

export type AssistantRequest = {
  prompt: string
  lang: Lang
  history?: Pick<AssistantMessage, 'role' | 'content'>[]
  signal?: AbortSignal
}

export type AssistantReply = {
  content: string
  mode: 'demo' | 'live'
  recovered?: boolean
}
