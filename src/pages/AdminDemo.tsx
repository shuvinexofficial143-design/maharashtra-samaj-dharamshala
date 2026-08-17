import { useEffect, useState, type ElementType, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, BedDouble, Bell, CalendarCheck, CalendarDays, Check, ChevronDown, Clock3, ExternalLink, Image, LayoutDashboard, Menu, MessageSquareText, MoreHorizontal, Plus, RefreshCcw, Settings, Sparkles, Tags, UserRound, Users, X } from 'lucide-react'
import { PageMeta } from '../components/Shared'
import { useLanguage } from '../context/LanguageContext'
import { rooms, siteConfig } from '../data/site'
import { createManagementSampleBooking, DEMO_BOOKINGS_EVENT, listDemoBookings, resetDemoBookings, sampleDemoBookings, updateDemoBookingStatus, type DemoBooking, type DemoBookingStatus } from '../services/demoBookings'
import { useToast } from '../context/ToastContext'

type Panel = 'dashboard' | 'bookings' | 'rooms' | 'availability' | 'guests' | 'gallery' | 'tariffs' | 'notices' | 'contacts'

const statusCopy = {
  received: { hi: 'अनुरोध प्राप्त', en: 'Request Received' }, awaiting: { hi: 'पुष्टि की प्रतीक्षा', en: 'Awaiting Confirmation' },
  confirmed: { hi: 'पुष्टि हुई', en: 'Confirmed' }, cancelled: { hi: 'रद्द', en: 'Cancelled' },
} satisfies Record<DemoBookingStatus, { hi: string; en: string }>

function formatAdminDate(date: string, lang: 'hi' | 'en') {
  if (!date) return '—'
  return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short' }).format(new Date(`${date}T12:00:00`))
}

