import { AssistantExperience } from '../components/ai/AssistantExperience'
import { PageMeta } from '../components/Shared'
import { useLanguage } from '../context/LanguageContext'

export function AIAssistantPage() {
  const { lang } = useLanguage()

  return <div className="ai-page">
    <PageMeta title={lang === 'hi' ? 'AI यात्रा सहायक' : 'AI Travel Assistant'} />
    <AssistantExperience />
  </div>
}
