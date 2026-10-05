import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Bot, Building2, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Compass, HeartHandshake, Map, MapPin, Maximize2, MessageCircle, Minus, Phone, Plus, Send, ShieldCheck, Sparkles, Users, X } from 'lucide-react'
import { AmenityIcon, AvailabilityBadge, DemoNotice, PageHero, PageMeta, RoomCard, SectionHeading, TrustStrip } from '../components/Shared'
import { useLanguage } from '../context/LanguageContext'
import { facilityGroups, facilityImage, faqs, gallery, heroImage, nearbyPlaces, policies, rooms, siteConfig } from '../data/site'
import { createPlaceDirectionsLink, createWhatsappLink } from '../services/contactLinks'
import { handleImageError } from '../services/imageFallback'
import { useToast } from '../context/ToastContext'

function addDays(date: string, days: number) {
  if (!date) return ''
  const parsed = new Date(`${date}T12:00:00`)
  parsed.setDate(parsed.getDate() + days)
  return parsed.toISOString().split('T')[0]
}

export function Rooms() {
  const { lang } = useLanguage()
  const [cooling, setCooling] = useState<'all' | 'ac' | 'non-ac'>('all')
  const [occupancy, setOccupancy] = useState<'all' | '2' | '4'>('all')
  const [familyOnly, setFamilyOnly] = useState(false)
  const filtered = useMemo(() => rooms.filter(room => {
    const coolingMatch = cooling === 'all' || (cooling === 'ac' ? room.cooling.en === 'Air conditioning' : room.cooling.en !== 'Air conditioning')
    const occupancyMatch = occupancy === 'all' || (occupancy === '2' ? Number(room.occupancy) <= 2 : Number(room.occupancy) >= 4)
    const familyMatch = !familyOnly || Number(room.occupancy) >= 4
    return coolingMatch && occupancyMatch && familyMatch
  }), [cooling, occupancy, familyOnly])
  return <>
    <PageMeta title={lang === 'hi' ? 'कक्ष एवं टैरिफ' : 'Rooms & Tariffs'} />
    <PageHero eyebrow={lang === 'hi' ? 'आपका अपना स्थान' : 'Your space to unwind'} title={lang === 'hi' ? 'हर यात्रा के लिए सही कक्ष' : 'A room for every kind of journey'} text={lang === 'hi' ? 'साफ-सुथरे, उपयोगी और परिवारों की जरूरत के अनुरूप room categories।' : 'Clean, practical room categories shaped around pilgrims and family needs.'} image={facilityImage} />
    <TrustStrip />
    <section className="section rooms-page"><div className="container">
      <div className="filter-bar filter-bar--advanced"><div><strong>{lang === 'hi' ? `${filtered.length} कक्ष श्रेणियाँ` : `${filtered.length} room categories`}</strong><small>{lang === 'hi' ? 'कूलिंग और क्षमता के अनुसार चुनें' : 'Choose by cooling and occupancy'}</small></div><div className="room-filter-controls" aria-label="Room filters"><label><span>{lang === 'hi' ? 'कूलिंग' : 'Cooling'}</span><select value={cooling} onChange={event => setCooling(event.target.value as typeof cooling)}><option value="all">{lang === 'hi' ? 'सभी विकल्प' : 'All options'}</option><option value="ac">AC</option><option value="non-ac">Non-AC</option></select></label><label><span>{lang === 'hi' ? 'अतिथि क्षमता' : 'Occupancy'}</span><select value={occupancy} onChange={event => setOccupancy(event.target.value as typeof occupancy)}><option value="all">{lang === 'hi' ? 'कोई भी' : 'Any'}</option><option value="2">1–2 {lang === 'hi' ? 'अतिथि' : 'guests'}</option><option value="4">4+ {lang === 'hi' ? 'अतिथि' : 'guests'}</option></select></label><button className={familyOnly ? 'active' : ''} aria-pressed={familyOnly} onClick={() => setFamilyOnly(value => !value)}><Users />{lang === 'hi' ? 'परिवार-अनुकूल' : 'Family-friendly'}</button><button className="filter-reset" onClick={() => { setCooling('all'); setOccupancy('all'); setFamilyOnly(false) }}>{lang === 'hi' ? 'रीसेट' : 'Reset'}</button></div></div>
      {filtered.length ? <div className="room-grid room-grid--wide">{filtered.map(room => <RoomCard key={room.id} room={room} />)}</div> : <div className="room-empty"><BedEmptyIcon /><h2>{lang === 'hi' ? 'इस filter में कोई कक्ष नहीं' : 'No rooms match these filters'}</h2><p>{lang === 'hi' ? 'दूसरा विकल्प चुनें या सभी filters reset करें।' : 'Choose another option or reset all filters.'}</p><button className="btn btn--outline" onClick={() => { setCooling('all'); setOccupancy('all'); setFamilyOnly(false) }}>{lang === 'hi' ? 'Filters रीसेट करें' : 'Reset filters'}</button></div>}
      <DemoNotice />
      <div className="policy-panel"><SectionHeading eyebrow={lang === 'hi' ? 'बुक करने से पहले' : 'Before you request'} title={lang === 'hi' ? 'बुकिंग policies' : 'Booking policies'} /><div>{policies.map(policy => <p key={policy.en}><CheckCircle2 />{policy[lang]}</p>)}</div></div>
    </div></section>
  </>
}