export function AdminDemo() {
  const { lang, tx } = useLanguage()
  const showToast = useToast()
  const [panel, setPanel] = useState<Panel>('dashboard')
  const [sidebar, setSidebar] = useState(false)
  const [localBookings, setLocalBookings] = useState<DemoBooking[]>(() => listDemoBookings())
  const [selected, setSelected] = useState<DemoBooking | null>(null)
  const [highlightedRef, setHighlightedRef] = useState('')

  useEffect(() => {
    const refresh = () => setLocalBookings(listDemoBookings())
    window.addEventListener(DEMO_BOOKINGS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => { window.removeEventListener(DEMO_BOOKINGS_EVENT, refresh); window.removeEventListener('storage', refresh) }
  }, [])
  useEffect(() => {
    if (!selected) return
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') setSelected(null) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', closeOnEscape) }
  }, [selected])

  const records = [...localBookings, ...sampleDemoBookings]
  const nav: { id: Panel; icon: ElementType; hi: string; en: string; count?: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, hi: 'डैशबोर्ड', en: 'Dashboard' },
    { id: 'bookings', icon: CalendarCheck, hi: 'बुकिंग अनुरोध', en: 'Booking requests', count: String(records.length) },
    { id: 'rooms', icon: BedDouble, hi: 'कक्ष', en: 'Rooms' }, { id: 'availability', icon: CalendarDays, hi: 'उपलब्धता', en: 'Availability' },
    { id: 'guests', icon: Users, hi: 'अतिथि', en: 'Guests' }, { id: 'gallery', icon: Image, hi: 'गैलरी', en: 'Gallery' },
    { id: 'tariffs', icon: Tags, hi: 'टैरिफ', en: 'Tariffs' }, { id: 'notices', icon: Bell, hi: 'सूचनाएँ', en: 'Notices', count: '2' },
    { id: 'contacts', icon: MessageSquareText, hi: 'संपर्क अनुरोध', en: 'Contact requests', count: '4' },
  ]
  const current = nav.find(item => item.id === panel)!

  function changeStatus(reference: string, status: DemoBookingStatus) {
    const updated = updateDemoBookingStatus(reference, status)
    if (!updated) {
      showToast({ message: lang === 'hi' ? 'डेमो स्थिति अपडेट नहीं हो सकी' : 'Demo status could not be updated', tone: 'error' })
      return
    }
    setLocalBookings(listDemoBookings())
    setSelected(updated)
    showToast(lang === 'hi' ? 'डेमो स्थिति अपडेट की गई' : 'Demo booking status updated')
  }

  function createSample() {
    const room = rooms.find(item => item.id === 'standard-ac') ?? rooms[0]
    const result = createManagementSampleBooking({ id: room.id, name: room.name.en, tariff: room.tariff })
    if (!result) {
      showToast({ message: lang === 'hi' ? 'Sample booking नहीं बन सकी' : 'Sample booking could not be created', tone: 'error' })
      return
    }
    setLocalBookings(listDemoBookings())
    setPanel('bookings')
    setHighlightedRef(result.booking.reference)
    showToast(result.created ? (lang === 'hi' ? 'डेमो बुकिंग बनाई गई' : 'Demo booking created') : (lang === 'hi' ? 'मौजूदा डेमो बुकिंग दिखाई गई' : 'Existing demo booking highlighted'))
  }

  function resetRecords() {
    const confirmed = window.confirm(lang === 'hi'
      ? 'केवल इस browser में बनाए गए presentation booking records हटेंगे। Built-in samples और website content सुरक्षित रहेंगे। जारी रखें?'
      : 'Only presentation booking records created in this browser will be removed. Built-in samples and website content will remain. Continue?')
    if (!confirmed) return
    const removed = resetDemoBookings()
    setLocalBookings([])
    setSelected(null)
    setHighlightedRef('')
    showToast(removed ? (lang === 'hi' ? `${removed} डेमो रिकॉर्ड reset किए गए` : `${removed} demo record${removed === 1 ? '' : 's'} reset`) : (lang === 'hi' ? 'कोई डेमो रिकॉर्ड हटाने के लिए नहीं था' : 'No demo records needed resetting'))
  }

  return <>
    <PageMeta title={lang === 'hi' ? 'एडमिन डेमो' : 'Admin Demo'} />
    <section className="admin-shell">
      <aside className={`admin-sidebar ${sidebar ? 'is-open' : ''}`}>
        <button className="admin-sidebar__close" onClick={() => setSidebar(false)} aria-label="Close sidebar"><X /></button>
        <div className="admin-brand"><span>ॐ</span><div><strong>MSD</strong><small>Admin preview</small></div></div>
        <div className="admin-demo-badge"><Sparkles />{lang === 'hi' ? 'डेमो एडमिनिस्ट्रेशन' : 'Demo Administration Preview'}</div>
        <nav>{nav.map(item => <button key={item.id} className={panel === item.id ? 'active' : ''} onClick={() => { setPanel(item.id); setSidebar(false); setSelected(null) }}><item.icon /><span>{item[lang]}</span>{item.count && <b>{item.count}</b>}</button>)}</nav>
        <div className="admin-sidebar__footer"><Settings /><span><strong>{lang === 'hi' ? 'डेमो सेटिंग्स' : 'Demo settings'}</strong><small>{lang === 'hi' ? 'Production में उपलब्ध' : 'Available in production'}</small></span></div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar"><button className="admin-menu" onClick={() => setSidebar(true)} aria-label="Open admin menu"><Menu /></button><div><span>{siteConfig.businessName}</span><small>{lang === 'hi' ? 'स्थानीय presentation workspace' : 'Local presentation workspace'}</small></div><div className="admin-user"><button aria-label="Notifications"><Bell /><i /></button><span>AM</span><div><strong>Admin Manager</strong><small>{lang === 'hi' ? 'डेमो उपयोगकर्ता' : 'Demo user'}</small></div><ChevronDown /></div></header>
        <div className="admin-disclaimer"><ShieldMini /> <span><strong>Demo Administration Preview</strong> — {lang === 'hi' ? 'कोई production authentication या live booking data नहीं।' : 'No production authentication or live booking data.'}</span></div>
        <div className="admin-content">
          <div className="admin-title"><div><span className="eyebrow">{lang === 'hi' ? 'ऑपरेशन्स ओवरव्यू' : 'Operations overview'}</span><h1>{current[lang]}</h1><p>{lang === 'hi' ? 'Presentation requests और स्पष्ट sample records का preview।' : 'A preview of presentation requests and clearly labelled sample records.'}</p></div><div className="admin-title__actions"><Link className="btn btn--outline" to="/"><ExternalLink />{lang === 'hi' ? 'Guest view' : 'Open guest view'}</Link><button className="btn btn--primary" onClick={createSample}><Plus />{lang === 'hi' ? 'Sample booking' : 'Create sample booking'}</button><button className="btn btn--outline admin-reset" onClick={resetRecords}><RefreshCcw />{lang === 'hi' ? 'Reset' : 'Reset demo records'}</button></div></div>
          {panel === 'dashboard' ? <Dashboard lang={lang} records={records} onOpen={setSelected} highlightedRef={highlightedRef} /> : panel === 'bookings' ? <BookingsModule lang={lang} records={records} onOpen={setSelected} highlightedRef={highlightedRef} /> : <ModulePreview panel={panel} title={current[lang]} lang={lang} tx={tx} />}
        </div>
      </div>
      {selected && <BookingDetail booking={selected} lang={lang} onClose={() => setSelected(null)} onStatusChange={changeStatus} />}
    </section>
  </>
}

