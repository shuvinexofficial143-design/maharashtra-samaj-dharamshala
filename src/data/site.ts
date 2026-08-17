import type { LocalText, Room } from '../types'

const mapQuery = 'Maharashtra Samaj Dharamshala Ujjain'

export const siteConfig = {
  businessName: 'Maharashtra Samaj Dharamshala',
  brandName: 'Maharashtra Samaj',
  propertyLabel: { hi: 'धर्मशाला · उज्जैन', en: 'DHARAMSHALA · UJJAIN' } satisfies LocalText,
  hindiName: 'महाराष्ट्र समाज धर्मशाला',
  tagline: {
    hi: 'यात्रा में श्रद्धा, ठहराव में अपनापन',
    en: 'Devotion in your journey, warmth in your stay',
  } satisfies LocalText,
  location: 'Ujjain, Madhya Pradesh',
  phoneDisplay: '+91 97242 68494',
  phoneLink: '+919724268494',
  email: '',
  mapQuery,
  socialLinks: [] as { label: string; url: string }[],
  directionsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
  address: {
    hi: 'उज्जैन, मध्य प्रदेश — सटीक परिसर का पता प्रबंधन द्वारा पुष्टि के अधीन है।',
    en: 'Ujjain, Madhya Pradesh — exact property address to be confirmed by management.',
  } satisfies LocalText,
  disclaimer: 'Unofficial Demo Concept — Prepared for presentation purposes. Final information, photographs, tariffs and policies require management approval.',
}

export const roomImage = '/images/concept-room.webp'
export const heroImage = '/images/concept-hero.webp'
export const facilityImage = '/images/concept-courtyard.webp'

