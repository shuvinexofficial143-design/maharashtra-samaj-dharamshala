import { Route, Routes } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { About, Contact, Facilities, FAQ, Gallery, Nearby, NotFound, RoomDetails, Rooms } from './pages/PublicPages'
import { Booking, BookingStatus } from './pages/Booking'
import { AdminDemo } from './pages/AdminDemo'
import { ManagementPreview } from './pages/ManagementPreview'
import { ToastProvider } from './context/ToastContext'
import { AIAssistantPage } from './pages/AIAssistantPage'
import { NativeAppBridge } from './components/NativeAppBridge'

export function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <NativeAppBridge />
        <Layout>
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
            <Route path="/admin-demo" element={<AdminDemo />} />
            <Route path="/management-preview" element={<ManagementPreview />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </LanguageProvider>
  )
}