function Dashboard({ lang, records, onOpen, highlightedRef }: { lang: 'hi' | 'en'; records: DemoBooking[]; onOpen: (booking: DemoBooking) => void; highlightedRef: string }) {
  const today = new Date().toISOString().slice(0, 10)
  const stats: { icon: ElementType; label: string; value: string; delta: string; tone: string }[] = [
    { icon: CalendarCheck, label: lang === 'hi' ? 'आज के अनुरोध' : "Today's Requests", value: String(records.filter(item => item.createdAt.slice(0, 10) === today).length), delta: lang === 'hi' ? 'Local + sample preview' : 'Local + sample preview', tone: 'saffron' },
    { icon: Clock3, label: lang === 'hi' ? 'लंबित अनुरोध' : 'Pending Requests', value: String(records.filter(item => item.status === 'received' || item.status === 'awaiting').length), delta: lang === 'hi' ? 'ध्यान आवश्यक' : 'Needs attention', tone: 'gold' },
    { icon: BedDouble, label: lang === 'hi' ? 'डेमो occupancy' : 'Demo Occupancy', value: `${Math.min(92, 48 + records.filter(item => item.status === 'confirmed').length * 8)}%`, delta: lang === 'hi' ? 'Illustrative only' : 'Illustrative only', tone: 'maroon' },
    { icon: Check, label: lang === 'hi' ? 'उपलब्ध कक्ष' : 'Available Rooms', value: String(rooms.filter(room => room.availability !== 'soldout').length), delta: lang === 'hi' ? 'Sample inventory' : 'Sample inventory', tone: 'green' },
    { icon: UserRound, label: lang === 'hi' ? 'आगामी चेक-इन' : 'Upcoming Check-ins', value: String(records.filter(item => item.checkIn >= today && item.status !== 'cancelled').length), delta: lang === 'hi' ? 'Demo schedule' : 'Demo schedule', tone: 'purple' },
  ]
  return <><div className="admin-stats admin-stats--five">{stats.map(stat => <article key={stat.label}><span className={`admin-stat-icon admin-stat-icon--${stat.tone}`}><stat.icon /></span><div><small>{stat.label}</small><strong>{stat.value}</strong><p><i />{stat.delta}</p></div></article>)}</div><div className="admin-grid-main"><section className="admin-card admin-bookings"><div className="admin-card__head"><div><h2>{lang === 'hi' ? 'बुकिंग अनुरोध' : 'Booking Requests'}</h2><p>{lang === 'hi' ? 'Presentation records और read-only sample entries' : 'Presentation records and read-only sample entries'}</p></div></div><BookingTable records={records.slice(0, 6)} lang={lang} onOpen={onOpen} highlightedRef={highlightedRef} /></section><section className="admin-card occupancy-card"><div className="admin-card__head"><div><h2>{lang === 'hi' ? 'डेमो कक्ष स्थिति' : 'Demo room occupancy'}</h2><p>{lang === 'hi' ? 'Illustrative snapshot' : 'Illustrative snapshot'}</p></div><BarChart3 /></div><div className="donut"><div><strong>72%</strong><small>{lang === 'hi' ? 'डेमो occupancy' : 'demo occupancy'}</small></div></div><div className="occupancy-legend"><p><span className="dot dot--maroon" />{lang === 'hi' ? 'भरे हुए' : 'Occupied'}<strong>18</strong></p><p><span className="dot dot--gold" />{lang === 'hi' ? 'उपलब्ध' : 'Available'}<strong>7</strong></p><p><span className="dot dot--gray" />{lang === 'hi' ? 'रखरखाव' : 'Maintenance'}<strong>2</strong></p></div></section></div><div className="admin-bottom-grid"><section className="admin-card"><div className="admin-card__head"><div><h2>{lang === 'hi' ? '7-दिवसीय occupancy' : '7-day occupancy'}</h2><p>Sample trend</p></div></div><div className="mini-bars">{[48, 60, 55, 76, 72, 88, 68].map((height, index) => <div key={index}><span style={{ height: `${height}%` }} /><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</small></div>)}</div></section><section className="admin-card activity-card"><div className="admin-card__head"><div><h2>{lang === 'hi' ? 'हाल की गतिविधि' : 'Recent activity'}</h2><p>{lang === 'hi' ? 'Demo events' : 'Demo events'}</p></div></div>{records.slice(0, 3).map(item => <div className="activity-item" key={item.reference}><span><CalendarCheck /></span><p>{item.reference}<small>{statusCopy[item.status][lang]} · {item.isReadOnlySample ? 'Read-only sample' : 'Presentation record'}</small></p></div>)}</section></div></>
}