export const rooms: Room[] = [
  {
    id: 'standard-non-ac',
    name: { hi: 'स्टैंडर्ड नॉन-एसी कक्ष', en: 'Standard Non-AC Room' },
    tagline: { hi: 'सरल, स्वच्छ और सुविधाजनक', en: 'Simple, clean and practical' },
    description: { hi: 'छोटी यात्रा या एकल तीर्थयात्रियों के लिए उपयोगी, हवादार और सुव्यवस्थित कक्ष।', en: 'An airy, well-kept room suited to short stays and solo pilgrims.' },
    occupancy: '2', beds: { hi: '2 सिंगल बेड', en: '2 single beds' }, cooling: { hi: 'पंखा / कूलर', en: 'Fan / cooler' }, bathroom: { hi: 'अटैच्ड', en: 'Attached' }, size: '165 sq ft', tariff: 850, availability: 'available',
    amenities: [{ hi: 'स्वच्छ लिनेन', en: 'Fresh linen' }, { hi: 'गर्म पानी', en: 'Hot water' }, { hi: 'वॉर्डरोब', en: 'Wardrobe' }, { hi: 'वाई-फाई', en: 'Wi-Fi' }],
    suitableFor: [{ hi: 'एकल तीर्थयात्री', en: 'Solo pilgrims' }, { hi: 'दो अतिथियों का छोटा ठहराव', en: 'Short stays for two guests' }, { hi: 'बजट-सचेत यात्रा', en: 'Value-conscious visits' }], image: roomImage,
  },
  {
    id: 'standard-ac',
    name: { hi: 'स्टैंडर्ड एसी कक्ष', en: 'Standard AC Room' },
    tagline: { hi: 'आरामदायक और शांत विश्राम', en: 'Cool, calm comfort' },
    description: { hi: 'आराम और उपयोगिता का संतुलन, मंदिर दर्शन के बाद शांत विश्राम के लिए।', en: 'A comfortable balance of utility and rest after a day of darshan.' },
    occupancy: '2', beds: { hi: '1 डबल बेड', en: '1 double bed' }, cooling: { hi: 'एयर कंडीशनिंग', en: 'Air conditioning' }, bathroom: { hi: 'अटैच्ड', en: 'Attached' }, size: '180 sq ft', tariff: 1250, availability: 'limited',
    amenities: [{ hi: 'एसी', en: 'AC' }, { hi: 'गर्म पानी', en: 'Hot water' }, { hi: 'टीवी', en: 'Television' }, { hi: 'वाई-फाई', en: 'Wi-Fi' }],
    suitableFor: [{ hi: 'दो वयस्क', en: 'Two adults' }, { hi: 'गर्मी के मौसम की यात्रा', en: 'Warm-season visits' }, { hi: 'आराम-केंद्रित छोटा ठहराव', en: 'Comfort-led short stays' }], image: roomImage,
  },
  {
    id: 'family-room',
    name: { hi: 'फैमिली कक्ष', en: 'Family Room' },
    tagline: { hi: 'परिवार के साथ सहज ठहराव', en: 'Room to stay together' },
    description: { hi: 'परिवारों और छोटे समूहों के लिए अधिक जगह वाला सुविधाजनक कक्ष।', en: 'A practical larger room for families and small groups travelling together.' },
    occupancy: '4', beds: { hi: '2 डबल बेड', en: '2 double beds' }, cooling: { hi: 'पंखा / कूलर', en: 'Fan / cooler' }, bathroom: { hi: 'अटैच्ड', en: 'Attached' }, size: '245 sq ft', tariff: 1650, availability: 'available',
    amenities: [{ hi: 'फैमिली लेआउट', en: 'Family layout' }, { hi: 'बैठने की जगह', en: 'Sitting area' }, { hi: 'गर्म पानी', en: 'Hot water' }, { hi: 'वाई-फाई', en: 'Wi-Fi' }],
    suitableFor: [{ hi: 'छोटे परिवार', en: 'Small families' }, { hi: 'माता-पिता के साथ बच्चे', en: 'Parents travelling with children' }, { hi: 'साथ रहने वाले तीर्थयात्री', en: 'Pilgrims staying together' }], image: roomImage,
  },
  {
    id: 'deluxe-family',
    name: { hi: 'डीलक्स फैमिली कक्ष', en: 'Deluxe Family Room' },
    tagline: { hi: 'विशेष यात्राओं के लिए अतिरिक्त सुविधा', en: 'A little more for special visits' },
    description: { hi: 'लंबे ठहराव और बड़े परिवार के लिए अतिरिक्त स्थान तथा बेहतर सुविधाएँ।', en: 'Extra space and thoughtful conveniences for longer family stays.' },
    occupancy: '5', beds: { hi: '2 डबल + 1 सिंगल', en: '2 double + 1 single' }, cooling: { hi: 'एयर कंडीशनिंग', en: 'Air conditioning' }, bathroom: { hi: 'अटैच्ड', en: 'Attached' }, size: '290 sq ft', tariff: 2200, availability: 'soldout',
    amenities: [{ hi: 'एसी', en: 'AC' }, { hi: 'विशाल लेआउट', en: 'Spacious layout' }, { hi: 'बैठने की जगह', en: 'Sitting area' }, { hi: 'लगेज रैक', en: 'Luggage rack' }],
    suitableFor: [{ hi: 'बड़े परिवार', en: 'Larger families' }, { hi: 'लंबा ठहराव', en: 'Longer stays' }, { hi: 'अतिरिक्त स्थान चाहने वाले समूह', en: 'Groups needing extra space' }], image: roomImage,
  },
]

