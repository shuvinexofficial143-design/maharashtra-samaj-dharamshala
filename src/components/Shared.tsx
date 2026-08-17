import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Accessibility, BedDouble, CarFront, Check, Clock3, Droplets, MapPin,
  ShieldCheck, Sparkles, UtensilsCrossed, Users, Wifi, Wind,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { siteConfig } from '../data/site'
import type { Availability, Room } from '../types'
import { handleImageError } from '../services/imageFallback'

export function PageMeta({ title }: { title: string }) {
  useEffect(() => { document.title = `${title} | ${siteConfig.businessName}` }, [title])
  return null
}

export function SectionHeading({ eyebrow, title, text, center = false }: { eyebrow: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={`section-heading ${center ? 'section-heading--center' : ''}`}>
      <span className="eyebrow"><Sparkles size={14} aria-hidden="true" /> {eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

export function PageHero({ eyebrow, title, text, image, children }: { eyebrow: string; title: string; text: string; image?: string; children?: ReactNode }) {
  return (
    <section className="page-hero" style={image ? { backgroundImage: `linear-gradient(90deg, rgba(49,10,10,.92), rgba(49,10,10,.58)), url(${image})` } : undefined}>
      <div className="page-hero__pattern" aria-hidden="true" />
      <div className="container page-hero__inner reveal">
        <span className="eyebrow eyebrow--light">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
        {children}
      </div>
    </section>
  )
}

const amenityIcons = { bed: BedDouble, droplets: Droplets, utensils: UtensilsCrossed, car: CarFront, wifi: Wifi, shield: ShieldCheck, clock: Clock3, accessibility: Accessibility }
export function AmenityIcon({ name, size = 24 }: { name: keyof typeof amenityIcons; size?: number }) {
  const Icon = amenityIcons[name]
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />
}

export function AvailabilityBadge({ status }: { status: Availability }) {
  const { lang } = useLanguage()
  const copy = {
    available: { hi: 'उपलब्ध', en: 'Available' },
    limited: { hi: 'कुछ कक्ष शेष', en: 'Few rooms left' },
    soldout: { hi: 'अभी उपलब्ध नहीं', en: 'Sold out' },
  }
  return <span className={`status status--${status}`}><span />{copy[status][lang]}</span>
}

export function RoomCard({ room }: { room: Room }) {
  const { lang, tx } = useLanguage()
  return (
    <article className="room-card">
      <div className="room-card__media">
        <img src={room.image} alt={tx(room.name)} loading="lazy" decoding="async" onError={handleImageError} />
        <AvailabilityBadge status={room.availability} />
        <span className="concept-label">{lang === 'hi' ? 'डेमो चित्र' : 'Concept image'}</span>
      </div>
      <div className="room-card__body">
        <div className="room-card__title"><div><h3>{tx(room.name)}</h3><p>{tx(room.tagline)}</p></div><span className="room-card__price"><strong>₹{room.tariff.toLocaleString('en-IN')}</strong> <small>/{lang === 'hi' ? 'रात*' : 'night*'}</small></span></div>
        <div className="room-card__facts">
          <span><Users size={17} /> {room.occupancy} {lang === 'hi' ? 'अतिथि' : 'guests'}</span>
          <span><BedDouble size={17} /> {tx(room.beds)}</span>
          <span><Wind size={17} /> {tx(room.cooling)}</span>
        </div>
        <p className="room-card__note">*{lang === 'hi' ? 'डेमो टैरिफ — अंतिम दर प्रबंधन द्वारा पुष्टि होगी' : 'Demo tariff — final rate to be confirmed by management'}</p>
        <div className="room-card__actions">
          <Link className="btn btn--ghost" to={`/rooms/${room.id}`}>{lang === 'hi' ? 'विवरण देखें' : 'View details'}</Link>
          <Link className={`btn btn--primary ${room.availability === 'soldout' ? 'is-disabled' : ''}`} to={`/booking?room=${room.id}`} aria-disabled={room.availability === 'soldout'}>{lang === 'hi' ? 'यह कक्ष बुक करें' : 'Book this room'}</Link>
        </div>
      </div>
    </article>
  )
}

export function DemoNotice({ compact = false }: { compact?: boolean }) {
  const { lang } = useLanguage()
  return <div className={`demo-notice ${compact ? 'demo-notice--compact' : ''}`}><ShieldCheck size={20} /><p><strong>{lang === 'hi' ? 'प्रस्तुति डेमो' : 'Presentation demo'}</strong>{lang === 'hi' ? ' — यहाँ दिखाई गई उपलब्धता, टैरिफ और पुष्टि केवल नमूना डेटा है।' : ' — Availability, tariffs and confirmations shown here are sample data only.'}</p></div>
}

export function TrustStrip() {
  const { lang } = useLanguage()
  const items = [
    [ShieldCheck, lang === 'hi' ? 'समुदाय का भरोसा' : 'Community trust'],
    [MapPin, lang === 'hi' ? 'उज्जैन यात्रा के लिए' : 'Made for Ujjain visits'],
    [Users, lang === 'hi' ? 'परिवार-अनुकूल' : 'Family friendly'],
    [Check, lang === 'hi' ? 'सरल बुकिंग अनुरोध' : 'Simple stay request'],
  ] as const
  return <div className="trust-strip">{items.map(([Icon, label]) => <div key={label}><Icon size={19} /><span>{label}</span></div>)}</div>
}