export function RoomDetails() {
  const { roomId } = useParams()
  const { lang, tx } = useLanguage()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const today = new Date().toISOString().split('T')[0]
  const checkOutMin = checkIn ? addDays(checkIn, 1) : today
  const room = rooms.find(item => item.id === roomId)
  if (!room) return <NotFound />
  const bookingQuery = new URLSearchParams({ room: room.id, guests: String(guests) })
  if (checkIn) bookingQuery.set('checkIn', checkIn)
  if (checkOut) bookingQuery.set('checkOut', checkOut)
  const bookingUrl = `/booking?${bookingQuery.toString()}`
  const roomGallery = [room.image, facilityImage, heroImage]
  const activeImage = roomGallery[activeImageIndex] ?? roomGallery[0]
  const similarRooms = rooms.filter(item => item.id !== room.id).slice(0, 3)
  const details = [
    [Users, lang === 'hi' ? 'अधिकतम अतिथि' : 'Maximum guests', `${room.occupancy}`],
    [Building2, lang === 'hi' ? 'कक्ष आकार' : 'Room size', room.size],
    [Sparkles, lang === 'hi' ? 'कूलिंग' : 'Cooling', tx(room.cooling)],
    [ShieldCheck, lang === 'hi' ? 'बाथरूम' : 'Bathroom', tx(room.bathroom)],
  ] as const
  return <>
    <PageMeta title={tx(room.name)} />
    <section className="detail-page section"><div className="container">
      <Link className="back-link" to="/rooms"><ArrowLeft size={16} />{lang === 'hi' ? 'सभी कक्ष' : 'All rooms'}</Link>
      <div className="detail-gallery detail-gallery--selectable"><div className="detail-gallery__main"><img src={activeImage} alt={`${tx(room.name)} — ${lang === 'hi' ? 'प्रतीकात्मक दृश्य' : 'illustrative view'}`} onError={handleImageError} /><span className="concept-label">{lang === 'hi' ? 'प्रतीकात्मक दृश्य' : 'Illustrative view'}</span></div><div className="detail-thumbnails" aria-label={lang === 'hi' ? 'कक्ष चित्र चुनें' : 'Choose a room image'}>{roomGallery.map((image, index) => <button key={`${image}-${index}`} className={activeImageIndex === index ? 'active' : ''} onClick={() => setActiveImageIndex(index)} aria-label={`${lang === 'hi' ? 'चित्र' : 'Image'} ${index + 1}`} aria-pressed={activeImageIndex === index}><img src={image} alt="" onError={handleImageError} /></button>)}</div></div>
      <div className="detail-layout"><div className="detail-content"><div className="detail-heading"><div><AvailabilityBadge status={room.availability} /><h1>{tx(room.name)}</h1><p>{tx(room.tagline)}</p></div><div><strong>₹{room.tariff.toLocaleString('en-IN')}</strong><small>/{lang === 'hi' ? 'रात*' : 'night*'}</small></div></div><p className="detail-description">{tx(room.description)}</p><div className="detail-facts">{details.map(([Icon, label, value]) => <article key={label}><Icon /><span><small>{label}</small><strong>{value}</strong></span></article>)}</div><h2>{lang === 'hi' ? 'कक्ष में उपलब्ध' : 'Room amenities'}</h2><div className="amenity-checks">{room.amenities.map(item => <span key={item.en}><Check />{tx(item)}</span>)}</div><section className="suitable-panel"><div><span className="eyebrow">{lang === 'hi' ? 'किसके लिए उपयुक्त' : 'Suitable for'}</span><h2>{lang === 'hi' ? 'आपकी यात्रा के अनुरूप' : 'Designed around your visit'}</h2></div><div>{room.suitableFor.map(item => <span key={item.en}><CheckCircle2 />{tx(item)}</span>)}</div></section><div className="detail-info"><h2>{lang === 'hi' ? 'महत्वपूर्ण जानकारी' : 'Helpful information'}</h2>{policies.map(item => <p key={item.en}><CheckCircle2 />{item[lang]}</p>)}</div></div>
      <aside className="booking-card"><div><small>{lang === 'hi' ? 'प्रति रात्रि टैरिफ' : 'Tariff, per night'}</small><p><strong>₹{room.tariff.toLocaleString('en-IN')}</strong> <span>+ {lang === 'hi' ? 'लागू शुल्क' : 'applicable charges'}</span></p></div><hr /><label>{lang === 'hi' ? 'आगमन' : 'Check-in'}<input type="date" min={today} value={checkIn} onChange={event => { const value = event.target.value; setCheckIn(value); if (checkOut && checkOut <= value) setCheckOut('') }} /></label><label>{lang === 'hi' ? 'प्रस्थान' : 'Check-out'}<input type="date" min={checkOutMin} value={checkOut} onChange={event => setCheckOut(event.target.value)} /></label><label>{lang === 'hi' ? 'अतिथि' : 'Guests'}<select value={guests} onChange={event => setGuests(Number(event.target.value))}>{Array.from({ length: Number(room.occupancy) }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count}</option>)}</select></label>{room.availability === 'soldout' ? <button className="btn btn--primary btn--block is-disabled" type="button" disabled>{lang === 'hi' ? 'अभी उपलब्ध नहीं' : 'Currently unavailable'}</button> : <Link className="btn btn--primary btn--block" to={bookingUrl}>{lang === 'hi' ? 'बुकिंग अनुरोध शुरू करें' : 'Start booking request'}<ArrowRight size={17} /></Link>}<div className="booking-card__contact"><a href={`tel:${siteConfig.phoneLink}`}><Phone />{lang === 'hi' ? 'कॉल' : 'Call'}</a><a href={createWhatsappLink(`Namaste, I would like to enquire about the ${room.name.en} at ${siteConfig.businessName}, ${siteConfig.location.split(',')[0]}.`)} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp</a></div><Link className="booking-card__ai" to="/ai-assistant?prompt=family"><Bot />{lang === 'hi' ? 'AI से room guidance लें' : 'Ask AI about this room'}<ArrowRight /></Link><p className="booking-card__note"><ShieldCheck />{lang === 'hi' ? 'कोई ऑनलाइन payment नहीं। प्रबंधन की पुष्टि आवश्यक।' : 'No online payment. Management confirmation required.'}</p></aside></div>
      <section className="similar-rooms"><div className="section-top"><SectionHeading eyebrow={lang === 'hi' ? 'अन्य विकल्प' : 'You may also consider'} title={lang === 'hi' ? 'मिलते-जुलते कक्ष' : 'Similar room choices'} /><Link className="text-link" to="/rooms">{lang === 'hi' ? 'सभी कक्ष' : 'All rooms'}<ArrowRight /></Link></div><div className="room-grid">{similarRooms.map(item => <RoomCard key={item.id} room={item} />)}</div></section>
    </div></section>
  </>
}

