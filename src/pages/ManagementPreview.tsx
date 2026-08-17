import { useEffect, useRef, useState, type ElementType } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BedDouble, Bot, BookOpenCheck, BrainCircuit, CalendarDays, Check, CheckCircle2, ClipboardCheck, Database, Eye, FileCheck2, Gauge, Globe2, Home, Languages, LayoutDashboard, MessageCircle, MonitorSmartphone, MousePointerClick, Printer, RefreshCcw, Route, ShieldCheck, Sparkles, Users, X } from 'lucide-react'
import { PageMeta } from '../components/Shared'
import { facilityImage, heroImage, roomImage, rooms, siteConfig } from '../data/site'
import { createManagementSampleBooking, resetDemoBookings, type DemoBooking } from '../services/demoBookings'
import { useToast } from '../context/ToastContext'

const journey: { number: string; title: string; text: string; path: string; icon: ElementType; outcome: string }[] = [
  { number: '01', title: 'Start at Home', text: 'Introduce the trust-first visual direction, bilingual experience and visible demo boundary.', path: '/', icon: Home, outcome: 'Brand & trust' },
  { number: '02', title: 'Explore Rooms', text: 'Compare categories, sample tariffs, facilities and proposed availability.', path: '/rooms', icon: BedDouble, outcome: 'Room discovery' },
  { number: '03', title: 'Open a Room', text: 'Review the gallery, occupancy, features and suitability guidance.', path: '/rooms/standard-ac', icon: Eye, outcome: 'Decision support' },
  { number: '04', title: 'Submit a Request', text: 'Walk through the seven-step, no-payment booking request experience.', path: '/booking', icon: CalendarDays, outcome: 'Guest conversion' },
  { number: '05', title: 'Save the Reference', text: 'Copy the generated demo reference from the confirmation screen.', path: '/booking', icon: ClipboardCheck, outcome: 'Clear handoff' },
  { number: '06', title: 'Check Status', text: 'Retrieve the same record and explain each transparent request stage.', path: '/booking-status', icon: FileCheck2, outcome: 'Guest confidence' },
  { number: '07', title: 'Review Operations', text: 'Open the dashboard and update an editable presentation record.', path: '/admin-demo', icon: LayoutDashboard, outcome: 'Operations view' },
  { number: '08', title: 'Confirm Next Inputs', text: 'Use the approval checklist to capture management decisions.', path: '#approval-checklist', icon: CheckCircle2, outcome: 'Approval brief' },
]

const checklist = [
  ['Property', ['Official property name in Hindi and English', 'Complete postal address and Google Maps pin', 'Primary manager phone and WhatsApp number', 'Trust / society introduction and approved history']],
  ['Rooms', ['Final room category names and inventory', 'Approved occupancy and bed configuration', 'Current tariffs, taxes and extra-person rules', 'Check-in, check-out and cancellation policy']],
  ['Policies', ['Booking confirmation workflow', 'Accepted payment methods and refund process', 'Guest ID and eligibility requirements', 'Rules for children, groups and special dates']],
  ['Facilities', ['Verified amenity list and operating hours', 'Meal, parking and accessibility details', 'Reception and emergency contact process', 'Nearby guidance approved for publication']],
  ['Media', ['Official exterior and room photographs', 'Logo / trust seal in high resolution', 'Written consent for people shown in images', 'Approved testimonials or community messages']],
] as const

const capabilities = [
  [BedDouble, 'Guest journey', 'Room discovery, comparison, details and a clear request flow.', '/rooms'],
  [ClipboardCheck, 'Booking continuity', 'A reference connects request confirmation, status and operations.', '/booking'],
  [LayoutDashboard, 'Operations preview', 'A practical dashboard demonstrates sorting, status and record detail.', '/admin-demo'],
  [MessageCircle, 'Direct assistance', 'Phone, WhatsApp, directions and enquiry paths stay easy to reach.', '/contact'],
] as const

const benefits = [
  [Users, 'Less repetitive coordination', 'Guests see room choices, policies and next steps before calling.'],
  [ShieldCheck, 'More trust and clarity', 'Prominent demo labels and plain-language states avoid false promises.'],
  [Gauge, 'Presentation-ready workflow', 'One connected journey can be demonstrated without technical setup.'],
  [Sparkles, 'A foundation for production', 'Approved property data can later replace demo content cleanly.'],
] as const

