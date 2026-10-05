import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Bot, CalendarCheck, CalendarDays, Check, CheckCircle2, CircleAlert, Clock3, Copy, Home, Mail, MapPin, MessageCircle, Minus, Phone, Plus, RotateCcw, Send, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import { DemoNotice, PageHero, PageMeta } from '../components/Shared'
import { useLanguage } from '../context/LanguageContext'
import { facilityImage, rooms, siteConfig } from '../data/site'
import { createBookingWhatsappMessage, createWhatsappLink } from '../services/contactLinks'
import { createDemoReference, DEMO_BOOKINGS_EVENT, findDemoBooking, saveDemoBooking, type DemoBooking, type DemoBookingStatus } from '../services/demoBookings'
import { copyText } from '../services/clipboard'
import { useToast } from '../context/ToastContext'

type BookingData = {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  roomCount: number
  roomId: string
  name: string
  phone: string
  email: string
  city: string
  request: string
}

const stepLabels = {
  hi: ['तारीखें', 'अतिथि', 'कक्ष', 'जानकारी', 'समीक्षा', 'अनुरोध', 'पुष्टि'],
  en: ['Dates', 'Guests', 'Room', 'Details', 'Review', 'Request', 'Confirmation'],
}

function addDays(date: string, days: number) {
  if (!date) return ''
  const parsed = new Date(`${date}T12:00:00`)
  parsed.setDate(parsed.getDate() + days)
  return parsed.toISOString().split('T')[0]
}