function BookingsModule({ lang, records, onOpen, highlightedRef }: { lang: 'hi' | 'en'; records: DemoBooking[]; onOpen: (booking: DemoBooking) => void; highlightedRef: string }) {
  return <section className="admin-card admin-bookings admin-bookings--module"><div className="admin-card__head"><div><h2>{lang === 'hi' ? 'सभी डेमो अनुरोध' : 'All demo booking requests'}</h2><p>{records.filter(item => !item.isReadOnlySample).length} presentation · {records.filter(item => item.isReadOnlySample).length} read-only sample</p></div></div>{records.length ? <BookingTable records={records} lang={lang} onOpen={onOpen} highlightedRef={highlightedRef} /> : <div className="module-empty"><CalendarCheck /><h3>{lang === 'hi' ? 'अभी कोई demo request नहीं' : 'No demo requests yet'}</h3><p>{lang === 'hi' ? 'Public booking flow से request बनाते ही वह यहाँ दिखाई देगी।' : 'A request created through the public booking flow will appear here.'}</p></div>}</section>
}

function BookingTable({ records, lang, onOpen, highlightedRef }: { records: DemoBooking[]; lang: 'hi' | 'en'; onOpen: (booking: DemoBooking) => void; highlightedRef: string }) {
  function keyboardOpen(event: KeyboardEvent<HTMLTableRowElement>, booking: DemoBooking) {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(booking) }
  }
  return <div className="table-scroll"><table><thead><tr><th>Reference</th><th>{lang === 'hi' ? 'अतिथि' : 'Guest'}</th><th>{lang === 'hi' ? 'कक्ष' : 'Room'}</th><th>{lang === 'hi' ? 'चेक-इन' : 'Check-in'}</th><th>{lang === 'hi' ? 'चेक-आउट' : 'Check-out'}</th><th>{lang === 'hi' ? 'अतिथि' : 'Guests'}</th><th>{lang === 'hi' ? 'स्थिति' : 'Status'}</th><th /></tr></thead><tbody>{records.map(booking => <tr className={`admin-booking-row ${booking.reference === highlightedRef ? 'is-highlighted' : ''}`} key={booking.reference} tabIndex={0} role="button" aria-label={`${lang === 'hi' ? 'बुकिंग खोलें' : 'Open booking'} ${booking.reference}`} onClick={() => onOpen(booking)} onKeyDown={event => keyboardOpen(event, booking)}><td><strong>{booking.reference}</strong>{booking.isSample && <small className="sample-label">{booking.isReadOnlySample ? 'Read-only sample' : 'Presentation sample'}</small>}</td><td><span className="guest-cell"><i>{booking.guestName.split(' ').map(name => name[0]).join('').slice(0, 2)}</i><span><strong>{booking.guestName}</strong><small>{booking.city}</small></span></span></td><td>{booking.roomName}</td><td>{formatAdminDate(booking.checkIn, lang)}</td><td>{formatAdminDate(booking.checkOut, lang)}</td><td>{booking.adults + booking.children}</td><td><span className={`table-status table-status--${booking.status}`}>{statusCopy[booking.status][lang]}</span></td><td><MoreHorizontal /></td></tr>)}</tbody></table></div>
}

