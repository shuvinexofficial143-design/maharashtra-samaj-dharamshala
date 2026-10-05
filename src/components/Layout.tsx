import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Bot, CalendarDays, ChevronRight, Languages, MapPin, Menu, MessageCircle, Phone, Sparkles, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { rooms, siteConfig } from '../data/site'
import { createWhatsappLink } from '../services/contactLinks'

const navItems = [
  { to: '/', hi: 'होम', en: 'Home' },
  { to: '/rooms', hi: 'कक्ष', en: 'Rooms' },
  { to: '/facilities', hi: 'सुविधाएँ', en: 'Facilities' },
  { to: '/nearby', hi: 'आस-पास', en: 'Nearby' },
  { to: '/gallery', hi: 'गैलरी', en: 'Gallery' },
  { to: '/about', hi: 'परिचय', en: 'About' },
  { to: '/contact', hi: 'संपर्क', en: 'Contact' },
]

const currentYear = new Date().getFullYear()

export function Layout({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8)
  const location = useLocation()
  const isAIAssistant = location.pathname.startsWith('/ai-assistant')
  const usesMinimalShell = isAIAssistant
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [location.pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  useLayoutEffect(() => {
    document.body.classList.toggle('route-ai-assistant', isAIAssistant)
    return () => document.body.classList.remove('route-ai-assistant')
  }, [isAIAssistant])
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKey)
    return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('keydown', handleKey) }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">{lang === 'hi' ? 'मुख्य सामग्री पर जाएँ' : 'Skip to main content'}</a>
      {!usesMinimalShell && <div className="topbar"><div className="container topbar__inner"><p><span className="pulse-dot" />{lang === 'hi' ? 'महाकाल यात्रा के लिए सहज और पारिवारिक ठहराव' : 'A comfortable, family-friendly stay for your Mahakal journey'}</p><div><a href={`tel:${siteConfig.phoneLink}`}><Phone size={13} />{siteConfig.phoneDisplay}</a><Link to="/booking-status">{lang === 'hi' ? 'बुकिंग स्थिति' : 'Booking status'} <ChevronRight size={14} /></Link></div></div></div>}
      {!usesMinimalShell && <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav-wrap">
          <Link className="brand" to="/" aria-label={`${siteConfig.businessName} home`} onClick={() => setOpen(false)}>
            <span className="brand__mark" aria-hidden="true"><span>ॐ</span></span>
            <span className="brand__copy"><strong>{siteConfig.brandName}</strong><small>{siteConfig.propertyLabel[lang]}</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">{navItems.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/'}>{item[lang]}</NavLink>)}</nav>
          <div className="nav-actions">
            <div className="language-switch" aria-label="Language selection"><Languages size={16} /><button type="button" className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')}>हिन्दी</button><span>|</span><button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button></div>
            <Link className="btn btn--primary btn--nav" to="/booking"><CalendarDays size={17} />{lang === 'hi' ? 'बुक करें' : 'Book now'}</Link>
            <button className="menu-button" type="button" onClick={() => setOpen(v => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X /> : <Menu />}</button>
          </div>
        </div>
      </header>}
      {!usesMinimalShell && <div id="mobile-navigation" className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav>{navItems.map((item, index) => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}><span>0{index + 1}</span>{item[lang]}<ArrowUpRight size={18} /></NavLink>)}<NavLink to="/faq" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}><span>08</span>{lang === 'hi' ? 'सामान्य प्रश्न' : 'FAQ'}<ArrowUpRight size={18} /></NavLink></nav>
        <div className="mobile-menu__footer"><p>{lang === 'hi' ? 'यात्रा में सहायता चाहिए?' : 'Need help planning your stay?'}</p><a href={`tel:${siteConfig.phoneLink}`} tabIndex={open ? 0 : -1}><Phone size={18} />{siteConfig.phoneDisplay}</a></div>
      </div>}
      <main id="main-content" className={isAIAssistant ? 'main--ai' : undefined}>{children}</main>
      {!usesMinimalShell && <Footer />}
      {!usesMinimalShell && <div className="floating-action-rail" aria-label={lang === 'hi' ? 'जल्द actions' : 'Quick actions'}>
        <Link to="/ai-assistant" className="floating-action-rail__ai"><Sparkles /><span>{lang === 'hi' ? 'AI सहायक' : 'Ask AI'}</span></Link>
        <Link to="/booking"><CalendarDays /><span>{lang === 'hi' ? 'बुक करें' : 'Book'}</span></Link>
        <a href={createWhatsappLink()} target="_blank" rel="noreferrer"><MessageCircle /><span>WhatsApp</span></a>
      </div>}
      {!usesMinimalShell && <div className="mobile-dock" aria-label="Quick actions">
        <a href={`tel:${siteConfig.phoneLink}`}><Phone size={19} /><span>{lang === 'hi' ? 'कॉल' : 'Call'}</span></a>
        <a href={createWhatsappLink()} target="_blank" rel="noreferrer"><MessageCircle size={19} /><span>WhatsApp</span></a>
        <Link to="/ai-assistant"><Bot size={19} /><span>{lang === 'hi' ? 'AI सहायक' : 'Ask AI'}</span></Link>
        <Link className="mobile-dock__book" to="/booking"><CalendarDays size={19} /><span>{lang === 'hi' ? 'बुक करें' : 'Book'}</span></Link>
      </div>}
    </>
  )
}