export const facilities = [
  { icon: 'bed', title: { hi: 'स्वच्छ कक्ष', en: 'Clean rooms' }, text: { hi: 'आरामदायक बिस्तर और साफ लिनेन', en: 'Comfortable beds and fresh linen' } },
  { icon: 'droplets', title: { hi: 'गर्म पानी', en: 'Hot water' }, text: { hi: 'निर्धारित समय पर उपलब्ध', en: 'Available during stated hours' } },
  { icon: 'utensils', title: { hi: 'सामुदायिक भोजन', en: 'Community dining' }, text: { hi: 'सेवा उपलब्धता के अनुसार', en: 'Subject to service availability' } },
  { icon: 'car', title: { hi: 'पार्किंग सहायता', en: 'Parking assistance' }, text: { hi: 'सीमित स्थान, पुष्टि आवश्यक', en: 'Limited space, confirm ahead' } },
  { icon: 'wifi', title: { hi: 'वाई-फाई', en: 'Wi-Fi access' }, text: { hi: 'साझा क्षेत्रों में डेमो सुविधा', en: 'Demo amenity in common areas' } },
  { icon: 'shield', title: { hi: 'सुरक्षित परिसर', en: 'Considered safety' }, text: { hi: 'परिवार-अनुकूल वातावरण', en: 'Family-friendly environment' } },
  { icon: 'clock', title: { hi: 'यात्रा सहायता', en: 'Travel assistance' }, text: { hi: 'दर्शन और स्थानीय यात्रा मार्गदर्शन', en: 'Guidance for darshan and local travel' } },
  { icon: 'accessibility', title: { hi: 'वरिष्ठजन सहयोग', en: 'Senior-friendly help' }, text: { hi: 'कमरे की जरूरतें पहले बताएं', en: 'Share room needs in advance' } },
] as const

export const facilityGroups = [
  {
    id: 'stay', title: { hi: 'ठहराव', en: 'Stay' }, description: { hi: 'कक्ष में प्रस्तावित आवश्यक सुविधाएँ', en: 'Proposed essentials within your room' },
    items: [
      { icon: 'bed', title: { hi: 'स्वच्छ कक्ष', en: 'Clean rooms' }, text: { hi: 'स्वच्छता मानक अंतिम संचालन योजना के अनुसार', en: 'Housekeeping standards subject to the final operations plan' } },
      { icon: 'droplets', title: { hi: 'अटैच्ड बाथरूम', en: 'Attached bathroom' }, text: { hi: 'चुनी गई श्रेणी के अनुसार पुष्टि आवश्यक', en: 'Confirmation required for the selected category' } },
      { icon: 'accessibility', title: { hi: 'फैमिली कक्ष', en: 'Family rooms' }, text: { hi: 'परिवार और छोटे समूहों के लिए प्रस्तावित', en: 'Proposed for families and small groups' } },
      { icon: 'clock', title: { hi: 'एसी / नॉन-एसी विकल्प', en: 'AC / Non-AC options' }, text: { hi: 'श्रेणी और उपलब्धता के अनुसार', en: 'Subject to category and availability' } },
    ],
  },
  {
    id: 'convenience', title: { hi: 'यात्री सुविधा', en: 'Convenience' }, description: { hi: 'आगमन और परिसर उपयोग में सहयोग', en: 'Support around arrival and property use' },
    items: [
      { icon: 'droplets', title: { hi: 'पीने का पानी', en: 'Drinking water' }, text: { hi: 'अंतिम व्यवस्था प्रबंधन से पुष्टि होगी', en: 'Final arrangement to be confirmed by management' } },
      { icon: 'car', title: { hi: 'पार्किंग', en: 'Parking' }, text: { hi: 'सीमित स्थान; आगमन से पहले पूछें', en: 'Limited space; enquire before arrival' } },
      { icon: 'shield', title: { hi: 'रिसेप्शन सहायता', en: 'Reception support' }, text: { hi: 'संपर्क समय अंतिम पुष्टि के अधीन', en: 'Contact hours subject to final confirmation' } },
      { icon: 'bed', title: { hi: 'लगेज सहायता', en: 'Luggage assistance' }, text: { hi: 'उपलब्धता के आधार पर प्रस्तावित सहयोग', en: 'Proposed assistance subject to availability' } },
    ],
  },
  {
    id: 'pilgrim', title: { hi: 'तीर्थयात्री सहयोग', en: 'Pilgrim Support' }, description: { hi: 'महाकाल यात्रा को सहज बनाने की जानकारी', en: 'Guidance intended to simplify a Mahakal visit' },
    items: [
      { icon: 'clock', title: { hi: 'महाकाल यात्रा मार्गदर्शन', en: 'Mahakal travel guidance' }, text: { hi: 'अधिकृत timing का दावा किए बिना स्थानीय सलाह', en: 'Local guidance without claiming official timings' } },
      { icon: 'car', title: { hi: 'स्थानीय सहायता', en: 'Local assistance' }, text: { hi: 'स्थानीय route और transport विकल्पों पर मार्गदर्शन', en: 'Guidance on local routes and transport options' } },
      { icon: 'accessibility', title: { hi: 'परिवार-केंद्रित ठहराव', en: 'Family-oriented stay' }, text: { hi: 'बच्चों और वरिष्ठजन की जरूरत पहले साझा करें', en: 'Share children and senior-citizen needs in advance' } },
    ],
  },
] as const