function formatDate(date: string, lang: 'hi' | 'en') {
  return date ? new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`)) : '—'
}

function getNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut || checkOut <= checkIn) return 0
  return Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
}

type DemoAvailability = { state: 'available' | 'limited' | 'soldout'; left?: 1 | 2 }

function getDemoAvailability(data: BookingData, roomIndex: number): DemoAvailability {
  const room = rooms[roomIndex]
  if (!room || room.availability === 'soldout') return { state: 'soldout' }
  const guestsPerRoom = Math.ceil((data.adults + data.children) / Math.max(1, data.roomCount))
  if (guestsPerRoom > Number(room.occupancy)) return { state: 'soldout' }
  const day = Number(data.checkIn.slice(-2)) || 1
  const signal = day + roomIndex + data.adults + data.children + data.roomCount
  if (signal % 7 === 0) return { state: 'soldout' }
  if (signal % 5 === 0) return { state: 'limited', left: 1 }
  if (signal % 3 === 0) return { state: 'limited', left: 2 }
  return { state: 'available' }
}

export function Booking() {
  const { lang, tx } = useLanguage()
  const showToast = useToast()
  const [query] = useSearchParams()
  const today = new Date().toISOString().split('T')[0]
  const initialIn = query.get('checkIn') || ''
  const initialOut = query.get('checkOut') || ''
  const requestedGuests = Number(query.get('guests') || '2')
  const initialAdults = Number.isFinite(requestedGuests) ? Math.min(10, Math.max(1, Math.trunc(requestedGuests))) : 2
  const [step, setStep] = useState(initialIn && initialOut ? 2 : 0)
  const [error, setError] = useState('')
  const [booking, setBooking] = useState<DemoBooking | null>(null)
  const [storageSaved, setStorageSaved] = useState(true)
  const [data, setData] = useState<BookingData>({ checkIn: initialIn, checkOut: initialOut, adults: initialAdults, children: 0, roomCount: 1, roomId: query.get('room') || '', name: '', phone: '', email: '', city: '', request: '' })
  const room = rooms.find(item => item.id === data.roomId)
  const nights = getNights(data.checkIn, data.checkOut)
  const estimated = room ? room.tariff * nights * data.roomCount : 0

  function update<K extends keyof BookingData>(key: K, value: BookingData[K]) {
    setData(current => ({ ...current, [key]: value }))
    setError('')
  }

  function validateCurrent() {
    if (step === 0) {
      if (!data.checkIn || !data.checkOut) return lang === 'hi' ? 'कृपया आगमन और प्रस्थान दोनों तारीखें चुनें।' : 'Please select both check-in and check-out dates.'
      if (data.checkIn < today) return lang === 'hi' ? 'आगमन की तारीख आज या उसके बाद होनी चाहिए।' : 'Check-in must be today or later.'
      if (data.checkOut <= data.checkIn) return lang === 'hi' ? 'प्रस्थान की तारीख आगमन के बाद होनी चाहिए।' : 'Check-out must be after check-in.'
    }
    if (step === 1 && data.adults < 1) return lang === 'hi' ? 'कम-से-कम एक वयस्क आवश्यक है।' : 'At least one adult is required.'
    if (step === 2) {
      if (!data.roomId) return lang === 'hi' ? 'कृपया उपलब्ध कक्ष चुनें।' : 'Please select an available room.'
      const roomIndex = rooms.findIndex(item => item.id === data.roomId)
      if (getDemoAvailability(data, roomIndex).state === 'soldout') return lang === 'hi' ? 'यह कक्ष चुनी गई जानकारी के लिए उपलब्ध नहीं है। दूसरा विकल्प चुनें।' : 'This room is unavailable for the selected details. Choose another option.'
    }
    if (step === 3) {
      if (data.name.trim().length < 2) return lang === 'hi' ? 'कृपया पूरा नाम लिखें।' : 'Please enter your full name.'
      if (!/^[6-9]\d{9}$/.test(data.phone.replace(/\D/g, '').slice(-10))) return lang === 'hi' ? 'कृपया सही 10 अंकों का भारतीय मोबाइल नंबर दें।' : 'Please enter a valid 10-digit Indian mobile number.'
      if (!data.city.trim()) return lang === 'hi' ? 'कृपया अपना शहर लिखें।' : 'Please enter your city.'
      if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) return lang === 'hi' ? 'ईमेल का format सही नहीं है।' : 'Please enter a valid email address.'
    }
    return ''
  }

  function next() {
    const message = validateCurrent()
    if (message) { setError(message); return }
    setStep(current => Math.min(6, current + 1))
    setError('')
  }

  function confirm() {
    if (!room) { setError(lang === 'hi' ? 'कक्ष की जानकारी नहीं मिली।' : 'Room information is missing.'); return }
    const now = new Date().toISOString()
    const created: DemoBooking = {
      reference: createDemoReference(), guestName: data.name.trim(), mobile: data.phone.trim(), email: data.email.trim() || undefined,
      city: data.city.trim(), specialRequest: data.request.trim() || undefined, roomId: room.id, roomName: room.name.en,
      checkIn: data.checkIn, checkOut: data.checkOut, adults: data.adults, children: data.children, roomCount: data.roomCount,
      nights, demoTariff: room.tariff, estimatedDemoTotal: estimated, status: 'received', createdAt: now, updatedAt: now,
    }
    const saved = saveDemoBooking(created)
    setStorageSaved(saved)
    setBooking(created)
    setStep(6)
    showToast(lang === 'hi' ? 'बुकिंग अनुरोध तैयार है' : 'Booking request ready')
  }

  async function copyReference(reference: string) {
    const copied = await copyText(reference)
    showToast(copied
      ? (lang === 'hi' ? 'बुकिंग reference कॉपी किया गया' : 'Booking reference copied')
      : { message: lang === 'hi' ? 'Reference कॉपी नहीं हो सका' : 'Could not copy the reference', tone: 'error' })
  }

  function restart() {
    setData({ checkIn: '', checkOut: '', adults: 2, children: 0, roomCount: 1, roomId: '', name: '', phone: '', email: '', city: '', request: '' })
    setBooking(null)
    setStorageSaved(true)
    setStep(0)
    setError('')
  }

  return <>
    <PageMeta title={lang === 'hi' ? 'बुकिंग अनुरोध' : 'Booking Request'} />
    <section className="booking-shell">
      <div className="booking-shell__top" style={{ backgroundImage: `linear-gradient(rgba(47,8,8,.82),rgba(47,8,8,.82)),url(${facilityImage})` }}><div className="container"><span className="eyebrow eyebrow--light">{lang === 'hi' ? 'सरल बुकिंग प्रक्रिया' : 'A clear booking process'}</span><h1>{lang === 'hi' ? 'अपना ठहराव चुनें' : 'Plan your stay'}</h1><p>{lang === 'hi' ? 'कोई payment नहीं · प्रबंधन से अंतिम पुष्टि आवश्यक' : 'No payment · Final management confirmation required'}</p></div></div>
      <div className="container booking-progress" aria-label={lang === 'hi' ? 'बुकिंग प्रगति' : 'Booking progress'}>{stepLabels[lang].map((label, index) => <div key={label} className={`${index === step ? 'active' : ''} ${index < step ? 'done' : ''}`} aria-current={index === step ? 'step' : undefined}><span>{index < step ? <Check size={15} /> : index + 1}</span><small>{label}</small></div>)}</div>
      <div className="container booking-layout">
        <section className="booking-form-panel">
          {step === 0 && <StepFrame number="01" eyebrow={lang === 'hi' ? 'यात्रा की तारीखें' : 'Your travel dates'} title={lang === 'hi' ? 'आप कब ठहरेंगे?' : 'When would you like to stay?'} text={lang === 'hi' ? 'आगमन और प्रस्थान की प्रस्तावित तारीखें चुनें।' : 'Choose your proposed arrival and departure dates.'}><div className="date-pair"><label className="date-choice"><CalendarDays /><span><small>{lang === 'hi' ? 'आगमन की तारीख' : 'Check-in date'}</small><input aria-label={lang === 'hi' ? 'आगमन की तारीख' : 'Check-in date'} type="date" min={today} value={data.checkIn} onChange={event => { update('checkIn', event.target.value); if (data.checkOut && data.checkOut <= event.target.value) update('checkOut', '') }} /></span></label><label className="date-choice"><CalendarCheck /><span><small>{lang === 'hi' ? 'प्रस्थान की तारीख' : 'Check-out date'}</small><input aria-label={lang === 'hi' ? 'प्रस्थान की तारीख' : 'Check-out date'} type="date" min={addDays(data.checkIn || today, 1)} value={data.checkOut} onChange={event => update('checkOut', event.target.value)} /></span></label></div><QuickDates onPick={(checkIn, checkOut) => { update('checkIn', checkIn); update('checkOut', checkOut) }} today={today} lang={lang} />{nights > 0 && <p className="date-summary"><Clock3 />{nights} {lang === 'hi' ? 'रातों का प्रस्तावित ठहराव' : 'night proposed stay'}</p>}</StepFrame>}
          {step === 1 && <StepFrame number="02" eyebrow={lang === 'hi' ? 'आपके साथ कौन है' : 'Your travel party'} title={lang === 'hi' ? 'कितने अतिथि ठहरेंगे?' : 'How many guests are staying?'} text={lang === 'hi' ? 'सही room category सुझाने में मदद मिलेगी।' : 'This helps identify the right room category.'}><Counter label={lang === 'hi' ? 'वयस्क' : 'Adults'} hint={lang === 'hi' ? '13 वर्ष और अधिक' : 'Age 13 and above'} value={data.adults} min={1} max={10} onChange={value => update('adults', value)} /><Counter label={lang === 'hi' ? 'बच्चे' : 'Children'} hint={lang === 'hi' ? '12 वर्ष तक' : 'Up to age 12'} value={data.children} min={0} max={6} onChange={value => update('children', value)} /><Counter label={lang === 'hi' ? 'कक्ष' : 'Rooms'} hint={lang === 'hi' ? 'कितने कक्ष चाहिए' : 'Number of rooms required'} value={data.roomCount} min={1} max={4} onChange={value => update('roomCount', value)} /></StepFrame>}
          {step === 2 && <StepFrame number="03" eyebrow={lang === 'hi' ? 'कक्ष विकल्प' : 'Room options'} title={lang === 'hi' ? 'अपना कक्ष चुनें' : 'Choose your room'} text={`${formatDate(data.checkIn, lang)} — ${formatDate(data.checkOut, lang)} · ${data.adults + data.children} ${lang === 'hi' ? 'अतिथि' : 'guests'}`}><div className="availability-disclaimer"><Sparkles />{lang === 'hi' ? 'चुनी तारीखों और अतिथि संख्या के अनुसार विकल्प दिखाए जाते हैं। अंतिम room allocation request review पर confirm होता है।' : 'Options are shown for your selected dates and guest count. Final room allocation is confirmed when the request is reviewed.'}</div><div className="booking-room-list">{rooms.map((item, index) => { const availability = getDemoAvailability(data, index); const disabled = availability.state === 'soldout'; return <button type="button" key={item.id} className={data.roomId === item.id ? 'selected' : ''} disabled={disabled} onClick={() => update('roomId', item.id)}><img src={item.image} alt="" /><div><DemoAvailabilityBadge availability={availability} lang={lang} /><h3>{tx(item.name)}</h3><p>{tx(item.beds)} · {item.occupancy} {lang === 'hi' ? 'अतिथि' : 'guests'} · {tx(item.cooling)}</p><small>{lang === 'hi' ? 'प्रति रात्रि' : 'Per night'} <strong>₹{item.tariff.toLocaleString('en-IN')}</strong>/{lang === 'hi' ? 'रात' : 'night'}</small></div><span className="radio-dot">{data.roomId === item.id && <Check />}</span></button>})}</div></StepFrame>}
          {step === 3 && <StepFrame number="04" eyebrow={lang === 'hi' ? 'संपर्क जानकारी' : 'Guest details'} title={lang === 'hi' ? 'आपसे कैसे संपर्क करें?' : 'How can management reach you?'} text={lang === 'hi' ? 'अपनी booking request के लिए संपर्क जानकारी भरें।' : 'Enter contact details for your booking request.'}><div className="form-grid"><label><span>{lang === 'hi' ? 'पूरा नाम *' : 'Full name *'}</span><div className="input-with-icon"><UserRound /><input autoFocus autoComplete="name" value={data.name} onChange={event => update('name', event.target.value)} placeholder={lang === 'hi' ? 'यात्री का नाम' : 'Guest name'} /></div></label><label><span>{lang === 'hi' ? 'मोबाइल नंबर *' : 'Mobile number *'}</span><div className="input-with-icon"><Phone /><input inputMode="numeric" autoComplete="tel" value={data.phone} onChange={event => update('phone', event.target.value)} placeholder="10-digit mobile" /></div></label><label><span>{lang === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (optional)'}</span><div className="input-with-icon"><Mail /><input type="email" autoComplete="email" value={data.email} onChange={event => update('email', event.target.value)} placeholder="name@example.com" /></div></label><label><span>{lang === 'hi' ? 'शहर *' : 'City *'}</span><div className="input-with-icon"><MapPin /><input autoComplete="address-level2" value={data.city} onChange={event => update('city', event.target.value)} placeholder={lang === 'hi' ? 'आपका शहर' : 'Your city'} /></div></label><label className="form-grid__full"><span>{lang === 'hi' ? 'विशेष अनुरोध' : 'Special request'}</span><textarea rows={4} value={data.request} onChange={event => update('request', event.target.value)} placeholder={lang === 'hi' ? 'वरिष्ठजन, accessibility, arrival time…' : 'Senior citizen needs, accessibility, arrival time…'} /></label></div></StepFrame>}
          {step === 4 && room && <StepFrame number="05" eyebrow={lang === 'hi' ? 'एक बार जाँच लें' : 'Review your request'} title={lang === 'hi' ? 'बुकिंग समीक्षा' : 'Review your stay request'} text={lang === 'hi' ? 'आगे बढ़ने से पहले सभी booking details जाँचें।' : 'Check every booking detail before continuing.'}><BookingSummary bookingData={data} roomName={tx(room.name)} roomImage={room.image} roomCooling={tx(room.cooling)} roomBeds={tx(room.beds)} nights={nights} estimated={estimated} tariff={room.tariff} lang={lang} /></StepFrame>}
          {step === 5 && room && <StepFrame number="06" eyebrow={lang === 'hi' ? 'बुकिंग अनुरोध' : 'Booking request'} title={lang === 'hi' ? 'अनुरोध भेजने के लिए तैयार?' : 'Ready to send your request?'} text={lang === 'hi' ? 'यह अंतिम step है। यहाँ online payment नहीं लिया जाता; room confirmation request review के बाद होती है।' : 'This is the final step. No online payment is collected here; room confirmation follows request review.'}><div className="request-ready"><span><Send /></span><div><h3>{data.name}</h3><p>{tx(room.name)} · {formatDate(data.checkIn, lang)} — {formatDate(data.checkOut, lang)}</p></div></div><div className="request-checklist"><p><CheckCircle2 />{lang === 'hi' ? 'Reference से request status दोबारा देखा जा सकेगा' : 'Use the reference to reopen the request status'}</p><p><CheckCircle2 />{lang === 'hi' ? 'Booking Status page पर request details दोबारा देख सकते हैं' : 'You can reopen the request details on the Booking Status page'}</p><p><ShieldCheck />{lang === 'hi' ? 'अंतिम room confirmation review के बाद होती है' : 'Final room confirmation follows review'}</p></div><DemoNotice compact /></StepFrame>}
          {step === 6 && booking && <div className="booking-success"><div className="booking-success__icon"><Check /></div><span className="eyebrow">{lang === 'hi' ? 'बुकिंग अनुरोध' : 'Booking request'}</span><h2>{lang === 'hi' ? 'अनुरोध तैयार है' : 'Request ready'}</h2><p>{lang === 'hi' ? 'अपना reference सुरक्षित रखें। अंतिम room availability और confirmation request review के बाद तय होती है।' : 'Keep your reference safe. Final room availability and confirmation are determined after request review.'}</p><div className="reference-card"><small>{lang === 'hi' ? 'आपका booking reference' : 'Your booking reference'}</small><strong>{booking.reference}</strong><button type="button" className="reference-copy" onClick={() => copyReference(booking.reference)}><Copy />{lang === 'hi' ? 'कॉपी करें' : 'Copy reference'}</button><p><Clock3 />{lang === 'hi' ? 'स्थिति: अनुरोध तैयार' : 'Status: Request ready'}</p></div><div className="confirmation-details"><p><span>{lang === 'hi' ? 'अतिथि' : 'Guest'}</span><strong>{booking.guestName}</strong></p><p><span>{lang === 'hi' ? 'कक्ष' : 'Room'}</span><strong>{room ? tx(room.name) : booking.roomName}</strong></p><p><span>{lang === 'hi' ? 'तारीखें' : 'Dates'}</span><strong>{formatDate(booking.checkIn, lang)} — {formatDate(booking.checkOut, lang)}</strong></p></div>{!storageSaved && <p className="booking-error"><CircleAlert />{lang === 'hi' ? 'Browser storage उपलब्ध नहीं था; refresh के बाद यह reference नहीं मिल सकता।' : 'Browser storage was unavailable; this reference may not survive a refresh.'}</p>}<div className="booking-success__actions"><Link className="btn btn--primary" to={`/booking-status?ref=${booking.reference}`}>{lang === 'hi' ? 'बुकिंग स्थिति देखें' : 'Check booking status'}<ArrowRight /></Link><Link className="btn btn--outline" to="/"><Home />{lang === 'hi' ? 'होम पर लौटें' : 'Back to home'}</Link><a className="btn btn--outline" href={createWhatsappLink(createBookingWhatsappMessage({ reference: booking.reference, guestName: booking.guestName, room: booking.roomName, checkIn: booking.checkIn, checkOut: booking.checkOut }))} target="_blank" rel="noreferrer" onClick={() => showToast(lang === 'hi' ? 'WhatsApp पूछताछ तैयार है' : 'WhatsApp enquiry prepared')}><MessageCircle />WhatsApp</a></div><button className="booking-restart" onClick={restart}><RotateCcw />{lang === 'hi' ? 'नया अनुरोध' : 'Create another request'}</button></div>}
          {error && <p className="booking-error" role="alert"><CircleAlert />{error}</p>}
          {step < 6 && <div className="booking-nav">{step > 0 ? <button className="btn btn--ghost" onClick={() => { setStep(value => value - 1); setError('') }}><ArrowLeft />{lang === 'hi' ? 'पीछे' : 'Back'}</button> : <Link className="btn btn--ghost" to="/rooms"><ArrowLeft />{lang === 'hi' ? 'कक्ष देखें' : 'View rooms'}</Link>}<button className="btn btn--primary" onClick={step === 5 ? confirm : next}>{step === 5 ? (lang === 'hi' ? 'बुकिंग अनुरोध बनाएँ' : 'Create booking request') : (lang === 'hi' ? 'आगे बढ़ें' : 'Continue')}<ArrowRight /></button></div>}
        </section>
        {step < 6 && <BookingAside data={data} room={room} nights={nights} estimated={estimated} lang={lang} roomName={room ? tx(room.name) : ''} />}
      </div>
    </section>
  </>
}

function StepFrame({ number, eyebrow, title, text, children }: { number: string; eyebrow: string; title: string; text: string; children: ReactNode }) {
  return <div className="booking-step"><div className="booking-step__number">{number}</div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{text}</p><div className="booking-step__content">{children}</div></div>
}

function QuickDates({ onPick, today, lang }: { onPick: (checkIn: string, checkOut: string) => void; today: string; lang: 'hi' | 'en' }) {
  return <div className="quick-dates"><button type="button" onClick={() => onPick(today, addDays(today, 1))}>{lang === 'hi' ? 'आज · 1 रात' : 'Today · 1 night'}</button><button type="button" onClick={() => onPick(addDays(today, 1), addDays(today, 3))}>{lang === 'hi' ? 'कल · 2 रातें' : 'Tomorrow · 2 nights'}</button><button type="button" onClick={() => onPick(addDays(today, 7), addDays(today, 10))}>{lang === 'hi' ? 'अगला सप्ताह · 3 रातें' : 'Next week · 3 nights'}</button></div>
}

function Counter({ label, hint, value, min, max, onChange }: { label: string; hint: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <div className="counter"><span><strong>{label}</strong><small>{hint}</small></span><div><button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}><Minus /></button><strong aria-live="polite">{value}</strong><button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}><Plus /></button></div></div>
}

function DemoAvailabilityBadge({ availability, lang }: { availability: DemoAvailability; lang: 'hi' | 'en' }) {
  const label = availability.state === 'soldout' ? (lang === 'hi' ? 'उपलब्ध नहीं' : 'Sold out') : availability.state === 'limited' ? (lang === 'hi' ? `केवल ${availability.left} शेष` : `Only ${availability.left} left`) : (lang === 'hi' ? 'उपलब्ध' : 'Available')
  return <span className={`status status--${availability.state}`}><span />{label}</span>
}

function BookingSummary({ bookingData, roomName, roomImage, roomCooling, roomBeds, nights, estimated, tariff, lang }: { bookingData: BookingData; roomName: string; roomImage: string; roomCooling: string; roomBeds: string; nights: number; estimated: number; tariff: number; lang: 'hi' | 'en' }) {
  return <><div className="summary-card"><div className="summary-card__room"><img src={roomImage} alt="" /><div><small>{lang === 'hi' ? 'चुना गया कक्ष' : 'Selected room'}</small><h3>{roomName}</h3><p>{roomBeds} · {roomCooling}</p></div></div><dl><div><dt>{lang === 'hi' ? 'आगमन' : 'Check-in'}</dt><dd>{formatDate(bookingData.checkIn, lang)}</dd></div><div><dt>{lang === 'hi' ? 'प्रस्थान' : 'Check-out'}</dt><dd>{formatDate(bookingData.checkOut, lang)}</dd></div><div><dt>{lang === 'hi' ? 'अवधि' : 'Duration'}</dt><dd>{nights} {lang === 'hi' ? 'रातें' : 'nights'}</dd></div><div><dt>{lang === 'hi' ? 'अतिथि' : 'Guests'}</dt><dd>{bookingData.adults} {lang === 'hi' ? 'वयस्क' : 'adults'} · {bookingData.children} {lang === 'hi' ? 'बच्चे' : 'children'}</dd></div><div><dt>{lang === 'hi' ? 'मुख्य अतिथि' : 'Primary guest'}</dt><dd>{bookingData.name}</dd></div><div><dt>{lang === 'hi' ? 'संपर्क' : 'Contact'}</dt><dd>{bookingData.phone}</dd></div><div><dt>{lang === 'hi' ? 'शहर' : 'City'}</dt><dd>{bookingData.city}</dd></div><div><dt>{lang === 'hi' ? 'ईमेल' : 'Email'}</dt><dd>{bookingData.email || (lang === 'hi' ? 'नहीं दिया' : 'Not provided')}</dd></div>{bookingData.request && <div className="summary-card__request"><dt>{lang === 'hi' ? 'विशेष अनुरोध' : 'Special request'}</dt><dd>{bookingData.request}</dd></div>}</dl><div className="summary-card__total"><span><small>{lang === 'hi' ? 'अनुमानित कुल' : 'Estimated total'}</small><strong>{nights} × {bookingData.roomCount} × ₹{tariff.toLocaleString('en-IN')}</strong></span><strong>₹{estimated.toLocaleString('en-IN')}*</strong></div><p>*{lang === 'hi' ? 'अंतिम टैरिफ, कर और नीति management confirmation के अधीन।' : 'Final tariff, taxes and policy are subject to management confirmation.'}</p></div><div className="consent-note"><ShieldCheck /><span><strong>{lang === 'hi' ? 'बुकिंग अनुरोध' : 'Booking request'}</strong>{lang === 'hi' ? 'यहाँ online payment नहीं लिया जाता। अंतिम room confirmation request review के बाद होती है।' : 'No online payment is collected here. Final room confirmation follows request review.'}</span></div></>
}

function BookingAside({ data, room, nights, estimated, lang, roomName }: { data: BookingData; room: (typeof rooms)[number] | undefined; nights: number; estimated: number; lang: 'hi' | 'en'; roomName: string }) {
  return <aside className="booking-aside"><div className="booking-aside__top"><Sparkles /><div><strong>{lang === 'hi' ? 'आपकी यात्रा' : 'Your stay'}</strong><small>{lang === 'hi' ? 'जानकारी साथ-साथ अपडेट होगी' : 'Updates as you make choices'}</small></div></div><dl><div><dt>{lang === 'hi' ? 'तारीखें' : 'Dates'}</dt><dd>{data.checkIn ? formatDate(data.checkIn, lang) : '—'}<br />{data.checkOut ? formatDate(data.checkOut, lang) : '—'}</dd></div><div><dt>{lang === 'hi' ? 'अवधि' : 'Duration'}</dt><dd>{nights || '—'} {nights ? (lang === 'hi' ? 'रातें' : 'nights') : ''}</dd></div><div><dt>{lang === 'hi' ? 'अतिथि' : 'Guests'}</dt><dd>{data.adults + data.children} · {data.roomCount} {lang === 'hi' ? 'कक्ष' : 'room(s)'}</dd></div><div><dt>{lang === 'hi' ? 'कक्ष' : 'Room'}</dt><dd>{room ? roomName : '—'}</dd></div></dl>{room && <div className="booking-aside__estimate"><small>{lang === 'hi' ? 'अनुमानित कुल' : 'Estimated total'}</small><strong>₹{estimated.toLocaleString('en-IN')}</strong></div>}<DemoNotice compact /><Link className="booking-aside__ai" to="/ai-assistant?prompt=family"><Bot /><span><strong>{lang === 'hi' ? 'कक्ष चुनने में मदद?' : 'Need help choosing?'}</strong><small>{lang === 'hi' ? 'AI यात्रा सहायक से पूछें' : 'Ask the AI Travel Assistant'}</small></span><ArrowRight /></Link><p className="booking-aside__help"><Phone />{lang === 'hi' ? 'सहायता चाहिए?' : 'Need assistance?'} <a href={`tel:${siteConfig.phoneLink}`}>{siteConfig.phoneDisplay}</a></p></aside>
}

const statusLabels = {
  received: { hi: 'अनुरोध तैयार', en: 'Request Created' },
  awaiting: { hi: 'पुष्टि की प्रतीक्षा', en: 'Awaiting Confirmation' },
  confirmed: { hi: 'पुष्टि हुई', en: 'Confirmed' },
  cancelled: { hi: 'रद्द किया गया', en: 'Cancelled' },
} satisfies Record<DemoBookingStatus, { hi: string; en: string }>

const statusOrder: DemoBookingStatus[] = ['received', 'awaiting', 'confirmed']

export function BookingStatus() {
  const { lang } = useLanguage()
  const [query] = useSearchParams()
  const initialReference = (query.get('ref') || '').trim().toUpperCase()
  const [input, setInput] = useState(initialReference)
  const [searched, setSearched] = useState(Boolean(initialReference))
  const [invalid, setInvalid] = useState(false)
  const [found, setFound] = useState<DemoBooking | null>(() => findByReference(initialReference))

  useEffect(() => {
    const refresh = () => { if (input) setFound(findByReference(input)) }
    window.addEventListener(DEMO_BOOKINGS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => { window.removeEventListener(DEMO_BOOKINGS_EVENT, refresh); window.removeEventListener('storage', refresh) }
  }, [input])

  function search(event: FormEvent) {
    event.preventDefault()
    const normalized = input.trim().toUpperCase()
    const valid = /^MSD-(?:DEMO-)?[A-Z0-9]{6}$/.test(normalized)
    setInvalid(!valid)
    setSearched(valid)
    setFound(valid ? findByReference(normalized) : null)
    setInput(normalized)
  }

  const activeIndex = found ? statusOrder.indexOf(found.status) : -1
  return <><PageMeta title={lang === 'hi' ? 'बुकिंग स्थिति' : 'Booking Status'} /><PageHero eyebrow={lang === 'hi' ? 'बुकिंग request tracker' : 'Booking request tracker'} title={lang === 'hi' ? 'अपने अनुरोध की स्थिति देखें' : 'Track your stay request'} text={lang === 'hi' ? 'अपना MSD booking reference डालकर request details देखें।' : 'Enter your MSD booking reference to view the request details.'} /><section className="section status-page"><div className="container status-page__inner"><div className="status-search"><h2>{lang === 'hi' ? 'बुकिंग reference दर्ज करें' : 'Enter booking reference'}</h2><form onSubmit={search}><input value={input} onChange={event => { setInput(event.target.value.toUpperCase()); setInvalid(false) }} placeholder="MSD-XXXXXX" aria-label={lang === 'hi' ? 'बुकिंग reference' : 'Booking reference'} /><button className="btn btn--primary" type="submit">{lang === 'hi' ? 'स्थिति देखें' : 'Check status'}<ArrowRight /></button></form>{invalid && <p className="form-error" role="alert">{lang === 'hi' ? 'Reference MSD-XXXXXX format में डालें।' : 'Enter a reference in MSD-XXXXXX format.'}</p>}</div>{searched && found && <BookingStatusResult booking={found} lang={lang} activeIndex={activeIndex} />}{searched && !found && !invalid && <div className="status-empty"><span><CircleAlert /></span><h2>{lang === 'hi' ? 'यह booking reference नहीं मिला' : 'Booking reference not found'}</h2><p>{lang === 'hi' ? 'Reference दोबारा जाँचें और वही booking reference डालें जो request बनाते समय मिला था।' : 'Check the reference and enter the booking reference created with your request.'}</p><Link className="btn btn--outline" to="/booking">{lang === 'hi' ? 'नया booking अनुरोध' : 'Create a booking request'}<ArrowRight /></Link></div>}</div></section></>
}

function findByReference(reference: string) {
  if (!reference) return null
  return findDemoBooking(reference)
}

function BookingStatusResult({ booking, lang, activeIndex }: { booking: DemoBooking; lang: 'hi' | 'en'; activeIndex: number }) {
  const showToast = useToast()
  async function copyReference() {
    const copied = await copyText(booking.reference)
    showToast(copied ? (lang === 'hi' ? 'बुकिंग reference कॉपी किया गया' : 'Booking reference copied') : { message: lang === 'hi' ? 'Reference कॉपी नहीं हो सका' : 'Could not copy the reference', tone: 'error' })
  }
  return <div className="status-result"><div className="status-result__head"><div><span className="eyebrow">{lang === 'hi' ? 'आपका booking अनुरोध' : 'Your booking request'}</span><h2>{booking.reference}</h2><button className="status-copy" type="button" onClick={copyReference}><Copy />{lang === 'hi' ? 'Reference कॉपी करें' : 'Copy reference'}</button></div><span className={`request-state request-state--${booking.status}`}>{statusLabels[booking.status][lang]}</span></div><div className="status-booking-details"><p><span>{lang === 'hi' ? 'अतिथि' : 'Guest'}</span><strong>{booking.guestName}</strong></p><p><span>{lang === 'hi' ? 'कक्ष' : 'Room'}</span><strong>{booking.roomName}</strong></p><p><span>{lang === 'hi' ? 'चेक-इन' : 'Check-in'}</span><strong>{formatDate(booking.checkIn, lang)}</strong></p><p><span>{lang === 'hi' ? 'चेक-आउट' : 'Check-out'}</span><strong>{formatDate(booking.checkOut, lang)}</strong></p><p><span>{lang === 'hi' ? 'अतिथि' : 'Guests'}</span><strong>{booking.adults} {lang === 'hi' ? 'वयस्क' : 'adults'} · {booking.children} {lang === 'hi' ? 'बच्चे' : 'children'}</strong></p><p><span>{lang === 'hi' ? 'अनुमानित कुल' : 'Estimated total'}</span><strong>₹{booking.estimatedDemoTotal.toLocaleString('en-IN')}*</strong></p></div>{booking.status === 'cancelled' ? <div className="cancelled-panel"><CircleAlert /><div><h3>{statusLabels.cancelled[lang]}</h3><p>{lang === 'hi' ? 'यह request cancelled है। सहायता के लिए प्रबंधन से संपर्क करें।' : 'This request is cancelled. Contact management for assistance.'}</p></div></div> : <div className="status-timeline">{statusOrder.map((item, index) => <div className={`${index <= activeIndex ? 'active' : ''} ${index < activeIndex ? 'complete' : ''}`} key={item}><span>{index < activeIndex ? <Check /> : index + 1}</span><div><strong>{statusLabels[item][lang]}</strong><small>{index === 0 ? (lang === 'hi' ? 'अनुरोध तैयार किया गया' : 'Request created') : index === 1 ? (lang === 'hi' ? 'Availability review' : 'Availability review') : (lang === 'hi' ? 'Confirmation status' : 'Confirmation status')}</small></div></div>)}</div>}<div className="status-result__notice"><ShieldCheck /><p><strong>{lang === 'hi' ? 'बुकिंग जानकारी' : 'Booking information'}</strong>{lang === 'hi' ? 'अंतिम room allocation और payment details पुष्टि के समय तय होते हैं।' : 'Final room allocation and payment details are handled at confirmation.'}</p></div></div>
}
