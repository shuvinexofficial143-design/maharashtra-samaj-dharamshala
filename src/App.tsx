import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { Layout } from './components/Layout'
import { ToastProvider } from './context/ToastContext'
import { NativeAppBridge } from './components/NativeAppBridge'

const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })))
const Booking = lazy(() => import('./pages/Booking').then(module => ({ default: module.Booking })))
const BookingStatus = lazy(() => import('./pages/Booking').then(module => ({ default: module.BookingStatus })))
const Rooms = lazy(() => import('./pages/PublicPages').then(module => ({ default: module.Rooms })))
const RoomDetails = lazy(() => import('./pages/PublicPages').then(module => ({ default: module.RoomDetails })))
const Gallery = lazy(() => import('./pages/PublicPages').then(module => ({ default: module.Gallery })))
const Facilities = lazy(() => import('./pages/PublicPages').then(module => ({ default: module.Facilities })))
const Nearby = lazy(() => import('./pages/PublicPages').then(module => ({ default: module.Nearby })))
const About = lazy(() => import('./pages/PublicPages').then(module => ({ default: module.About })))
const Contact = lazy(() => import('./pages/PublicPages').then(module => ({ default: module.Contact })))
const FAQ = lazy(() => import('./pages/PublicPages').then(module => ({ default: module.FAQ })))
const NotFound = lazy(() => import('./pages/PublicPages').then(module => ({ default: module.NotFound })))
const AIAssistantPage = lazy(() => import('./pages/AIAssistantPage').then(module => ({ default: module.AIAssistantPage })))

function RouteLoading() {
  return <div className="route-loading" role="status" aria-label="Loading page"><span aria-hidden="true" /></div>
}

export function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <NativeAppBridge />
        <Layout>
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:roomId" element={<RoomDetails />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking-status" element={<BookingStatus />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/nearby" element={<Nearby />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </ToastProvider>
    </LanguageProvider>
  )
}
