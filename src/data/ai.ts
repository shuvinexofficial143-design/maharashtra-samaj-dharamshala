import type { LocalText } from '../types'

export type AssistantPrompt = {
  id: string
  label: LocalText
  prompt: LocalText
}

export const assistantPrompts: AssistantPrompt[] = [
  {
    id: 'family',
    label: { hi: 'परिवार के लिए कक्ष', en: 'Room for a family' },
    prompt: { hi: 'परिवार के लिए कौन-सा कक्ष बेहतर रहेगा?', en: 'Which room is best for a family?' },
  },
  {
    id: 'booking',
    label: { hi: 'बुकिंग कैसे करें', en: 'How to book' },
    prompt: { hi: 'मैं booking request कैसे भेजूँ?', en: 'How do I send a booking request?' },
  },
  {
    id: 'nearby',
    label: { hi: 'आस-पास के मंदिर', en: 'Nearby temples' },
    prompt: { hi: 'डेमो में कौन-से आस-पास के मंदिर शामिल हैं?', en: 'Which nearby temples are included?' },
  },
  {
    id: 'status',
    label: { hi: 'बुकिंग स्थिति देखें', en: 'Check booking status' },
    prompt: { hi: 'मैं अपना booking status कैसे देखूँ?', en: 'How can I check my booking status?' },
  },
  {
    id: 'management',
    label: { hi: 'Management preview', en: 'Management preview' },
    prompt: { hi: 'Management इस demo में क्या review कर सकता है?', en: 'What can management review in the demo?' },
  },
  {
    id: 'production',
    label: { hi: 'Demo और production', en: 'Demo vs production' },
    prompt: { hi: 'Demo और final production website का अंतर समझाएँ।', en: 'Explain the difference between the demo and final production website.' },
  },
]