export function Facilities() {
  const { lang } = useLanguage()
  return <><PageMeta title={lang === 'hi' ? 'सुविधाएँ' : 'Facilities'} /><PageHero eyebrow={lang === 'hi' ? 'सुविधा और सेवा' : 'Comfort & care'} title={lang === 'hi' ? 'यात्रा की जरूरी सुविधाएँ' : 'Thoughtful essentials for your stay'} text={lang === 'hi' ? 'हर सुविधा का उद्देश्य—आपकी तीर्थयात्रा को थोड़ा अधिक सहज बनाना।' : 'Every amenity is presented to make your pilgrimage a little easier.'} image={facilityImage} /><section className="section"><div className="container facilities-groups">{facilityGroups.map((group, groupIndex) => <section className="facility-group" key={group.id}><div className="facility-group__heading"><span>0{groupIndex + 1}</span><div><small>{lang === 'hi' ? 'सुविधा श्रेणी' : 'Facility category'}</small><h2>{group.title[lang]}</h2><p>{group.description[lang]}</p></div></div><div className="facility-page-grid">{group.items.map((item, i) => <article key={item.title.en}><div className="facility-page-grid__number">0{i + 1}</div><span className="facility-page-grid__icon"><AmenityIcon name={item.icon} size={30} /></span><h3>{item.title[lang]}</h3><p>{item.text[lang]}</p><small>{lang === 'hi' ? 'अपने ठहराव के लिए उपलब्धता जाँचें' : 'Confirm availability for your stay'}</small></article>)}</div></section>)}<div className="facility-feature"><img src={facilityImage} alt="Illustrative dharamshala community area" /><div><span className="eyebrow">{lang === 'hi' ? 'साझा स्थान' : 'Community spaces'}</span><h2>{lang === 'hi' ? 'जहाँ सुविधा में संस्कार भी हों' : 'Where comfort still feels connected'}</h2><p>{lang === 'hi' ? 'भोजन और common areas यात्रियों, परिवारों और समुदाय के मिलने के सहज स्थान बन सकते हैं।' : 'Dining and common areas can provide relaxed spaces for travellers, families and community.'}</p></div></div></div></section></>
}