export function ManagementPreview() {
  const showToast = useToast()
  const [sample, setSample] = useState<DemoBooking | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [activeJourney, setActiveJourney] = useState(0)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const sampleRoom = rooms.find(room => room.id === 'standard-ac') ?? rooms[0]
  const activeStep = journey[activeJourney]

  useEffect(() => {
    if (!confirmReset) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConfirmReset(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [confirmReset])

  function createSample() {
    const result = createManagementSampleBooking({ id: sampleRoom.id, name: sampleRoom.name.en, tariff: sampleRoom.tariff })
    if (!result) {
      showToast({ message: 'Sample booking could not be created in this browser.', tone: 'error' })
      return
    }
    setSample(result.booking)
    showToast(result.created ? 'Demo booking created · डेमो बुकिंग तैयार है' : 'Existing demo booking reopened · मौजूदा रिकॉर्ड खोला गया')
  }

  function resetRecords() {
    const removed = resetDemoBookings()
    setConfirmReset(false)
    setSample(null)
    showToast(removed ? `${removed} demo record${removed === 1 ? '' : 's'} reset · केवल डेमो डेटा हटाया गया` : 'Demo records are already clear · कोई डेमो रिकॉर्ड नहीं था')
  }

  return <div className="management-preview">
    <PageMeta title="Management Presentation" />

    <nav className="management-toolbar" aria-label="Presentation shortcuts">
      <div className="container">
        <span><Eye /> Presentation mode</span>
        <div>
          <Link to="/"><Home />Home</Link>
          <Link to="/rooms"><BedDouble />Rooms</Link>
          <Link to="/booking"><BookOpenCheck />Booking</Link>
          <Link to="/booking-status"><FileCheck2 />Status</Link>
          <Link to="/admin-demo"><LayoutDashboard />Admin</Link>
          <button type="button" onClick={() => setConfirmReset(true)}><RefreshCcw />Reset</button>
        </div>
      </div>
    </nav>

    <section className="management-hero">
      <div className="container management-hero__grid">
        <div className="management-hero__copy">
          <span className="management-kicker"><span /> Client presentation · Management review</span>
          <h1>Hospitality rooted in trust. <em>Technology built for service.</em></h1>
          <p>A visually rich guest journey for {siteConfig.businessName}—from room discovery to management follow-up, now with an AI-ready guidance layer.</p>
          <div className="management-hero__actions">
            <button type="button" className="management-action management-action--primary" onClick={createSample}><MousePointerClick /><span><strong>Create Sample Booking</strong><small>Instant presentation record</small></span><ArrowRight /></button>
            <a className="management-action" href="#demo-journey"><Route /><span><strong>Start Guided Demo</strong><small>8 connected steps</small></span><ArrowRight /></a>
            <Link className="management-action" to="/"><Globe2 /><span><strong>Open Guest Website</strong><small>Public experience</small></span><ArrowRight /></Link>
            <Link className="management-action" to="/admin-demo"><LayoutDashboard /><span><strong>Open Admin Preview</strong><small>Operations view</small></span><ArrowRight /></Link>
            <Link className="management-action management-action--ai" to="/ai-assistant"><Bot /><span><strong>Talk to AI Assistant</strong><small>Try site-aware guidance</small></span><Sparkles /></Link>
          </div>
          <p className="management-honesty"><ShieldCheck />Unofficial demo · No live inventory · No payment · Concept imagery · Management approval required</p>
          {sample && <div className="management-sample-result" role="status">
            <CheckCircle2 />
            <div><small>Presentation record ready</small><strong>{sample.reference}</strong><span>{sample.guestName} · {sample.roomName}</span></div>
            <Link to={`/booking-status?ref=${sample.reference}`}>Guest status</Link>
            <Link to="/admin-demo">Admin view</Link>
          </div>}
        </div>
        <div className="management-hero-visual">
          <div className="management-hero-visual__main"><img src={heroImage} alt="Ujjain pilgrimage atmosphere concept" /><span>Ujjain journey · Concept image</span></div>
          <div className="management-hero-visual__room"><img src={roomImage} alt="Guest room comfort concept" /><span>Stay comfort</span></div>
          <div className="management-hero-visual__courtyard"><img src={facilityImage} alt="Community hospitality concept" /><span>Community welcome</span></div>
          <div className="management-visual-badge management-visual-badge--top"><Languages /><span><strong>Hindi + English</strong><small>One inclusive journey</small></span></div>
          <div className="management-visual-badge management-visual-badge--bottom"><BrainCircuit /><span><strong>AI-ready guidance</strong><small>Demo works without a key</small></span></div>
        </div>
      </div>
    </section>

    <section className="management-metrics" aria-label="Presentation capabilities">
      <div className="container">
        <article><strong>07</strong><span>Step booking request<small>Presentation flow</small></span></article>
        <article><Languages /><span>Hindi + English<small>Bilingual experience</small></span></article>
        <article><MonitorSmartphone /><span>Multi-device ready<small>Desktop to 360px</small></span></article>
        <article><BrainCircuit /><span>AI-ready<small>Offline-first foundation</small></span></article>
        <article><ShieldCheck /><span>No payment claim<small>Demo-safe by design</small></span></article>
      </div>
    </section>

    <section className="section management-capabilities">
      <div className="container">
        <PresentationHeading eyebrow="What the concept demonstrates" title="One connected experience, from enquiry to follow-up" text="Each area is functional enough for a realistic presentation while remaining clearly separated from a live production system." />
        <div className="management-card-grid">
          {capabilities.map(([Icon, title, text, path]) => <Link to={path} key={title} className="management-capability-card">
            <span><Icon /></span><h3>{title}</h3><p>{text}</p><b>Open section <ArrowRight /></b>
          </Link>)}
        </div>
      </div>
    </section>

    <section className="section management-showcase">
      <div className="container">
        <PresentationHeading eyebrow="Hospitality, made visible" title="A richer story for every part of the guest experience" text="Large concept visuals help management see how one digital experience can support arrival, stay, pilgrimage and operations." />
        <div className="management-showcase__grid">
          <Link to="/" className="management-showcase-card management-showcase-card--arrival" style={{ backgroundImage: `linear-gradient(0deg,rgba(45,8,8,.9),rgba(45,8,8,.03)),url(${heroImage})` }}><span>01 · Guest arrival</span><div><h3>A warm first impression before the journey begins</h3><p>Brand, trust, direct assistance and a clear next action.</p><b>Open guest website <ArrowRight /></b></div><em>Concept image</em></Link>
          <Link to="/rooms" className="management-showcase-card" style={{ backgroundImage: `linear-gradient(0deg,rgba(45,8,8,.92),rgba(45,8,8,.05)),url(${roomImage})` }}><span>02 · Rooms & comfort</span><div><h3>Compare the stay with confidence</h3><p>Room categories, suitability and transparent demo tariffs.</p><b>Preview rooms <ArrowRight /></b></div><em>Concept image</em></Link>
          <Link to="/facilities" className="management-showcase-card" style={{ backgroundImage: `linear-gradient(0deg,rgba(45,8,8,.92),rgba(45,8,8,.05)),url(${facilityImage})` }}><span>03 · Family welcome</span><div><h3>Hospitality that feels considered</h3><p>Family needs, senior-friendly help and useful facilities.</p><b>View facilities <ArrowRight /></b></div><em>Concept image</em></Link>
          <Link to="/nearby" className="management-showcase-card management-showcase-card--wide" style={{ backgroundImage: `linear-gradient(90deg,rgba(45,8,8,.94),rgba(45,8,8,.2)),url(${heroImage})` }}><span>04 · Pilgrimage support</span><div><h3>Ujjain guidance without unverified promises</h3><p>Useful planning context that encourages guests to verify official arrangements.</p><b>Explore Ujjain <ArrowRight /></b></div><em>Concept image</em></Link>
          <Link to="/admin-demo" className="management-showcase-card management-showcase-card--operations"><span>05 · Management operations</span><div><LayoutDashboard /><h3>From guest request to a clear follow-up view</h3><p>Present records, status stages and future operations potential.</p><b>Open live admin preview <ArrowRight /></b></div></Link>
        </div>
      </div>
    </section>

    <section className="section management-journey" id="demo-journey">
      <div className="container">
        <PresentationHeading eyebrow="Recommended presentation flow" title="An eight-step guided client journey" text="Allow roughly 10–12 minutes, then move to the approval checklist for decisions." />
        <div className="management-journey-console">
          <div className="management-journey-tabs" role="tablist" aria-label="Guided demo steps">
            {journey.map((step, index) => <button type="button" role="tab" aria-selected={activeJourney === index} className={activeJourney === index ? 'active' : ''} key={step.number} onClick={() => setActiveJourney(index)}><span>{step.number}</span><step.icon /><strong>{step.title}</strong></button>)}
          </div>
          <article className="management-journey-stage" role="tabpanel">
            <span><activeStep.icon /></span>
            <div><small>Step {activeStep.number} · {activeStep.outcome}</small><h3>{activeStep.title}</h3><p>{activeStep.text}</p>
              {activeStep.path.startsWith('#') ? <a className="btn btn--gold" href={activeStep.path}>Jump to this step<ArrowRight /></a> : <Link className="btn btn--gold" to={activeStep.path}>Open this step<ArrowRight /></Link>}
            </div>
            <aside><Sparkles /><strong>Presenter cue</strong><p>Show the action, explain the guest value, then connect it to the next screen.</p></aside>
          </article>
        </div>
      </div>
    </section>

    <section className="section management-benefits">
      <div className="container">
        <PresentationHeading eyebrow="Why this matters" title="Practical value for guests and management" />
        <div className="management-benefit-grid">{benefits.map(([Icon, title, text]) => <article key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <section className="management-ai-showcase">
      <div className="container management-ai-showcase__grid">
        <div className="management-ai-orbit" aria-hidden="true"><span><BrainCircuit /></span><i /><i /><i /><b>Stay</b><b>Booking</b><b>Ujjain</b></div>
        <div>
          <span className="management-kicker"><span /> AI-powered future possibilities</span>
          <h2>Helpful answers before the guest needs to call</h2>
          <p>The new AI Travel Assistant can suggest demo rooms, explain booking steps, guide status checks and answer common stay or pilgrimage questions. In production, a secure live Groq model can extend this foundation.</p>
          <ul><li><Check />Reduces repetitive first-level questions</li><li><Check />Guides guests to the right website action</li><li><Check />Works in demo mode without an API key</li><li><Check />Preserves booking and travel honesty</li></ul>
          <div><Link className="btn btn--gold btn--large" to="/ai-assistant"><Bot />Open AI Assistant<ArrowRight /></Link><Link className="btn btn--glass btn--large" to="/ai-assistant?prompt=management"><Sparkles />Try Suggested Questions</Link></div>
        </div>
      </div>
    </section>

    <section className="section management-comparison">
      <div className="container">
        <PresentationHeading eyebrow="Scope boundary" title="Current demo versus final production" text="The visual and journey direction can be reviewed now; operational integrations follow only after approval." />
        <div className="management-comparison__grid">
          <article><span><Eye />Current demo</span><ul><li>Browser-based presentation records</li><li>Sample room data and tariffs</li><li>Concept and placeholder imagery</li><li>Simulated request status updates</li><li>Direct phone and WhatsApp enquiry links</li></ul></article>
          <article><span><Database />Final production</span><ul><li>Secure database and role-based access</li><li>Management-approved inventory and pricing</li><li>Official photography and verified content</li><li>Real notifications and booking operations</li><li>Payment, domain and analytics if approved</li></ul></article>
        </div>
      </div>
    </section>

    <section className="section management-approval" id="approval-checklist">
      <div className="container">
        <PresentationHeading eyebrow="Decisions required" title="Management approval checklist" text="These five approvals turn the concept into an accurate production brief." />
        <div className="management-approval__grid">
          {['Brand direction and bilingual tone', 'Guest booking request journey', 'Room presentation and tariff format', 'Status stages and admin workflow', 'Production scope and data collection'].map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{item}</h3><p>Review with the relevant management owner.</p></div><b>Pending approval</b></article>)}
        </div>
      </div>
    </section>

    <section className="section management-checklist-section">
      <div className="container">
        <div className="management-checklist__head">
          <PresentationHeading eyebrow="Production input sheet" title="Information to collect after approval" text="Print this A4-friendly checklist and mark confirmed items during the meeting." />
          <button type="button" className="btn btn--outline" onClick={() => window.print()}><Printer />Print checklist</button>
        </div>
        <div className="management-checklist">
          {checklist.map(([category, items]) => <fieldset key={category}>
            <legend>{category}</legend>
            {items.map(item => <label key={item}><input type="checkbox" /><span aria-hidden="true"><Check /></span>{item}</label>)}
          </fieldset>)}
        </div>
        <div className="management-checklist__signoff">
          <p>Reviewed by: <span /></p><p>Date: <span /></p><p>Next discussion: <span /></p>
        </div>
      </div>
    </section>

    {confirmReset && <div className="management-dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setConfirmReset(false) }}>
      <section className="management-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title">
        <button type="button" className="management-dialog__close" onClick={() => setConfirmReset(false)} aria-label="Close reset dialog"><X /></button>
        <span><RefreshCcw /></span><h2 id="reset-title">Reset presentation records?</h2>
        <p>This removes only booking records created in this browser. Built-in read-only samples and all website content remain available.</p>
        <div><button ref={cancelRef} type="button" className="btn btn--outline" onClick={() => setConfirmReset(false)}>Keep records</button><button type="button" className="btn btn--primary" onClick={resetRecords}>Reset demo records</button></div>
      </section>
    </div>}
  </div>
}

function PresentationHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <header className="management-heading"><span>{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</header>
}
