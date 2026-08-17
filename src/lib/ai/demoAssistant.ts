import { nearbyPlaces, rooms, siteConfig } from '../../data/site'
import type { Lang } from '../../types'

const containsAny = (value: string, terms: string[]) => terms.some(term => value.includes(term))

export function getDemoAssistantResponse(prompt: string, lang: Lang): string {
  const query = prompt.toLocaleLowerCase(lang === 'hi' ? 'hi-IN' : 'en-IN')
  const familyRooms = rooms.filter(room => Number(room.occupancy) >= 4)
  const familyRoom = familyRooms[0] ?? rooms[0]

  if (containsAny(query, ['family', 'परिवार', 'बच्च', 'group', 'समूह'])) {
    return lang === 'hi'
      ? `इस demo में ${familyRoom.name.hi} परिवार के लिए उपयोगी विकल्प है। इसमें अधिकतम ${familyRoom.occupancy} अतिथियों की sample capacity दिखाई गई है। बड़ा समूह ${familyRooms.map(room => room.name.hi).join(' या ')} compare कर सकता है।\n\nये demo room details और tariffs हैं—वास्तविक availability तथा occupancy प्रबंधन से confirm करें।`
      : `In this demo, the ${familyRoom.name.en} is a practical family option with a sample capacity of up to ${familyRoom.occupancy} guests. Larger groups can compare ${familyRooms.map(room => room.name.en).join(' and ')}.\n\nRoom details and tariffs are illustrative; confirm real availability and occupancy with management.`
  }

  if (containsAny(query, ['book', 'request', 'बुक', 'अनुरोध', 'reserve'])) {
    return lang === 'hi'
      ? 'Booking page पर अपनी तारीखें और अतिथि संख्या चुनें, कक्ष category select करें, contact details review करें और demo request भेजें। इसके बाद एक MSD-DEMO reference मिलेगा। कोई online payment नहीं लिया जाता और वास्तविक booking केवल management confirmation के बाद होगी।'
      : 'On the Booking page, choose dates and guests, select a room category, review contact details and send the demo request. You will receive an MSD-DEMO reference. No online payment is collected, and a real booking would require management confirmation.'
  }

  if (containsAny(query, ['status', 'reference', 'next step', 'अगला', 'स्थिति', 'रेफरेंस'])) {
    return lang === 'hi'
      ? 'Request भेजने के बाद अपना MSD-DEMO reference copy करें और Booking Status page पर डालें। Demo status “Request Received”, “Awaiting Confirmation”, “Confirmed” या “Cancelled” दिखा सकता है। यात्रा तय करने से पहले management से वास्तविक पुष्टि लें।'
      : 'After sending the request, copy your MSD-DEMO reference and enter it on the Booking Status page. The demo can show Request Received, Awaiting Confirmation, Confirmed or Cancelled. Obtain real management confirmation before finalising travel.'
  }

  if (containsAny(query, ['temple', 'nearby', 'darshan', 'mandir', 'मंदिर', 'दर्शन', 'उज्जैन', 'ujjain'])) {
    const places = nearbyPlaces.slice(0, 5).map(place => place.name[lang]).join(', ')
    return lang === 'hi'
      ? `इस demo guide में ${places} जैसे स्थान शामिल हैं। यह itinerary planning context है—official timings, distances और darshan arrangements यात्रा से पहले आधिकारिक स्रोतों से verify करें।`
      : `The demo guide includes places such as ${places}. This is itinerary-planning context; verify official timings, distances and darshan arrangements before travelling.`
  }

  if (containsAny(query, ['management', 'admin', 'मैनेजमेंट', 'प्रबंधन', 'dashboard', 'review'])) {
    return lang === 'hi'
      ? 'Management room presentation, sample tariffs, booking journey, guest status tracking, editable presentation records, bilingual content और production-input checklist review कर सकता है। Admin Preview live operations system नहीं है और इसमें production authentication नहीं है।'
      : 'Management can review room presentation, sample tariffs, the booking journey, guest status tracking, editable presentation records, bilingual content and the production-input checklist. Admin Preview is not a live operations system and has no production authentication.'
  }

  if (containsAny(query, ['production', 'final website', 'live website', 'difference', 'अंतर', 'लाइव', 'final'])) {
    return lang === 'hi'
      ? 'Current demo visual direction और user journey दिखाता है। Final production version में verified property data, official photos, secure database, role-based admin access, real notifications और—approval मिलने पर—payment integration जोड़ी जा सकती है।'
      : 'The current demo presents the visual direction and user journey. A final production version can add verified property data, official photos, a secure database, role-based admin access, real notifications and—if approved—payment integration.'
  }

  if (containsAny(query, ['payment', 'pay', 'tariff', 'price', 'भुगतान', 'पेमेंट', 'किराया', 'टैरिफ'])) {
    return lang === 'hi'
      ? 'इस website concept में कोई real payment collect नहीं होता। सभी tariffs sample हैं। वास्तविक price, taxes, payment method और cancellation policy management से confirm करना आवश्यक है।'
      : 'This website concept does not collect real payment. All tariffs are samples. Real pricing, taxes, payment methods and cancellation terms must be confirmed by management.'
  }

  if (containsAny(query, ['contact', 'call', 'whatsapp', 'phone', 'संपर्क', 'कॉल', 'फ़ोन', 'फोन'])) {
    return lang === 'hi'
      ? `आप Contact page, Call button या WhatsApp से management guidance ले सकते हैं। Demo में दिखाया गया संपर्क ${siteConfig.phoneDisplay} है; publication से पहले ownership और permission confirm की जानी चाहिए।`
      : `You can use the Contact page, Call button or WhatsApp for management guidance. The demo currently shows ${siteConfig.phoneDisplay}; ownership and publishing permission should be confirmed.`
  }

  if (containsAny(query, ['room', 'stay', 'ac', 'non-ac', 'कक्ष', 'कमरा', 'ठहर'])) {
    return lang === 'hi'
      ? `Demo में ${rooms.map(room => room.name.hi).join(', ')} categories हैं। सही विकल्प group size, AC preference और sample budget पर निर्भर है। Rooms page पर comparison देखें; वास्तविक inventory management से confirm करें।`
      : `The demo includes ${rooms.map(room => room.name.en).join(', ')}. The right option depends on group size, cooling preference and sample budget. Compare them on the Rooms page and confirm real inventory with management.`
  }

  return lang === 'hi'
    ? 'मैं demo rooms, booking request, status tracking, आस-पास के स्थान, FAQ और management contact के बारे में सहायता कर सकता हूँ। नीचे कोई suggested question चुनें। यह AI demo guidance है—official travel या booking confirmation नहीं।'
    : 'I can help with demo rooms, booking requests, status tracking, nearby places, FAQs and management contact guidance. Choose a suggested question below. This is AI demo guidance, not official travel or booking confirmation.'
}
