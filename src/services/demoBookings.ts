export type DemoBookingStatus = 'received' | 'awaiting' | 'confirmed' | 'cancelled'

export type DemoBooking = {
  reference: string
  guestName: string
  mobile: string
  email?: string
  city: string
  specialRequest?: string
  roomId: string
  roomName: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  roomCount: number
  nights: number
  demoTariff: number
  estimatedDemoTotal: number
  status: DemoBookingStatus
  createdAt: string
  updatedAt: string
  isSample?: boolean
  isReadOnlySample?: boolean
}

const STORAGE_KEY = 'msd-demo-bookings-v2'
export const DEMO_BOOKINGS_EVENT = 'msd-demo-bookings-changed'
const validStatuses: DemoBookingStatus[] = ['received', 'awaiting', 'confirmed', 'cancelled']

function getBrowserStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    const storage = window.localStorage
    const probe = '__msd_storage_probe__'
    storage.setItem(probe, probe)
    storage.removeItem(probe)
    return storage
  } catch {
    return null
  }
}

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

export function isDemoBooking(value: unknown): value is DemoBooking {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<DemoBooking>
  return typeof item.reference === 'string'
    && /^MSD-(?:DEMO-)?[A-Z0-9]{6}$/.test(item.reference)
    && typeof item.guestName === 'string'
    && typeof item.mobile === 'string'
    && typeof item.city === 'string'
    && typeof item.roomId === 'string'
    && typeof item.roomName === 'string'
    && typeof item.checkIn === 'string'
    && typeof item.checkOut === 'string'
    && isFiniteNonNegative(item.adults)
    && isFiniteNonNegative(item.children)
    && isFiniteNonNegative(item.roomCount)
    && isFiniteNonNegative(item.nights)
    && isFiniteNonNegative(item.demoTariff)
    && isFiniteNonNegative(item.estimatedDemoTotal)
    && typeof item.status === 'string'
    && validStatuses.includes(item.status as DemoBookingStatus)
    && typeof item.createdAt === 'string'
    && typeof item.updatedAt === 'string'
    && (item.isSample === undefined || typeof item.isSample === 'boolean')
    && (item.isReadOnlySample === undefined || typeof item.isReadOnlySample === 'boolean')
}

export function parseStoredBookings(raw: string | null): DemoBooking[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isDemoBooking)
  } catch {
    return []
  }
}

export function listDemoBookings(storage: Storage | null = getBrowserStorage()): DemoBooking[] {
  if (!storage) return []
  try {
    return parseStoredBookings(storage.getItem(STORAGE_KEY)).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

export function findDemoBooking(reference: string, storage: Storage | null = getBrowserStorage()): DemoBooking | null {
  const normalized = reference.trim().toUpperCase()
  return listDemoBookings(storage).find(item => item.reference === normalized) ?? null
}

export function createDemoReference(existing = listDemoBookings().map(item => item.reference)): string {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const bytes = new Uint8Array(6)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(bytes)
    else bytes.forEach((_, index) => { bytes[index] = (Date.now() + index * 17) % 256 })
    const suffix = Array.from(bytes, value => (value % 36).toString(36)).join('').toUpperCase()
    const reference = `MSD-${suffix}`
    if (!existing.includes(reference)) return reference
  }
  return `MSD-${Date.now().toString(36).slice(-6).toUpperCase().padStart(6, '0')}`
}

export function saveDemoBooking(booking: DemoBooking, storage: Storage | null = getBrowserStorage()): boolean {
  if (!storage || !isDemoBooking(booking)) return false
  try {
    const current = listDemoBookings(storage).filter(item => item.reference !== booking.reference)
    storage.setItem(STORAGE_KEY, JSON.stringify([booking, ...current].slice(0, 50)))
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(DEMO_BOOKINGS_EVENT, { detail: booking.reference }))
    return true
  } catch {
    return false
  }
}

export function updateDemoBookingStatus(reference: string, status: DemoBookingStatus, storage: Storage | null = getBrowserStorage()): DemoBooking | null {
  if (!storage || !validStatuses.includes(status)) return null
  try {
    const current = listDemoBookings(storage)
    const index = current.findIndex(item => item.reference === reference.trim().toUpperCase())
    if (index < 0) return null
    const updated = { ...current[index], status, updatedAt: new Date().toISOString() }
    current[index] = updated
    storage.setItem(STORAGE_KEY, JSON.stringify(current))
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(DEMO_BOOKINGS_EVENT, { detail: updated.reference }))
    return updated
  } catch {
    return null
  }
}

export function resetDemoBookings(storage: Storage | null = getBrowserStorage()): number {
  if (!storage) return 0
  try {
    const count = listDemoBookings(storage).length
    storage.removeItem(STORAGE_KEY)
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(DEMO_BOOKINGS_EVENT, { detail: 'reset' }))
    return count
  } catch {
    return 0
  }
}

export function createManagementSampleBooking(room: { id: string; name: string; tariff: number }, storage: Storage | null = getBrowserStorage()): { booking: DemoBooking; created: boolean } | null {
  if (!storage) return null
  const existing = listDemoBookings(storage)
  const reusable = existing.find(item => item.isSample && !item.isReadOnlySample && item.guestName === 'Demo Guest' && item.roomId === room.id)
  if (reusable) return { booking: reusable, created: false }
  const checkInDate = new Date()
  checkInDate.setDate(checkInDate.getDate() + 2)
  const checkOutDate = new Date(checkInDate)
  checkOutDate.setDate(checkOutDate.getDate() + 2)
  const now = new Date().toISOString()
  const booking: DemoBooking = {
    reference: createDemoReference(existing.map(item => item.reference)), guestName: 'Demo Guest', mobile: '9000000000', city: 'Presentation City',
    specialRequest: 'Sample Demo — management presentation record', roomId: room.id, roomName: room.name,
    checkIn: checkInDate.toISOString().slice(0, 10), checkOut: checkOutDate.toISOString().slice(0, 10), adults: 2, children: 1,
    roomCount: 1, nights: 2, demoTariff: room.tariff, estimatedDemoTotal: room.tariff * 2, status: 'received',
    createdAt: now, updatedAt: now, isSample: true,
  }
  return saveDemoBooking(booking, storage) ? { booking, created: true } : null
}

export const sampleDemoBookings: DemoBooking[] = [
  {
    reference: 'MSD-SMP101', guestName: 'Sunita Deshmukh', mobile: '98••••••21', city: 'Pune', roomId: 'standard-ac', roomName: 'Standard AC Room', checkIn: '2026-08-18', checkOut: '2026-08-20', adults: 2, children: 0, roomCount: 1, nights: 2, demoTariff: 1250, estimatedDemoTotal: 2500, status: 'confirmed', createdAt: '2026-08-14T09:30:00.000Z', updatedAt: '2026-08-15T10:15:00.000Z', isSample: true, isReadOnlySample: true,
  },
  {
    reference: 'MSD-SMP102', guestName: 'Rajesh Kulkarni', mobile: '97••••••48', city: 'Nashik', roomId: 'family-room', roomName: 'Family Room', checkIn: '2026-08-19', checkOut: '2026-08-22', adults: 3, children: 1, roomCount: 1, nights: 3, demoTariff: 1650, estimatedDemoTotal: 4950, status: 'awaiting', createdAt: '2026-08-15T07:10:00.000Z', updatedAt: '2026-08-15T07:10:00.000Z', isSample: true, isReadOnlySample: true,
  },
]