export const nearbyPlaces = [
  { name: { hi: 'श्री महाकालेश्वर मंदिर', en: 'Shri Mahakaleshwar Temple' }, type: { hi: 'ज्योतिर्लिंग दर्शन', en: 'Jyotirlinga darshan' }, time: { hi: 'शहर के प्रमुख तीर्थ क्षेत्र में', en: 'Within Ujjain’s principal pilgrimage area' }, description: { hi: 'उज्जैन की यात्रा का प्रमुख आध्यात्मिक केंद्र; दर्शन व्यवस्था आधिकारिक स्रोत से जाँचें।', en: 'The central spiritual destination of an Ujjain visit; verify darshan arrangements with official sources.' }, image: heroImage },
  { name: { hi: 'श्री महाकाल लोक', en: 'Shri Mahakal Lok' }, type: { hi: 'आध्यात्मिक कॉरिडोर', en: 'Spiritual corridor' }, time: { hi: 'स्थानीय यात्रा से सुलभ', en: 'Accessible by local transport' }, description: { hi: 'महाकाल क्षेत्र में कला, कथा और आध्यात्मिक वातावरण का विस्तृत अनुभव।', en: 'An expansive experience of art, storytelling and spiritual ambience in the Mahakal precinct.' }, image: facilityImage },
  { name: { hi: 'हरसिद्धि माता मंदिर', en: 'Harsiddhi Mata Temple' }, type: { hi: 'शक्ति परंपरा', en: 'Shakti tradition' }, time: { hi: 'मंदिर क्षेत्र के समीप', en: 'Near the temple precinct' }, description: { hi: 'उज्जैन के प्रतिष्ठित देवी मंदिरों में से एक; यात्रा में शांत दर्शन पड़ाव।', en: 'One of Ujjain’s revered Devi temples and a meaningful stop in a pilgrimage itinerary.' }, image: heroImage },
  { name: { hi: 'राम घाट', en: 'Ram Ghat' }, type: { hi: 'शिप्रा आरती एवं स्नान', en: 'Shipra aarti & rituals' }, time: { hi: 'स्थानीय मार्ग से पहुँच', en: 'Reachable by local route' }, description: { hi: 'शिप्रा तट का पारंपरिक घाट, धार्मिक अनुष्ठानों और संध्या वातावरण के लिए जाना जाता है।', en: 'A traditional Shipra riverfront associated with rituals and a contemplative evening atmosphere.' }, image: facilityImage },
  { name: { hi: 'काल भैरव मंदिर', en: 'Kal Bhairav Temple' }, type: { hi: 'प्राचीन मंदिर', en: 'Ancient temple' }, time: { hi: 'शहर के बाहरी तीर्थ मार्ग पर', en: 'On an outer pilgrimage route' }, description: { hi: 'उज्जैन की भैरव उपासना परंपरा से जुड़ा प्रमुख धार्मिक स्थल।', en: 'A significant religious site connected with Ujjain’s Bhairav worship tradition.' }, image: heroImage },
  { name: { hi: 'मंगलनाथ मंदिर', en: 'Mangalnath Temple' }, type: { hi: 'मंगल पूजा स्थल', en: 'Mangal worship site' }, time: { hi: 'स्थानीय वाहन सुझाया जाता है', en: 'Local transport recommended' }, description: { hi: 'मंगल ग्रह पूजा परंपरा से जुड़ा शांत तीर्थ स्थल; पूजा विवरण पहले जाँचें।', en: 'A peaceful pilgrimage site associated with Mangal worship; check ritual details in advance.' }, image: facilityImage },
  { name: { hi: 'सांदीपनि आश्रम', en: 'Sandipani Ashram' }, type: { hi: 'पारंपरिक गुरुकुल स्थल', en: 'Traditional gurukul site' }, time: { hi: 'शहर दर्शन मार्ग में जोड़ा जा सकता है', en: 'Can be included in a city circuit' }, description: { hi: 'भगवान कृष्ण की गुरुकुल परंपरा से जोड़ा जाने वाला सांस्कृतिक और धार्मिक पड़ाव।', en: 'A cultural and spiritual stop traditionally associated with Lord Krishna’s gurukul story.' }, image: heroImage },
] as const

