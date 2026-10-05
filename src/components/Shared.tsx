import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Accessibility, BedDouble, CarFront, Check, Clock3, Droplets, MapPin,
  ShieldCheck, Sparkles, UtensilsCrossed, Users, Wifi, Wind,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { heroImage, siteConfig } from '../data/site'
import type { Availability, Room } from '../types'
import { handleImageError } from '../services/imageFallback'

const defaultMetaDescription = 'Maharashtra Samaj Dharamshala in Ujjain — rooms, stay requests, Ujjain travel guidance and direct contact in Hindi and English.'

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export function PageMeta({ title, description = defaultMetaDescription }: { title: string; description?: string }) {
  useEffect(() => {
    const fullTitle = `${title} | ${siteConfig.businessName}`
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`
    const socialImage = `${window.location.origin}${heroImage}`
    document.title = fullTitle
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    setMeta('meta[property="og:image"]', 'property', 'og:image', socialImage)
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', socialImage)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
    let schema = document.head.querySelector<HTMLScriptElement>('script[data-msd-schema]')
    if (!schema) {
      schema = document.createElement('script')
      schema.type = 'application/ld+json'
      schema.dataset.msdSchema = 'true'
      document.head.appendChild(schema)
    }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LodgingBusiness',
      name: siteConfig.businessName,
      url: window.location.origin,
      telephone: siteConfig.phoneDisplay,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ujjain',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN',
      },
      availableLanguage: ['hi', 'en'],
    })
  }, [description, title])
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
        <span className="concept-label">{lang === 'hi' ? 'प्रतीकात्मक दृश्य' : 'Illustrative view'}</span>
      </div>
      <div className="room-card__body">
        <div className="room-card__title"><div><h3>{tx(room.name)}</h3><p>{tx(room.tagline)}</p></div><span className="room-card__price"><strong>₹{room.tariff.toLocaleString('en-IN')}</strong> <small>/{lang === 'hi' ? 'रात*' : 'night*'}</small></span></div>
        <div className="room-card__facts">
          <span><Users size={17} /> {room.occupancy} {lang === 'hi' ? 'अतिथि' : 'guests'}</span>
          <span><BedDouble size={17} /> {tx(room.beds)}</span>
          <span><Wind size={17} /> {tx(room.cooling)}</span>
        </div>
        <p className="room-card__note">*{lang === 'hi' ? 'दिखाया गया टैरिफ — अंतिम दर अनुरोध की पुष्टि पर तय होगी' : 'Displayed tariff — final rate is confirmed with the request'}</p>
        <div className="room-card__actions">
          <Link className="btn btn--ghost" to={`/rooms/${room.id}`}>{lang === 'hi' ? 'विवरण देखें' : 'View details'}</Link>
          {room.availability === 'soldout' ? <button className="btn btn--primary is-disabled" type="button" disabled>{lang === 'hi' ? 'अभी उपलब्ध नहीं' : 'Currently unavailable'}</button> : <Link className="btn btn--primary" to={`/booking?room=${room.id}`}>{lang === 'hi' ? 'यह कक्ष बुक करें' : 'Book this room'}</Link>}
        </div>
      </div>
    </article>
  )
}

export function DemoNotice({ compact = false }: { compact?: boolean }) {
  const { lang } = useLanguage()
  return <div className={`demo-notice ${compact ? 'demo-notice--compact' : ''}`}><ShieldCheck size={20} /><p><strong>{lang === 'hi' ? 'बुकिंग जानकारी' : 'Booking information'}</strong>{lang === 'hi' ? ' — कक्ष आवंटन, टैरिफ और उपलब्धता अनुरोध की समीक्षा के समय अंतिम रूप से पुष्टि की जाती है।' : ' — Room allocation, tariffs and availability are finally confirmed when the request is reviewed.'}</p></div>
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