function BookingDetail({ booking, lang, onClose, onStatusChange }: { booking: DemoBooking; lang: 'hi' | 'en'; onClose: () => void; onStatusChange: (reference: string, status: DemoBookingStatus) => void }) {
  return <aside className="admin-booking-detail" role="dialog" aria-modal="true" aria-label={lang === 'hi' ? 'बुकिंग विवरण' : 'Booking details'}><div className="admin-booking-detail__head"><div><small>{booking.isReadOnlySample ? 'Read-only sample record' : 'Presentation booking record'}</small><h2>{booking.reference}</h2></div><button autoFocus onClick={onClose} aria-label="Close booking details"><X /></button></div><div className="admin-booking-detail__guest"><span>{booking.guestName.split(' ').map(name => name[0]).join('').slice(0, 2)}</span><div><strong>{booking.guestName}</strong><small>{booking.city} · {booking.mobile}</small></div></div><Link className="admin-booking-detail__guest-link" to={`/booking-status?ref=${booking.reference}`}><ExternalLink />{lang === 'hi' ? 'Guest status view खोलें' : 'Open guest status view'}</Link><dl><div><dt>{lang === 'hi' ? 'कक्ष' : 'Room'}</dt><dd>{booking.roomName}</dd></div><div><dt>{lang === 'hi' ? 'ठहराव' : 'Stay'}</dt><dd>{formatAdminDate(booking.checkIn, lang)} — {formatAdminDate(booking.checkOut, lang)}</dd></div><div><dt>{lang === 'hi' ? 'अतिथि' : 'Guests'}</dt><dd>{booking.adults} adults · {booking.children} children</dd></div><div><dt>{lang === 'hi' ? 'डेमो कुल' : 'Demo total'}</dt><dd>₹{booking.estimatedDemoTotal.toLocaleString('en-IN')}</dd></div><div><dt>{lang === 'hi' ? 'विशेष अनुरोध' : 'Special request'}</dt><dd>{booking.specialRequest || '—'}</dd></div></dl><label>{lang === 'hi' ? 'डेमो स्थिति' : 'Demo status'}<select value={booking.status} disabled={booking.isReadOnlySample} onChange={event => onStatusChange(booking.reference, event.target.value as DemoBookingStatus)}>{Object.entries(statusCopy).map(([status, copy]) => <option key={status} value={status}>{copy[lang]}</option>)}</select></label>{booking.isReadOnlySample ? <p>{lang === 'hi' ? 'Built-in sample read-only है। Editable controls के लिए sample booking action उपयोग करें।' : 'This built-in sample is read-only. Use Create sample booking to demonstrate editable controls.'}</p> : <p><Check />{lang === 'hi' ? 'बदलाव booking-status page पर दिखाई देगा।' : 'Changes appear on the booking-status page.'}</p>}<div className="admin-booking-detail__notice"><Sparkles />{lang === 'hi' ? 'यह presentation data है, live booking नहीं।' : 'Presentation data, not a live booking.'}</div></aside>
}

function ModulePreview({ panel, title, lang, tx }: { panel: Panel; title: string; lang: 'hi' | 'en'; tx: (value: { hi: string; en: string }) => string }) {
  const iconMap: Record<Panel, ElementType> = { dashboard: LayoutDashboard, bookings: CalendarCheck, rooms: BedDouble, availability: CalendarDays, guests: Users, gallery: Image, tariffs: Tags, notices: Bell, contacts: MessageSquareText }
  const Icon = iconMap[panel]
  return <div className="module-preview"><section className="admin-card"><div className="module-preview__heading"><span><Icon /></span><div><h2>{title}</h2><p>{lang === 'hi' ? 'Production backend integration के लिए concept UI।' : 'Concept UI for future production backend integration.'}</p></div></div>{panel === 'rooms' || panel === 'availability' || panel === 'tariffs' ? <div className="module-room-list">{rooms.map(room => <div key={room.id}><img src={room.image} alt="" /><span><strong>{tx(room.name)}</strong><small>{room.occupancy} {lang === 'hi' ? 'अतिथि' : 'guests'} · {room.size}</small></span><b>₹{room.tariff.toLocaleString('en-IN')}</b><i className={`availability-dot availability-dot--${room.availability}`} /></div>)}</div> : <div className="module-empty"><Icon /><h3>{title} preview</h3><p>{lang === 'hi' ? 'खोज, filters और production records backend integration के समय यहाँ जुड़ेंगे।' : 'Search, filters and production records will connect here during backend integration.'}</p></div>}</section><aside className="admin-card module-roadmap"><Sparkles /><h3>Production roadmap</h3><p>{lang === 'hi' ? 'यह demo authentication या live data का दावा नहीं करता।' : 'This demo does not claim authentication or live data.'}</p><ul><li><Check />Supabase / PostgreSQL</li><li><Check />Role-based admin login</li><li><Check />Live inventory sync</li><li><Check />Audit history</li></ul></aside></div>
}

function ShieldMini() { return <span className="admin-disclaimer__icon" aria-hidden="true">i</span> }