export const faqs = [
  { category: { hi: 'बुकिंग', en: 'Booking' }, q: { hi: 'क्या वेबसाइट पर कमरा तुरंत पक्का हो जाता है?', en: 'Is a room instantly confirmed online?' }, a: { hi: 'नहीं। यह डेमो request flow है। वास्तविक बुकिंग प्रबंधन की पुष्टि के बाद ही पक्की होगी।', en: 'No. This is a demo request flow. A real booking would be confirmed only by management.' } },
  { category: { hi: 'चेक-इन / चेक-आउट', en: 'Check-in / Check-out' }, q: { hi: 'चेक-इन और चेक-आउट का समय क्या है?', en: 'What are the check-in and check-out times?' }, a: { hi: 'अंतिम नीति प्रबंधन द्वारा पुष्टि की जाएगी। यात्रा से पहले फोन पर समय जाँचें।', en: 'The final policy will be confirmed by management. Check timings by phone before travel.' } },
  { category: { hi: 'परिवार', en: 'Families' }, q: { hi: 'क्या परिवार के लिए बड़े कक्ष उपलब्ध हैं?', en: 'Are larger rooms available for families?' }, a: { hi: 'डेमो में फैमिली और डीलक्स फैमिली श्रेणियाँ दिखाई गई हैं; वास्तविक inventory की पुष्टि आवश्यक होगी।', en: 'Family and deluxe family categories are shown in this demo; real inventory will require confirmation.' } },
  { category: { hi: 'कक्ष', en: 'Rooms' }, q: { hi: 'क्या भोजन और आवश्यक सुविधाएँ उपलब्ध हैं?', en: 'Are meals and essential amenities available?' }, a: { hi: 'सामुदायिक भोजन और अन्य amenities प्रस्तावित रूप में दिखाए गए हैं। अंतिम सुविधा प्रबंधन से पुष्टि करें।', en: 'Community dining and other amenities are shown as proposed. Confirm final facilities with management.' } },
  { category: { hi: 'भुगतान', en: 'Payment' }, q: { hi: 'क्या ऑनलाइन भुगतान लिया जाता है?', en: 'Is online payment collected?' }, a: { hi: 'इस डेमो में कोई वास्तविक भुगतान नहीं लिया जाता। Production payment प्रक्रिया management approval के बाद तय होगी।', en: 'No real payment is collected in this demo. Any production payment process will require management approval.' } },
  { category: { hi: 'संपर्क', en: 'Contact' }, q: { hi: 'सटीक लोकेशन कैसे मिलेगी?', en: 'How do I find the exact location?' }, a: { hi: 'Directions बटन Ujjain में संस्था के लिए Maps search खोलता है। अंतिम pin प्रबंधन से सत्यापित होगी।', en: 'The Directions button opens a Maps search in Ujjain. The final pin should be verified by management.' } },
  { category: { hi: 'महाकाल यात्री', en: 'Mahakal Visitors' }, q: { hi: 'क्या महाकाल दर्शन के लिए यात्रा सहायता मिलेगी?', en: 'Is guidance available for Mahakal darshan travel?' }, a: { hi: 'स्थानीय मार्गदर्शन को प्रस्तावित सेवा के रूप में दिखाया गया है। दर्शन timing और प्रवेश नियम आधिकारिक स्रोत से जाँचें।', en: 'Local guidance is shown as a proposed service. Verify darshan timings and entry rules with official sources.' } },
  { category: { hi: 'रद्दीकरण', en: 'Cancellation' }, q: { hi: 'रद्दीकरण और refund policy क्या है?', en: 'What is the cancellation and refund policy?' }, a: { hi: 'अंतिम policy प्रबंधन द्वारा पुष्टि की जाएगी। इस demo में कोई वास्तविक payment या refund नहीं होता।', en: 'The final policy will be confirmed by management. No real payment or refund occurs in this demo.' } },
] as const