export function Gallery() {
  const { lang } = useLanguage()
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const categories = ['All', ...Array.from(new Set(gallery.map(item => item.tag.en)))]
  const visibleImages = useMemo(() => gallery.map((item, index) => ({ item, index })).filter(({ item }) => filter === 'All' || item.tag.en === filter), [filter])
  const moveLightbox = useCallback((direction: -1 | 1) => {
    if (active === null || visibleImages.length === 0) return
    const current = visibleImages.findIndex(image => image.index === active)
    const next = (current + direction + visibleImages.length) % visibleImages.length
    setActive(visibleImages[next].index)
  }, [active, visibleImages])
  useEffect(() => {
    if (active === null) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowLeft') moveLightbox(-1)
      if (event.key === 'ArrowRight') moveLightbox(1)
      if (event.key === 'Tab') {
        const focusable = Array.from(lightboxRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? [])
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [active, moveLightbox])
  return <><PageMeta title={lang === 'hi' ? 'गैलरी' : 'Gallery'} /><PageHero eyebrow={lang === 'hi' ? 'दृश्य गैलरी' : 'Visual gallery'} title={lang === 'hi' ? 'ठहराव की एक शांत झलक' : 'A quiet glimpse of the experience'} text={lang === 'hi' ? 'यहाँ दिखाए गए दृश्य प्रतीकात्मक हैं और ठहराव के वातावरण को समझने में मदद करते हैं।' : 'These visuals are illustrative and help convey the intended stay experience.'} image={heroImage} /><section className="section"><div className="container"><div className="gallery-toolbar"><div><span className="eyebrow">{lang === 'hi' ? 'दृश्य संग्रह' : 'Visual collection'}</span><p>{lang === 'hi' ? 'प्रतीकात्मक visuals · कक्ष, परिसर और यात्रा वातावरण की झलक' : 'Illustrative visuals · rooms, spaces and the travel ambience'}</p></div><div role="group" aria-label={lang === 'hi' ? 'गैलरी श्रेणियाँ' : 'Gallery categories'}>{categories.map(category => <button key={category} className={filter === category ? 'active' : ''} aria-pressed={filter === category} onClick={() => { setFilter(category); setActive(null) }}>{category === 'All' ? (lang === 'hi' ? 'सभी' : 'All') : gallery.find(item => item.tag.en === category)?.tag[lang]}</button>)}</div></div><div className="gallery-page-grid">{visibleImages.map(({ item, index }) => <button onClick={() => setActive(index)} key={`${item.title.en}-${index}`}><img src={item.src} alt={item.title[lang]} loading="lazy" decoding="async" onError={handleImageError} /><span><small>{item.tag[lang]}</small><strong>{item.title[lang]}</strong></span><i><Maximize2 /></i></button>)}</div></div></section>{active !== null && <div ref={lightboxRef} className="lightbox" role="dialog" aria-modal="true" aria-label={lang === 'hi' ? 'चित्र पूर्वावलोकन' : 'Image preview'} onMouseDown={event => { if (event.currentTarget === event.target) setActive(null) }}><button ref={closeButtonRef} className="lightbox__close" aria-label={lang === 'hi' ? 'पूर्वावलोकन बंद करें' : 'Close preview'} onClick={() => setActive(null)}><X /></button><button className="lightbox__nav lightbox__nav--prev" aria-label={lang === 'hi' ? 'पिछला चित्र' : 'Previous image'} onClick={() => moveLightbox(-1)}><ChevronLeft /></button><img src={gallery[active].src} alt={gallery[active].title[lang]} onError={handleImageError} /><button className="lightbox__nav lightbox__nav--next" aria-label={lang === 'hi' ? 'अगला चित्र' : 'Next image'} onClick={() => moveLightbox(1)}><ChevronRight /></button><p aria-live="polite"><small>{lang === 'hi' ? 'प्रतीकात्मक दृश्य' : 'Illustrative view'}</small>{gallery[active].title[lang]}<em>{visibleImages.findIndex(image => image.index === active) + 1} / {visibleImages.length}</em></p></div>}</>
}

export function Nearby() {
  const { lang } = useLanguage()
  return <><PageMeta title={lang === 'hi' ? 'उज्जैन के दर्शनीय स्थल' : 'Nearby Places in Ujjain'} /><PageHero eyebrow={lang === 'hi' ? 'उज्जैन यात्रा मार्गदर्शिका' : 'Your Ujjain guide'} title={lang === 'hi' ? 'आस्था के शहर को थोड़ा और जानिए' : 'Discover more of the city of faith'} text={lang === 'hi' ? 'प्रमुख मंदिरों, घाटों और पारंपरिक स्थलों के साथ अपनी यात्रा की रूपरेखा बनाइए।' : 'Shape a meaningful itinerary around key temples, ghats and traditional landmarks.'} image={heroImage} /><section className="section nearby-page"><div className="container"><div className="nearby-intro"><SectionHeading eyebrow={lang === 'hi' ? 'आपकी यात्रा' : 'Plan your visit'} title={lang === 'hi' ? 'एक शहर, अनेक पवित्र अनुभव' : 'One city, many sacred experiences'} text={lang === 'hi' ? 'नीचे दी गई जानकारी केवल itinerary planning के लिए है। सटीक दूरी, समय और दर्शन व्यवस्था यात्रा से पहले आधिकारिक स्रोत से जाँचें।' : 'This information is for itinerary planning only. Verify distances, timings and darshan arrangements with official sources before travel.'} /><a className="btn btn--outline" href={siteConfig.directionsLink} target="_blank" rel="noreferrer"><Map size={17} />{lang === 'hi' ? 'Maps खोलें' : 'Open Maps'}</a></div><div className="nearby-card-grid">{nearbyPlaces.map((place, i) => <article className="nearby-card" key={place.name.en}><div className="nearby-card__media"><img src={place.image} alt={`${place.name[lang]} — ${lang === 'hi' ? 'प्रतीकात्मक यात्रा दृश्य' : 'illustrative travel view'}`} loading="lazy" decoding="async" onError={handleImageError} /><span className="nearby-card__number">0{i + 1}</span><span className="concept-label">{lang === 'hi' ? 'प्रतीकात्मक दृश्य' : 'Illustrative view'}</span></div><div className="nearby-card__body"><small><Compass />{place.type[lang]}</small><h2>{place.name[lang]}</h2><p>{place.description[lang]}</p><div><span><MapPin />{place.time[lang]}</span><a className="text-link" href={createPlaceDirectionsLink(place.name.en)} target="_blank" rel="noreferrer">{lang === 'hi' ? 'दिशा देखें' : 'Directions'}<ArrowRight /></a></div></div></article>)}</div><div className="travel-note"><Clock3 /><div><strong>{lang === 'hi' ? 'यात्रा सुझाव' : 'Travel note'}</strong><p>{lang === 'hi' ? 'त्योहार, सोमवार और विशेष दर्शन के दिनों में यात्रा समय बदल सकता है। management से local guidance लेकर पर्याप्त समय रखें।' : 'Travel times can change on festivals, Mondays and special-darshan days. Allow extra time and seek local guidance from management.'}</p></div></div></div></section></>
}

export function About() {
  const { lang } = useLanguage()
  const values = [[HeartHandshake, '01', { hi: 'सेवा', en: 'Service' }, { hi: 'अतिथि की जरूरत को सादगी और सम्मान से समझना।', en: 'Understanding guest needs with simplicity and respect.' }], [ShieldCheck, '02', { hi: 'भरोसा', en: 'Trust' }, { hi: 'जानकारी और प्रक्रिया में स्पष्टता रखना।', en: 'Keeping information and processes transparent.' }], [Users, '03', { hi: 'समुदाय', en: 'Community' }, { hi: 'हर आयु और परिवार के लिए अपनापन।', en: 'A feeling of belonging across ages and families.' }]] as const
  return <><PageMeta title={lang === 'hi' ? 'हमारे बारे में' : 'About Us'} /><PageHero eyebrow={`${lang === 'hi' ? siteConfig.hindiName : siteConfig.brandName} · Ujjain`} title={lang === 'hi' ? 'आवास से आगे, सेवा की परंपरा' : 'More than accommodation—a spirit of service'} text={lang === 'hi' ? 'समाज, संस्कार और यात्री सेवा को एक आधुनिक digital experience में जोड़ने का प्रयास।' : 'Bringing community, values and pilgrim service into a modern digital experience.'} image={facilityImage} /><section className="section"><div className="container about-grid"><div className="about-image"><img src={heroImage} alt="Illustrative Ujjain spiritual ambience" /><div><strong>{lang === 'hi' ? 'उज्जैन' : 'Ujjain'}</strong><span>{lang === 'hi' ? 'श्रद्धा · सेवा · संस्कार' : 'Faith · Service · Values'}</span></div></div><div><SectionHeading eyebrow={lang === 'hi' ? 'हमारा दृष्टिकोण' : 'Our approach'} title={lang === 'hi' ? 'परंपरा का सम्मान, आज की सुविधा के साथ' : 'Respecting tradition, designed for today'} /><p className="lead-copy">{lang === 'hi' ? 'यह वेबसाइट room selection, booking request, यात्रा जानकारी और direct support को एक सुव्यवस्थित जगह पर जोड़ती है।' : 'This website brings room selection, stay requests, travel guidance and direct assistance into one considered experience.'}</p><p>{lang === 'hi' ? 'इतिहास, ट्रस्ट विवरण और operational जानकारी के लिए प्रबंधन से सीधे संपर्क करें।' : 'Contact management directly for trust history and operational information.'}</p><div className="about-seal"><span>ॐ</span><p><strong>{lang === 'hi' ? 'अतिथि देवो भवः' : 'Atithi Devo Bhava'}</strong>{lang === 'hi' ? 'हर यात्री में अतिथि, हर सेवा में सम्मान।' : 'Hospitality rooted in dignity and care.'}</p></div></div></div></section><section className="section values-section"><div className="container"><SectionHeading center eyebrow={lang === 'hi' ? 'हमारे मूल्य' : 'What guides us'} title={lang === 'hi' ? 'सादगी, संवेदना और स्पष्टता' : 'Simplicity, care and clarity'} /><div className="value-grid">{values.map(([Icon, number, title, text]) => <article key={number}><span>{number}</span><Icon /><h3>{title[lang]}</h3><p>{text[lang]}</p></article>)}</div></div></section></>
}

export function Contact() {
  const { lang } = useLanguage()
  const showToast = useToast()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()
    if (!name || phone.replace(/\D/g, '').length < 10) { setError(lang === 'hi' ? 'कृपया नाम और सही 10 अंकों का फोन नंबर भरें।' : 'Please enter your name and a valid 10-digit phone number.'); return }
    const enquiry = [
      `Namaste, I would like to enquire about a stay at ${siteConfig.businessName}.`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : '',
      message ? `Message: ${message}` : '',
    ].filter(Boolean).join('\n')
    setError('')
    setSubmitted(true)
    window.open(createWhatsappLink(enquiry), '_blank', 'noopener,noreferrer')
    showToast(lang === 'hi' ? 'WhatsApp पूछताछ तैयार है' : 'WhatsApp enquiry prepared')
  }
  return <><PageMeta title={lang === 'hi' ? 'संपर्क करें' : 'Contact Us'} /><PageHero eyebrow={lang === 'hi' ? 'हम सहायता के लिए हैं' : 'We are here to help'} title={lang === 'hi' ? 'अपनी यात्रा के बारे में बात करें' : 'Let’s talk about your Ujjain stay'} text={lang === 'hi' ? 'कक्ष, परिवार की जरूरत या दर्शन planning—अपने प्रश्न सीधे साझा करें।' : 'Rooms, family needs or darshan planning—share your questions directly.'} image={heroImage} /><section className="section contact-page"><div className="container contact-grid"><div className="contact-info"><SectionHeading eyebrow={lang === 'hi' ? 'मैनेजर संपर्क' : 'Manager contact'} title={lang === 'hi' ? 'एक संदेश या कॉल दूर' : 'A call or message away'} /><div className="contact-cards"><a href={`tel:${siteConfig.phoneLink}`}><span><Phone /></span><div><small>{lang === 'hi' ? 'मैनेजर को कॉल करें' : 'Call the manager'}</small><strong>{siteConfig.phoneDisplay}</strong></div><ArrowRight /></a><a href={createWhatsappLink()} target="_blank" rel="noreferrer"><span><MessageCircle /></span><div><small>WhatsApp</small><strong>{lang === 'hi' ? 'आवास पूछताछ शुरू करें' : 'Start a stay enquiry'}</strong></div><ArrowRight /></a><a href={siteConfig.directionsLink} target="_blank" rel="noreferrer"><span><MapPin /></span><div><small>{lang === 'hi' ? 'स्थान' : 'Location'}</small><strong>{siteConfig.address[lang]}</strong></div><ArrowRight /></a></div><div className="contact-hours"><Clock3 /><div><strong>{lang === 'hi' ? 'संपर्क समय' : 'Contact hours'}</strong><p>{lang === 'hi' ? 'कॉल या WhatsApp पर वर्तमान उपलब्धता जाँचें।' : 'Call or WhatsApp to check current availability.'}</p></div></div></div><div className="contact-form-card">{submitted ? <div className="form-success"><CheckCircle2 /><span>{lang === 'hi' ? 'WhatsApp पूछताछ तैयार है' : 'WhatsApp enquiry ready'}</span><h2>{lang === 'hi' ? 'धन्यवाद!' : 'Thank you!'}</h2><p>{lang === 'hi' ? 'अपनी तैयार की गई पूछताछ WhatsApp में भेजकर प्रक्रिया पूरी करें।' : 'Send the prepared enquiry in WhatsApp to complete the process.'}</p><button className="btn btn--outline" onClick={() => setSubmitted(false)}>{lang === 'hi' ? 'नया संदेश' : 'Send another'}</button></div> : <><h2>{lang === 'hi' ? 'पूछताछ भेजें' : 'Send an enquiry'}</h2><p>{lang === 'hi' ? 'अपनी यात्रा की जानकारी भरें; हम WhatsApp message तैयार कर देंगे।' : 'Share your visit details and we will prepare a WhatsApp enquiry.'}</p><form onSubmit={submit} noValidate><label>{lang === 'hi' ? 'पूरा नाम *' : 'Full name *'}<input name="name" placeholder={lang === 'hi' ? 'अपना नाम लिखें' : 'Enter your name'} /></label><label>{lang === 'hi' ? 'फोन नंबर *' : 'Phone number *'}<input name="phone" inputMode="numeric" placeholder="10-digit mobile number" /></label><label>{lang === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (optional)'}<input name="email" type="email" placeholder="name@example.com" /></label><label>{lang === 'hi' ? 'आपका संदेश' : 'Your message'}<textarea name="message" rows={4} placeholder={lang === 'hi' ? 'यात्रा की तारीख, अतिथि और प्रश्न…' : 'Travel dates, guest count and your question…'} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="btn btn--primary btn--block" type="submit"><Send size={17} />{lang === 'hi' ? 'WhatsApp पर भेजें' : 'Send on WhatsApp'}</button></form></>}</div></div><div className="container map-panel"><div><span className="eyebrow">{lang === 'hi' ? 'उज्जैन, मध्य प्रदेश' : 'Ujjain, Madhya Pradesh'}</span><h2>{lang === 'hi' ? 'दिशा एक टैप में' : 'Directions in one tap'}</h2><p>{siteConfig.address[lang]}</p><a className="btn btn--gold" href={siteConfig.directionsLink} target="_blank" rel="noreferrer"><Map size={17} />{lang === 'hi' ? 'Google Maps में खोजें' : 'Search on Google Maps'}</a></div><div className="map-visual"><span className="map-pin"><MapPin /></span><i className="map-road map-road--1" /><i className="map-road map-road--2" /><i className="map-road map-road--3" /><small>{lang === 'hi' ? 'सटीक दिशा के लिए कॉल या WhatsApp करें' : 'Call or WhatsApp for exact directions'}</small></div></div></section></>
}

export function FAQ() {
  const { lang } = useLanguage()
  return <><PageMeta title={lang === 'hi' ? 'सामान्य प्रश्न' : 'Frequently Asked Questions'} /><PageHero eyebrow={lang === 'hi' ? 'आपके प्रश्न, स्पष्ट उत्तर' : 'Clear answers'} title={lang === 'hi' ? 'यात्रा से पहले जानने योग्य' : 'Everything helpful before your stay'} text={lang === 'hi' ? 'बुकिंग, कक्ष, भुगतान और सुविधा से जुड़े सामान्य सवाल।' : 'Common questions about requests, rooms, payments and amenities.'} /><section className="section"><div className="container faq-page-grid"><div><SectionHeading eyebrow={lang === 'hi' ? 'सहायता केंद्र' : 'Help centre'} title={lang === 'hi' ? 'सामान्य प्रश्न' : 'Frequently asked questions'} /><p>{lang === 'hi' ? 'सही उत्तर नहीं मिला? प्रबंधन से सीधे बात करें।' : 'Couldn’t find the answer? Speak with management directly.'}</p><a className="btn btn--outline" href={`tel:${siteConfig.phoneLink}`}><Phone size={17} />{siteConfig.phoneDisplay}</a></div><div className="faq-list faq-list--large">{faqs.map((item, i) => <details key={item.q.en} open={i === 0}><summary><b>0{i + 1}</b><span className="faq-category">{item.category[lang]}</span><strong>{item.q[lang]}</strong><span className="faq-toggle"><Plus className="plus" /><Minus className="minus" /></span></summary><p>{item.a[lang]}</p></details>)}</div></div></section></>
}

export function NotFound() {
  const { lang } = useLanguage()
  return <section className="not-found"><PageMeta title="Page not found" /><div className="not-found__pattern" aria-hidden="true" /><div className="not-found__mark">म</div><small>{siteConfig.businessName} · {siteConfig.location}</small><span>404</span><h1>{lang === 'hi' ? 'यह पृष्ठ नहीं मिला' : 'This page could not be found'}</h1><p>{lang === 'hi' ? 'लिंक बदल गया हो सकता है। अपने ठहराव की जानकारी के लिए नीचे से सही रास्ता चुनें।' : 'The link may have changed. Choose a helpful path below to continue planning your stay.'}</p><div className="not-found__actions"><Link className="btn btn--primary" to="/"><HomeIcon />{lang === 'hi' ? 'होम पर लौटें' : 'Return home'}</Link><Link className="btn btn--outline" to="/rooms"><BedIcon />{lang === 'hi' ? 'कक्ष देखें' : 'Explore rooms'}</Link><Link className="btn btn--gold" to="/booking">{lang === 'hi' ? 'ठहराव अनुरोध' : 'Plan a stay'}<ArrowRight size={17} /></Link></div><em>Booking by request · No online payment</em></section>
}

function HomeIcon() { return <Building2 aria-hidden="true" /> }
function BedIcon() { return <span aria-hidden="true">⌂</span> }

function BedEmptyIcon() {
  return <span className="room-empty__icon" aria-hidden="true">⌂</span>
}
