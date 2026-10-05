import { nearbyPlaces, rooms, siteConfig } from '../../data/site'
import type { Lang } from '../../types'

const containsAny = (value: string, terms: string[]) => terms.some(term => value.includes(term))

export function getDemoAssistantResponse(prompt: string, lang: Lang): string {
  const query = prompt.toLocaleLowerCase(lang === 'hi' ? 'hi-IN' : 'en-IN')
  const familyRooms = rooms.filter(room => Number(room.occupancy) >= 4)
  const familyRoom = familyRooms[0] ?? rooms[0]

  if (containsAny(query, ['family', 'परिवार', 'बच्च', 'group', 'समूह'])) {
    return lang === 'hi'
      ? `परिवार के लिए ${familyRoom.name.hi} उपयोगी विकल्प है। इसमें अधिकतम ${familyRoom.occupancy} अतिथियों की क्षमता दिखाई गई है। बड़ा समूह ${familyRooms.map(room => room.name.hi).join(' या ')} compare कर सकता है।\n\nचुनी तारीखों की उपलब्धता और अंतिम टैरिफ booking request के साथ confirm करें।`
      : `The ${familyRoom.name.en} is a practical family option with capacity for up to ${familyRoom.occupancy} guests. Larger groups can compare ${familyRooms.map(room => room.name.en).join(' and ')}.\n\nConfirm availability for your dates and the final tariff with the booking request.`
  }

  if (containsAny(query, ['book', 'request', 'बुक', 'अनुरोध', 'reserve'])) {
    return lang === 'hi'
      ? 'Booking page पर अपनी तारीखें और अतिथि संख्या चुनें, कक्ष category select करें, contact details review करें और booking request तैयार करें। इसके बाद एक MSD reference मिलेगा। इस flow में online payment नहीं लिया जाता और अंतिम room confirmation availability review के बाद होती है।'
      : 'On the Booking page, choose dates and guests, select a room category, review contact details and create your booking request. You will receive an MSD reference. No online payment is collected here, and final room confirmation follows an availability review.'
  }

  if (containsAny(query, ['status', 'reference', 'next step', 'अगला', 'स्थिति', 'रेफरेंस'])) {
    return lang === 'hi'
      ? 'Request बनाने के बाद अपना MSD reference copy करें और Booking Status page पर डालें। वहाँ request की जानकारी और status दोबारा देखा जा सकता है। यात्रा तय करने से पहले अंतिम room confirmation जरूर लें।'
      : 'After creating the request, copy your MSD reference and enter it on the Booking Status page. You can reopen the request details and status there. Obtain final room confirmation before finalising travel.'
  }

  if (containsAny(query, ['temple', 'nearby', 'darshan', 'mandir', 'मंदिर', 'दर्शन', 'उज्जैन', 'ujjain'])) {
    const places = nearbyPlaces.slice(0, 5).map(place => place.name[lang]).join(', ')
    return lang === 'hi'
      ? `इस यात्रा guide में ${places} जैसे स्थान शामिल हैं। Official timings, distances और darshan arrangements यात्रा से पहले आधिकारिक स्रोतों से verify करें।`
      : `The travel guide includes places such as ${places}. Verify official timings, distances and darshan arrangements before travelling.`
  }

  if (containsAny(query, ['management', 'admin', 'मैनेजमेंट', 'प्रबंधन', 'dashboard', 'review'])) {
    return lang === 'hi'
      ? 'Rooms, booking journey, status tracking, bilingual content और contact options इस website experience के मुख्य हिस्से हैं।'
      : 'Rooms, the booking journey, status tracking, bilingual content and direct contact options are the main parts of this website experience.'
  }

  if (containsAny(query, ['production', 'final website', 'live website', 'difference', 'अंतर', 'लाइव', 'final'])) {
    return lang === 'hi'
      ? 'Website room discovery, stay requests, status tracking, Ujjain guidance और direct contact को एक जगह जोड़ती है। अंतिम room allocation और payment details confirmation के समय तय होते हैं।'
      : 'The website brings room discovery, stay requests, status tracking, Ujjain guidance and direct contact into one experience. Final room allocation and payment details are handled at confirmation.'
  }

  if (containsAny(query, ['payment', 'pay', 'tariff', 'price', 'भुगतान', 'पेमेंट', 'किराया', 'टैरिफ'])) {
    return lang === 'hi'
      ? 'इस booking flow में online payment collect नहीं होता। अंतिम price, taxes, payment method और cancellation terms confirmation के समय check करें।'
      : 'This website concept does not collect real payment. All tariffs are samples. Real pricing, taxes, payment methods and cancellation terms must be confirmed by management.'
  }

  if (containsAny(query, ['contact', 'call', 'whatsapp', 'phone', 'संपर्क', 'कॉल', 'फ़ोन', 'फोन'])) {
    return lang === 'hi'
      ? `आप Contact page, Call button या WhatsApp से सीधे सहायता ले सकते हैं। संपर्क नंबर ${siteConfig.phoneDisplay} है।`
      : `You can use the Contact page, Call button or WhatsApp for direct assistance. The contact number shown is ${siteConfig.phoneDisplay}.`
  }

  if (containsAny(query, ['room', 'stay', 'ac', 'non-ac', 'कक्ष', 'कमरा', 'ठहर'])) {
    return lang === 'hi'
      ? `उपलब्ध room categories में ${rooms.map(room => room.name.hi).join(', ')} शामिल हैं। सही विकल्प group size, AC preference और budget पर निर्भर है। Rooms page पर comparison देखें और चुनी तारीखों की availability confirm करें।`
      : `Room categories include ${rooms.map(room => room.name.en).join(', ')}. The right option depends on group size, cooling preference and budget. Compare them on the Rooms page and confirm availability for your dates.`
  }

  return lang === 'hi'
    ? 'मैं rooms, booking request, status tracking, आस-पास के स्थान, FAQ और contact options के बारे में सहायता कर सकता हूँ। नीचे कोई suggested question चुनें। अंतिम booking confirmation और official travel timings संबंधित authority से confirm करें।'
    : 'I can help with rooms, booking requests, status tracking, nearby places, FAQs and contact options. Choose a suggested question below. Confirm final room availability and official travel timings with the relevant authority.'
}
