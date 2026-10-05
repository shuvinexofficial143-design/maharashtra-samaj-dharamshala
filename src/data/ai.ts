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
    prompt: { hi: 'आस-पास कौन-से प्रमुख मंदिर और स्थान हैं?', en: 'Which major temples and places are nearby?' },
  },
  {
    id: 'status',
    label: { hi: 'बुकिंग स्थिति देखें', en: 'Check booking status' },
    prompt: { hi: 'मैं अपना booking status कैसे देखूँ?', en: 'How can I check my booking status?' },
  },
  {
    id: 'payment',
    label: { hi: 'भुगतान और पुष्टि', en: 'Payment & confirmation' },
    prompt: { hi: 'बुकिंग की पुष्टि और भुगतान कैसे होगा?', en: 'How do booking confirmation and payment work?' },
  },
  {
    id: 'contact',
    label: { hi: 'संपर्क सहायता', en: 'Contact support' },
    prompt: { hi: 'मुझे प्रबंधन से सीधे संपर्क करना है।', en: 'I want to contact management directly.' },
  },
]
