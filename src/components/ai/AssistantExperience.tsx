import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Bot, CircleAlert, RefreshCw, Send, ShieldCheck, Sparkles, Trash2, UserRound } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { assistantPrompts } from '../../data/ai'
import { getAssistantReply, isLiveAssistantConfigured } from '../../lib/ai/assistantService'
import type { AssistantMessage } from '../../lib/ai/types'

function welcomeMessage(lang: 'hi' | 'en'): AssistantMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    mode: 'demo',
    content: lang === 'hi'
      ? 'नमस्ते! कमरे, booking, उज्जैन यात्रा या request status के बारे में पूछिए।'
      : 'Namaste! Ask me about rooms, booking, your Ujjain visit or request status.',
  }
}

export function AssistantExperience() {
  const { lang, setLang } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const requestedPrompt = assistantPrompts.find(item => item.id === searchParams.get('prompt'))
  const [input, setInput] = useState(() => requestedPrompt?.prompt[lang] ?? '')
  const [messages, setMessages] = useState<AssistantMessage[]>(() => [welcomeMessage(lang)])
  const [busy, setBusy] = useState(false)
  const [lastPrompt, setLastPrompt] = useState('')
  const conversationRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const followLatestMessage = useRef(true)
  const sequence = useRef(0)
  const liveConfigured = isLiveAssistantConfigured()
  const lastReply = [...messages].reverse().find(message => message.role === 'assistant')
  const recovered = Boolean(lastReply?.recovered)
  const activeMode = liveConfigured && !recovered ? 'live' : 'demo'

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }, [input])

  const scrollConversationToBottom = useCallback(() => {
    const conversation = conversationRef.current
    if (!conversation) return
    conversation.scrollTop = conversation.scrollHeight
  }, [])

  useEffect(() => {
    followLatestMessage.current = true
    const frame = window.requestAnimationFrame(scrollConversationToBottom)
    return () => window.cancelAnimationFrame(frame)
  }, [messages, busy, scrollConversationToBottom])

  useEffect(() => {
    const conversation = conversationRef.current
    if (!conversation || typeof ResizeObserver === 'undefined') return

    let frame = 0
    const preserveLatestAnchor = () => {
      if (!followLatestMessage.current) return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(scrollConversationToBottom)
    }
    const observer = new ResizeObserver(preserveLatestAnchor)
    observer.observe(conversation)
    const messageList = conversation.querySelector('.ai-conversation__messages')
    if (messageList) observer.observe(messageList)
    window.visualViewport?.addEventListener('resize', preserveLatestAnchor)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.visualViewport?.removeEventListener('resize', preserveLatestAnchor)
    }
  }, [scrollConversationToBottom])

  function suspendConversationFollow() {
    followLatestMessage.current = false
  }

  async function sendPrompt(prompt: string) {
    const cleaned = prompt.trim().slice(0, 800)
    if (!cleaned || busy) return

    const userMessage: AssistantMessage = { id: `user-${++sequence.current}`, role: 'user', content: cleaned }
    const history = messages.map(message => ({ role: message.role, content: message.id === 'welcome' ? welcomeMessage(lang).content : message.content }))
    setMessages(current => [...current, userMessage])
    setInput('')
    setLastPrompt(cleaned)
    setBusy(true)

    try {
      const reply = await getAssistantReply({ prompt: cleaned, lang, history })
      setMessages(current => [...current, { id: `assistant-${++sequence.current}`, role: 'assistant', ...reply }])
    } catch {
      setMessages(current => [...current, {
        id: `assistant-${++sequence.current}`,
        role: 'assistant',
        mode: 'demo',
        recovered: liveConfigured,
        content: lang === 'hi'
          ? 'अभी उत्तर नहीं मिल सका। कृपया दोबारा कोशिश करें या नीचे दिए quick prompt में से एक चुनें।'
          : 'I could not answer just now. Please retry or choose one of the quick prompts below.',
      }])
    } finally {
      setBusy(false)
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    void sendPrompt(input)
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void sendPrompt(input)
    }
  }

  function resetConversation() {
    setMessages([welcomeMessage(lang)])
    setInput('')
    setLastPrompt('')
    textareaRef.current?.focus()
  }

  function goBack() {
    if (location.key === 'default') navigate('/')
    else navigate(-1)
  }

  return <div className="ai-experience">
    <header className="ai-app-bar">
      <button className="ai-app-bar__icon" type="button" onClick={goBack} aria-label={lang === 'hi' ? 'वापस जाएँ' : 'Go back'}>
        <ArrowLeft />
      </button>
      <div className="ai-app-bar__identity">
        <span aria-hidden="true"><Bot /></span>
        <div><h1>{lang === 'hi' ? 'AI यात्रा सहायक' : 'AI Travel Assistant'}</h1><p>{lang === 'hi' ? 'Stay · Booking · Ujjain' : 'Stay · Booking · Ujjain'}</p></div>
      </div>
      <div className="ai-app-bar__actions">
        <span className={`ai-status ai-status--${activeMode}`} role="status" aria-label={activeMode === 'live' ? 'Live AI active' : 'Assistant ready'}>
          <i />{activeMode === 'live' ? 'Live AI' : recovered ? (lang === 'hi' ? 'ऑफलाइन सहायता' : 'Offline guidance') : (lang === 'hi' ? 'AI सहायक' : 'AI Assistant')}
        </span>
        <div className="ai-language" aria-label={lang === 'hi' ? 'भाषा चुनें' : 'Choose language'}>
          <button type="button" className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')} aria-label="हिन्दी">हि</button>
          <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')} aria-label="English">EN</button>
        </div>
        <button className="ai-app-bar__clear" type="button" onClick={resetConversation} disabled={busy} aria-label={lang === 'hi' ? 'नई बातचीत शुरू करें' : 'Start a new chat'}>
          <Trash2 /><span>{lang === 'hi' ? 'नई चैट' : 'New chat'}</span>
        </button>
      </div>
    </header>

    <section className="ai-conversation" ref={conversationRef} onPointerDown={suspendConversationFollow} onTouchStart={suspendConversationFollow} onWheel={suspendConversationFollow} aria-live="polite" aria-busy={busy} aria-label={lang === 'hi' ? 'AI बातचीत' : 'AI conversation'} tabIndex={0}>
      <div className="ai-conversation__inner">
        <div className="ai-conversation__messages">
          {messages.map(message => <article className={`ai-message ai-message--${message.role}`} key={message.id}>
            <span className="ai-message__avatar" aria-hidden="true">{message.role === 'assistant' ? <Bot /> : <UserRound />}</span>
            <div className="ai-message__content">
              <small>{message.role === 'assistant' ? (lang === 'hi' ? 'AI यात्रा सहायक' : 'AI Travel Assistant') : (lang === 'hi' ? 'आप' : 'You')}</small>
              <p>{message.id === 'welcome' ? welcomeMessage(lang).content : message.content}</p>
              {message.role === 'assistant' && message.id !== 'welcome' && <em>{message.mode === 'live' ? 'Live AI' : message.recovered ? (lang === 'hi' ? 'ऑफलाइन सहायता' : 'Offline guidance') : (lang === 'hi' ? 'वेबसाइट सहायक' : 'Website assistant')}</em>}
            </div>
          </article>)}
          {busy && <article className="ai-message ai-message--assistant ai-message--typing" role="status">
            <span className="ai-message__avatar" aria-hidden="true"><Bot /></span>
            <div className="ai-message__content"><small>{lang === 'hi' ? 'उत्तर तैयार हो रहा है' : 'Preparing an answer'}</small><p aria-label={lang === 'hi' ? 'सहायक सोच रहा है' : 'Assistant is thinking'}><i /><i /><i /></p></div>
          </article>}
        </div>
      </div>
    </section>

    <div className="ai-chat-controls">
        {recovered && <div className="ai-fallback-note" role="status">
          <CircleAlert />
          <span><strong>{lang === 'hi' ? 'Live AI उपलब्ध नहीं था' : 'Live AI was unavailable'}</strong>{lang === 'hi' ? 'वेबसाइट की उपलब्ध जानकारी से उत्तर दिखाया गया।' : 'An answer was shown using the website information available.'}</span>
          <button type="button" disabled={busy || !lastPrompt} onClick={() => void sendPrompt(lastPrompt)}><RefreshCw />{lang === 'hi' ? 'फिर कोशिश' : 'Retry'}</button>
        </div>}

        <section className="ai-suggestions" aria-label={lang === 'hi' ? 'Quick prompts' : 'Quick prompts'}>
          <div>{assistantPrompts.map(item => <button type="button" key={item.id} disabled={busy} onClick={() => void sendPrompt(item.prompt[lang])}>
            <Sparkles />{item.label[lang]}
          </button>)}</div>
        </section>

        <form className="ai-composer" onSubmit={submit}>
          <label className="ai-composer__label" htmlFor="ai-question">{lang === 'hi' ? 'अपना प्रश्न लिखें' : 'Ask a stay or travel question'}</label>
          <div className="ai-composer__field">
            <textarea ref={textareaRef} id="ai-question" rows={1} maxLength={800} value={input} disabled={busy} onChange={event => setInput(event.target.value)} onKeyDown={handleComposerKeyDown} placeholder={lang === 'hi' ? 'अपना प्रश्न लिखें…' : 'Type your question…'} />
            <button type="submit" disabled={busy || !input.trim()} aria-label={lang === 'hi' ? 'प्रश्न भेजें' : 'Send question'}><Send /></button>
          </div>
          <div className="ai-composer__meta"><small>{lang === 'hi' ? 'Enter भेजें · Shift + Enter नई line' : 'Enter to send · Shift + Enter for a new line'}</small><small>{input.length}/800</small></div>
        </form>

        <p className="ai-honesty"><ShieldCheck />{lang === 'hi' ? 'सामान्य AI guidance—official advice, live room availability या booking confirmation नहीं।' : 'General AI guidance—not official advice, live room availability or booking confirmation.'}</p>
    </div>
  </div>
}
