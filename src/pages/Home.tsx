import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BedDouble, Bot, BrainCircuit, CalendarDays, Check, CheckCircle2, Clock3, HeartHandshake, Languages, MapPin, MessageCircle, Phone, Route, ShieldCheck, Sparkles, Timer, Users } from 'lucide-react'
import { AmenityIcon, DemoNotice, PageMeta, RoomCard, SectionHeading } from '../components/Shared'
import { useLanguage } from '../context/LanguageContext'
import { facilities, faqs, facilityImage, gallery, heroImage, nearbyPlaces, rooms, siteConfig } from '../data/site'

export function Home() {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const today = new Date().toISOString().split('T')[0]
  const checkAvailability = () => {
    const query = new URLSearchParams()
    if (checkIn) query.set('checkIn', checkIn)
    if (checkOut) query.set('checkOut', checkOut)
    query.set('guests', String(guests))
    navigate(`/booking?${query.toString()}`)
  }

  return (
    <>
      <PageMeta title={lang === 'hi' ? 'उज्जैन में आपका आत्मीय ठहराव' : 'Your considered stay in Ujjain'} />
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(40,6,6,.90) 0%, rgba(40,6,6,.72) 43%, rgba(40,6,6,.12) 82%), url(${heroImage})` }}>
        <div className="hero__wash" aria-hidden="true" />
        <div className="container hero__content reveal">
          <span className="hero__kicker"><span>॥</span>{lang === 'hi' ? 'श्री महाकालेश्वर की पावन नगरी में' : 'In the sacred city of Shri Mahakaleshwar'}<span>॥</span></span>
          <h1>{lang === 'hi' ? <>यात्रा में <em>श्रद्धा</em>,<br />ठहराव में अपनापन</> : <>Devotion in your journey,<br /><em>warmth</em> in your stay</>}</h1>
          <p>{lang === 'hi' ? 'उज्जैन आने वाले श्रद्धालुओं और परिवारों के लिए स्वच्छ, सुविधाजनक और समुदाय-केंद्रित ठहराव।' : 'A clean, convenient and community-led stay for pilgrims and families visiting Ujjain.'}</p>
          <div className="hero__actions">
            <Link className="btn btn--gold btn--large" to="/booking"><CalendarDays size={19} />{lang === 'hi' ? 'अपना ठहराव बुक करें' : 'Book your stay'}<ArrowRight size={18} /></Link>
            <a className="btn btn--glass btn--large" href={`tel:${siteConfig.phoneLink}`}><Phone size={18} />{lang === 'hi' ? 'अभी कॉल करें' : 'Call now'}</a>
          </div>
          <div className="hero__trust"><span><ShieldCheck />{lang === 'hi' ? 'समुदाय का भरोसा' : 'Community-led'}</span><span><MapPin />{siteConfig.location}</span><span><HeartHandshake />{lang === 'hi' ? 'परिवार-अनुकूल' : 'Family-friendly'}</span></div>
        </div>
        <aside className="home-hero-insight" aria-label={lang === 'hi' ? 'वेबसाइट सुविधाएँ' : 'Website experience highlights'}>
          <div className="home-hero-insight__head"><span><Sparkles /></span><div><small>Digital guest experience</small><strong>{lang === 'hi' ? 'एक यात्रा, हर step जुड़ा हुआ' : 'One journey, every step connected'}</strong></div></div>
          <div className="home-hero-insight__flow"><span><BedDouble /><small>{lang === 'hi' ? 'कक्ष' : 'Rooms'}</small></span><i /><span><CalendarDays /><small>{lang === 'hi' ? 'Request' : 'Request'}</small></span><i /><span><CheckCircle2 /><small>{lang === 'hi' ? 'स्थिति' : 'Status'}</small></span></div>
          <Link to="/ai-assistant"><Bot /><span><strong>{lang === 'hi' ? 'AI यात्रा सहायक से पूछें' : 'Ask the AI Travel Assistant'}</strong><small>{lang === 'hi' ? 'कक्ष, booking और Ujjain guidance' : 'Rooms, booking and Ujjain guidance'}</small></span><ArrowRight /></Link>
          <em>{lang === 'hi' ? 'AI सहायता · कक्ष की अंतिम पुष्टि अलग से' : 'AI guidance · Final room confirmation follows review'}</em>
        </aside>
        <div className="hero__concept-label">{lang === 'hi' ? 'प्रतीकात्मक दृश्य' : 'Illustrative visual'}</div>
      </section>

      <div className="container availability-wrap reveal reveal--delay">
        <div className="availability-bar">
          <div className="availability-bar__intro"><span className="mini-icon"><CalendarDays /></span><div><strong>{lang === 'hi' ? 'उपलब्धता जाँचें' : 'Check availability'}</strong><small>{lang === 'hi' ? 'अपनी यात्रा की तारीख चुनें' : 'Select your travel dates'}</small></div></div>
          <label><span>{lang === 'hi' ? 'आगमन' : 'Check-in'}</span><input type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)} /></label>
          <label><span>{lang === 'hi' ? 'प्रस्थान' : 'Check-out'}</span><input type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)} /></label>
          <label><span>{lang === 'hi' ? 'अतिथि' : 'Guests'}</span><select value={guests} onChange={event => setGuests(Number(event.target.value))}><option value="1">1 {lang === 'hi' ? 'अतिथि' : 'guest'}</option><option value="2">2 {lang === 'hi' ? 'अतिथि' : 'guests'}</option><option value="4">4 {lang === 'hi' ? 'अतिथि' : 'guests'}</option><option value="5">5+ {lang === 'hi' ? 'अतिथि' : 'guests'}</option></select></label>
          <button className="btn btn--primary btn--check" onClick={checkAvailability}>{lang === 'hi' ? 'कक्ष देखें' : 'View rooms'}<ArrowRight size={17} /></button>
        </div>
        <p className="availability-wrap__note"><Sparkles size={13} /> {lang === 'hi' ? 'कक्ष की अंतिम उपलब्धता booking request की समीक्षा पर confirm होती है।' : 'Final room availability is confirmed when the booking request is reviewed.'}</p>
      </div>

      <section className="home-impact-strip" aria-label={lang === 'hi' ? 'मुख्य वेबसाइट विशेषताएँ' : 'Key website capabilities'}><div className="container">
        <article><span><Timer /></span><div><strong>{lang === 'hi' ? '2 मिनट से कम' : 'Under 2 minutes'}</strong><small>{lang === 'hi' ? 'Guided booking request' : 'Guided booking request'}</small></div></article>
        <article><span><Languages /></span><div><strong>हिन्दी + English</strong><small>{lang === 'hi' ? 'Bilingual experience' : 'Bilingual experience'}</small></div></article>
        <article><span><Users /></span><div><strong>{lang === 'hi' ? 'परिवार-केंद्रित' : 'Family-oriented'}</strong><small>{lang === 'hi' ? 'Room guidance' : 'Room guidance'}</small></div></article>
        <article><span><BrainCircuit /></span><div><strong>{lang === 'hi' ? 'AI-ready' : 'AI-ready'}</strong><small>{lang === 'hi' ? 'Site-aware answers' : 'Site-aware answers'}</small></div></article>
      </div></section>

      <section className="section welcome-section">
        <div className="container welcome-grid">
          <div className="welcome-visual reveal">
            <div className="image-frame"><img src={facilityImage} alt={lang === 'hi' ? 'शांत धर्मशाला प्रांगण का प्रतीकात्मक दृश्य' : 'Illustrative view of a peaceful dharamshala courtyard'} loading="lazy" /><span className="concept-label">{lang === 'hi' ? 'प्रतीकात्मक दृश्य' : 'Illustrative view'}</span></div>
            <div className="welcome-visual__badge"><strong>ॐ</strong><span>{lang === 'hi' ? <>अतिथि देवो भवः<small>सेवा · श्रद्धा · संस्कार</small></> : <>Atithi Devo Bhava<small>Service · Faith · Values</small></>}</span></div>
          </div>
          <div className="welcome-copy reveal reveal--delay">
            <SectionHeading eyebrow={lang === 'hi' ? 'सस्नेह स्वागत' : 'A warm welcome'} title={lang === 'hi' ? 'उज्जैन यात्रा का एक आत्मीय पड़ाव' : 'A considered pause in your Ujjain journey'} text={lang === 'hi' ? `${siteConfig.hindiName} का यह डिजिटल अनुभव सरल सेवा, पारिवारिक सहजता और तीर्थयात्रा की शांति को एक जगह जोड़ता है।` : `The digital experience for ${siteConfig.businessName} brings together simple service, family comfort and the calm of a pilgrimage.`} />
            <div className="welcome-points"><div><CheckCircle2 /><span><strong>{lang === 'hi' ? 'साफ और उपयोगी' : 'Clean & practical'}</strong><small>{lang === 'hi' ? 'दिखावे से अधिक सुविधा पर ध्यान' : 'Thoughtful comfort over excess'}</small></span></div><div><CheckCircle2 /><span><strong>{lang === 'hi' ? 'यात्रियों के अनुरूप' : 'Pilgrim-aware'}</strong><small>{lang === 'hi' ? 'दर्शन और परिवार की जरूरतों को ध्यान में रखकर' : 'Designed around darshan and family needs'}</small></span></div></div>
            <Link className="text-link" to="/about">{lang === 'hi' ? 'हमारे विचार के बारे में' : 'Discover our approach'} <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section why-section">
        <div className="container">
          <SectionHeading center eyebrow={lang === 'hi' ? 'क्यों चुनें' : 'Why stay with us'} title={lang === 'hi' ? 'हर यात्रा को सहज बनाने की सोच' : 'Everything your journey needs, thoughtfully considered'} text={lang === 'hi' ? 'आराम, स्थान और सहायता—तीनों का संतुलित अनुभव।' : 'A balanced experience built around comfort, location and genuine assistance.'} />
          <div className="why-grid">
            <article><span>01</span><MapPin /><h3>{lang === 'hi' ? 'यात्रा-केंद्रित स्थान' : 'Pilgrimage-led location'}</h3><p>{lang === 'hi' ? 'महाकाल दर्शन और उज्जैन भ्रमण की planning को सरल बनाने वाला stay experience।' : 'A stay experience designed to simplify Mahakal darshan and Ujjain exploration.'}</p></article>
            <article className="why-card--featured"><span>02</span><HeartHandshake /><h3>{lang === 'hi' ? 'समुदाय का अपनापन' : 'Community warmth'}</h3><p>{lang === 'hi' ? 'महाराष्ट्र समाज की सेवा भावना से प्रेरित परिवार-केंद्रित आतिथ्य।' : 'Family-oriented hospitality inspired by the service values of Maharashtra Samaj.'}</p></article>
            <article><span>03</span><ShieldCheck /><h3>{lang === 'hi' ? 'साफ और विश्वसनीय' : 'Clear & trustworthy'}</h3><p>{lang === 'hi' ? 'टैरिफ, सुविधाएँ और policies को स्पष्ट रखने वाली पारदर्शी digital journey।' : 'A transparent digital journey with clear tariffs, facilities and policies.'}</p></article>
          </div>
        </div>
      </section>

      <section className="section rooms-section">
        <div className="container">
          <div className="section-top"><SectionHeading eyebrow={lang === 'hi' ? 'ठहरने के विकल्प' : 'Stay your way'} title={lang === 'hi' ? 'हर यात्री के लिए एक सहज कक्ष' : 'A comfortable room for every traveller'} text={lang === 'hi' ? 'एकल यात्रा से लेकर पूरे परिवार तक—अपनी जरूरत के अनुसार श्रेणी चुनें।' : 'From a solo pilgrimage to a family visit, choose the room that fits your needs.'} /><Link className="text-link" to="/rooms">{lang === 'hi' ? 'सभी कक्ष देखें' : 'Explore all rooms'} <ArrowRight size={16} /></Link></div>
          <div className="room-grid">{rooms.slice(0, 3).map(room => <RoomCard key={room.id} room={room} />)}</div>
          <DemoNotice compact />
        </div>
      </section>

      <section className="home-booking-feature">
        <div className="container home-booking-feature__card">
          <div className="home-booking-feature__visual"><img src={rooms[1].image} alt={lang === 'hi' ? 'आरामदायक अतिथि कक्ष का प्रतीकात्मक दृश्य' : 'Illustrative view of a comfortable guest room'} /><span>{lang === 'hi' ? 'प्रतीकात्मक कक्ष दृश्य' : 'Illustrative room view'}</span><div><strong>07</strong><small>{lang === 'hi' ? 'स्पष्ट booking steps' : 'clear booking steps'}</small></div></div>
          <div className="home-booking-feature__copy"><span className="eyebrow">{lang === 'hi' ? 'Featured booking entry' : 'Featured booking entry'}</span><h2>{lang === 'hi' ? 'देखिए—एक अतिथि 2 मिनट से कम में request कैसे भेजता है' : 'See how a guest can request a stay in under two minutes'}</h2><p>{lang === 'hi' ? 'तारीख, अतिथि, कक्ष, contact details और review—हर step स्पष्ट है। अंत में reference मिलता है; कोई payment या instant confirmation नहीं।' : 'Dates, guests, room, contact details and review—every step is clear. A reference follows, with no payment or instant-confirmation claim.'}</p><div><span><Check />No payment</span><span><Check />Copyable reference</span><span><Check />Trackable request status</span></div><Link className="btn btn--primary btn--large" to="/booking"><CalendarDays />{lang === 'hi' ? 'Booking शुरू करें' : 'Start booking'}<ArrowRight /></Link></div>
        </div>
      </section>

      <section className="section facilities-preview">
        <div className="container facilities-preview__grid">
          <div className="facilities-preview__copy"><SectionHeading eyebrow={lang === 'hi' ? 'सुविधाएँ' : 'Considered comforts'} title={lang === 'hi' ? 'सादगी से चुनी गई आवश्यक सुविधाएँ' : 'Simple comforts, selected with care'} text={lang === 'hi' ? 'एक तीर्थयात्री के दिन को सहज बनाने वाली सुविधाएँ—बिना अनावश्यक दिखावे के।' : 'The useful details that make a pilgrim’s day easier, without unnecessary excess.'} /><Link className="btn btn--outline" to="/facilities">{lang === 'hi' ? 'सभी सुविधाएँ' : 'View all facilities'}<ArrowRight size={16} /></Link></div>
          <div className="facility-mini-grid">{facilities.slice(0, 6).map(item => <article key={item.title.en}><span><AmenityIcon name={item.icon} /></span><div><h3>{item.title[lang]}</h3><p>{item.text[lang]}</p></div></article>)}</div>
        </div>
      </section>

      <section className="proximity-section" style={{ backgroundImage: `linear-gradient(90deg,rgba(47,9,9,.96),rgba(47,9,9,.65)),url(${heroImage})` }}>
        <div className="container proximity-section__grid">
          <div><span className="eyebrow eyebrow--light"><Route size={14} />{lang === 'hi' ? 'महाकाल यात्रा सुविधा' : 'Mahakal travel convenience'}</span><h2>{lang === 'hi' ? 'दर्शन से पहले शांति, दर्शन के बाद विश्राम' : 'Peace before darshan. Rest after.'}</h2><p>{lang === 'hi' ? 'सुबह की आरती से शहर दर्शन तक, हमारा प्रस्तावित डिजिटल अनुभव आपकी यात्रा की उपयोगी जानकारी एक जगह रखता है।' : 'From an early aarti to a city circuit, the proposed digital experience keeps useful journey information together.'}</p><div className="proximity-facts"><div><Clock3 /><span><strong>{lang === 'hi' ? 'यात्रा सहायता' : 'Travel help'}</strong><small>{lang === 'hi' ? 'मार्ग और समय की सलाह' : 'Route & timing guidance'}</small></span></div><div><MapPin /><span><strong>{lang === 'hi' ? 'Maps दिशा' : 'Maps directions'}</strong><small>{lang === 'hi' ? 'एक टैप में खोज' : 'One-tap location search'}</small></span></div></div><Link className="btn btn--gold" to="/nearby">{lang === 'hi' ? 'उज्जैन दर्शन की योजना' : 'Plan your Ujjain visit'}<ArrowRight size={17} /></Link></div>
        </div>
      </section>

      <section className="home-ai-teaser">
        <div className="container home-ai-teaser__grid">
          <div className="home-ai-teaser__visual"><div className="ai-signal-ring"><span><Bot /></span><i /><i /><i /></div><div className="ai-teaser-bubble ai-teaser-bubble--one">{lang === 'hi' ? 'परिवार के लिए कौन-सा room?' : 'Which room suits a family?'}</div><div className="ai-teaser-bubble ai-teaser-bubble--two">{lang === 'hi' ? 'Booking का अगला step?' : 'What is the next booking step?'}</div><div className="ai-teaser-bubble ai-teaser-bubble--three">{lang === 'hi' ? 'Ujjain में क्या देखें?' : 'What can I visit in Ujjain?'}</div></div>
          <div><span className="eyebrow eyebrow--light"><Sparkles />{lang === 'hi' ? 'नया · AI यात्रा सहायक' : 'New · AI Travel Assistant'}</span><h2>{lang === 'hi' ? 'सही सवाल पूछिए। सही अगला कदम पाइए।' : 'Ask the right question. Find the right next step.'}</h2><p>{lang === 'hi' ? 'AI सहायक existing website information से room suggestions, booking guidance, nearby places और status steps समझाता है—कॉल से पहले clarity के लिए।' : 'The AI assistant uses existing website information for room suggestions, booking guidance, nearby places and status steps—giving guests clarity before they call.'}</p><div className="home-ai-teaser__points"><span><CheckCircle2 />Website-aware answers</span><span><CheckCircle2 />Hindi + English interface</span><span><ShieldCheck />Confirmation after review</span></div><Link className="btn btn--gold btn--large" to="/ai-assistant"><Bot />{lang === 'hi' ? 'AI सहायक से बात करें' : 'Talk to AI Assistant'}<ArrowRight /></Link></div>
        </div>
      </section>

      <section className="section gallery-preview">
        <div className="container"><div className="section-top"><SectionHeading eyebrow={lang === 'hi' ? 'एक झलक' : 'A glimpse'} title={lang === 'hi' ? 'शांत, स्वच्छ और स्वागतपूर्ण' : 'Calm, clean and welcoming'} text={lang === 'hi' ? 'प्रतीकात्मक property visuals—वास्तविक परिसर की जानकारी के साथ उपयोगी संदर्भ।' : 'Illustrative property visuals paired with useful stay information.'} /><Link className="text-link" to="/gallery">{lang === 'hi' ? 'पूरी गैलरी' : 'Open gallery'} <ArrowRight size={16} /></Link></div><div className="gallery-mosaic">{gallery.slice(0, 4).map((item, i) => <Link to="/gallery" className={`gallery-tile gallery-tile--${i + 1}`} key={`${item.title.en}-${i}`}><img src={item.src} alt={item.title[lang]} loading="lazy" /><span><small>{item.tag[lang]}</small>{item.title[lang]}</span></Link>)}</div></div>
      </section>

      <section className="section nearby-preview">
        <div className="container"><SectionHeading center eyebrow={lang === 'hi' ? 'उज्जैन दर्शन' : 'Explore Ujjain'} title={lang === 'hi' ? 'आस्था और इतिहास से भरे पड़ाव' : 'Sacred places, timeless stories'} text={lang === 'hi' ? 'यात्रा planning के लिए उपयोगी मार्गदर्शन; official timings यात्रा से पहले verify करें।' : 'Useful trip-planning guidance; verify official timings before travel.'} /><div className="places-row">{nearbyPlaces.slice(0, 4).map((place, i) => <article key={place.name.en}><span className="place-number">0{i + 1}</span><div className="place-icon"><span /></div><small>{place.type[lang]}</small><h3>{place.name[lang]}</h3><p><MapPin size={15} />{place.time[lang]}</p></article>)}</div><div className="center-action"><Link className="btn btn--outline" to="/nearby">{lang === 'hi' ? 'सभी स्थान देखें' : 'View all places'}<ArrowRight size={16} /></Link></div></div>
      </section>

      <section className="section booking-steps">
        <div className="container"><SectionHeading center eyebrow={lang === 'hi' ? 'सरल प्रक्रिया' : 'A simple process'} title={lang === 'hi' ? 'तीन चरणों में booking request' : 'Your stay request in three easy steps'} /><div className="steps-line"><article><span>1</span><CalendarDays /><h3>{lang === 'hi' ? 'तारीख चुनें' : 'Choose dates'}</h3><p>{lang === 'hi' ? 'अपनी यात्रा और अतिथियों की जानकारी दें।' : 'Share your travel dates and guest count.'}</p></article><i /><article><span>2</span><BedChoiceIcon /><h3>{lang === 'hi' ? 'कक्ष चुनें' : 'Select a room'}</h3><p>{lang === 'hi' ? 'अपनी जरूरत के अनुरूप विकल्प चुनें।' : 'Pick the category that suits your group.'}</p></article><i /><article><span>3</span><MessageCircle /><h3>{lang === 'hi' ? 'पुष्टि पाएँ' : 'Receive confirmation'}</h3><p>{lang === 'hi' ? 'प्रबंधन से वास्तविक पुष्टि के बाद यात्रा तय करें।' : 'Plan travel after management confirms the request.'}</p></article></div></div>
      </section>

      <section className="section faq-preview">
        <div className="container faq-preview__grid"><div><SectionHeading eyebrow={lang === 'hi' ? 'सामान्य प्रश्न' : 'Good to know'} title={lang === 'hi' ? 'यात्रा से पहले जरूरी बातें' : 'Helpful answers before you arrive'} text={lang === 'hi' ? 'बुकिंग, सुविधा और पुष्टि से जुड़े मुख्य प्रश्न।' : 'Essential answers about bookings, amenities and confirmations.'} /><Link className="text-link" to="/faq">{lang === 'hi' ? 'सभी प्रश्न देखें' : 'See all questions'} <ArrowRight size={16} /></Link></div><div className="faq-list">{faqs.slice(0, 4).map((item, i) => <details key={item.q.en} open={i === 0}><summary>{item.q[lang]}<span>+</span></summary><p>{item.a[lang]}</p></details>)}</div></div>
      </section>

      <section className="final-cta final-cta--upgraded"><div className="final-cta__pattern" /><div className="container final-cta__inner"><span className="eyebrow eyebrow--light">{lang === 'hi' ? 'उज्जैन बुला रहा है' : 'Ujjain is calling'}</span><h2>{lang === 'hi' ? 'अपनी महाकाल यात्रा को सहज बनाइए' : 'Make your Mahakal journey feel effortless'}</h2><p>{lang === 'hi' ? 'AI से सवाल पूछें, सही कक्ष देखें या अपना booking request तैयार करें।' : 'Ask AI, explore the right room or create your booking request.'}</p><div><Link className="btn btn--gold btn--large" to="/booking"><CalendarDays />{lang === 'hi' ? 'बुकिंग अनुरोध भेजें' : 'Request your stay'}<ArrowRight size={18} /></Link><Link className="btn btn--glass btn--large" to="/ai-assistant"><Bot />{lang === 'hi' ? 'AI सहायक' : 'Ask AI'}</Link></div></div></section>
    </>
  )
}

function BedChoiceIcon() { return <span className="bed-choice-icon" aria-hidden="true">⌂</span> }