function Footer() {
  const { lang } = useLanguage()
  return (
    <footer className="footer">
      <div className="footer__sun" aria-hidden="true" />
      <div className="container footer__grid">
        <div className="footer__brand"><div className="brand brand--light"><span className="brand__mark"><span>ॐ</span></span><span className="brand__copy"><strong>{siteConfig.brandName}</strong><small>{siteConfig.propertyLabel[lang]}</small></span></div><p>{lang === 'hi' ? 'उज्जैन आने वाले श्रद्धालुओं और परिवारों के लिए सरल, स्वच्छ और स्नेहपूर्ण ठहराव।' : 'A simple, clean and welcoming stay for pilgrims and families visiting Ujjain.'}</p><div className="footer__quick-contact"><a href={`tel:${siteConfig.phoneLink}`}><Phone />{lang === 'hi' ? 'कॉल' : 'Call'}</a><a href={createWhatsappLink()} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp</a></div></div>
        <div><h3>{lang === 'hi' ? 'जल्द पहुँचें' : 'Explore'}</h3><Link to="/rooms">{lang === 'hi' ? 'कक्ष एवं टैरिफ' : 'Rooms & tariffs'}</Link><Link to="/booking">{lang === 'hi' ? 'बुकिंग अनुरोध' : 'Booking request'}</Link><Link to="/nearby">{lang === 'hi' ? 'उज्जैन दर्शन' : 'Explore Ujjain'}</Link><Link to="/booking-status">{lang === 'hi' ? 'बुकिंग स्थिति' : 'Booking status'}</Link></div>
        <div><h3>{lang === 'hi' ? 'जानकारी' : 'Information'}</h3><Link to="/facilities">{lang === 'hi' ? 'सुविधाएँ' : 'Facilities'}</Link><Link to="/faq">{lang === 'hi' ? 'सामान्य प्रश्न' : 'FAQ'}</Link><Link to="/contact">{lang === 'hi' ? 'संपर्क व दिशा' : 'Contact & directions'}</Link></div>
        <div><h3>{lang === 'hi' ? 'कक्ष' : 'Rooms'}</h3>{rooms.map(room => <Link key={room.id} to={`/rooms/${room.id}`}>{room.name[lang]}</Link>)}</div>
        <div className="footer__address"><h3>{lang === 'hi' ? 'हम तक पहुँचें' : 'Find us'}</h3><p><MapPin size={18} />{siteConfig.address[lang]}</p><a className="text-link text-link--light" href={siteConfig.directionsLink} target="_blank" rel="noreferrer">{lang === 'hi' ? 'Maps में खोजें' : 'Search on Maps'} <ArrowUpRight size={15} /></a></div>
      </div>
      <div className="container footer__bottom"><p>{siteConfig.disclaimer}</p><span>© {currentYear} · Ujjain, Madhya Pradesh</span></div>
    </footer>
  )
}