export const policies = [
  { hi: 'सरकारी फोटो पहचान पत्र चेक-इन पर आवश्यक हो सकता है।', en: 'Government photo ID may be required at check-in.' },
  { hi: 'बुकिंग request उपलब्धता और प्रबंधन की पुष्टि के अधीन है।', en: 'Booking requests are subject to availability and management confirmation.' },
  { hi: 'टैरिफ, बच्चों की नीति और अतिरिक्त बिस्तर शुल्क अंतिम पुष्टि के अधीन हैं।', en: 'Tariffs, child policy and extra-bed charges are subject to final confirmation.' },
  { hi: 'रद्दीकरण और refund policy production launch से पहले जोड़ी जाएगी।', en: 'Cancellation and refund policy will be added before production launch.' },
] as const

export const gallery = [
  { src: heroImage, title: { hi: 'उज्जैन की आध्यात्मिक सुबह', en: 'A spiritual Ujjain morning' }, tag: { hi: 'परिवेश', en: 'Ambience' } },
  { src: roomImage, title: { hi: 'सादगी में आराम', en: 'Comfort in simplicity' }, tag: { hi: 'कक्ष', en: 'Rooms' } },
  { src: facilityImage, title: { hi: 'खुला सामुदायिक प्रांगण', en: 'Open community courtyard' }, tag: { hi: 'सुविधाएँ', en: 'Facilities' } },
  { src: roomImage, title: { hi: 'परिवार-अनुकूल व्यवस्था', en: 'Family-friendly setup' }, tag: { hi: 'कक्ष', en: 'Rooms' } },
  { src: facilityImage, title: { hi: 'शांत साझा स्थान', en: 'Calm shared spaces' }, tag: { hi: 'परिसर', en: 'Property' } },
  { src: heroImage, title: { hi: 'यात्रा का शांत पड़ाव', en: 'A restful pilgrimage stop' }, tag: { hi: 'उज्जैन', en: 'Ujjain' } },
] as const

export const testimonials = [
  { quote: { hi: 'दर्शन यात्रा के लिए साफ, सरल और भरोसेमंद stay experience की यही अपेक्षा रहती है।', en: 'Exactly the kind of clean, straightforward stay experience pilgrims look for.' }, name: 'Sample Guest A', city: 'Demo testimonial · Nashik' },
  { quote: { hi: 'परिवार के साथ बुकिंग की जानकारी एक जगह मिलना बहुत उपयोगी होगा।', en: 'Having family-room and booking information in one place would be very helpful.' }, name: 'Sample Guest B', city: 'Demo testimonial · Pune' },
  { quote: { hi: 'महाकाल यात्रा की planning और stay request साथ होने से अनुभव आसान लगता है।', en: 'Combining trip planning with a stay request makes the journey feel easier.' }, name: 'Sample Guest C', city: 'Demo testimonial · Indore' },
] as const
