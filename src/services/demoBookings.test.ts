import { describe, expect, it } from 'vitest'
import { createManagementSampleBooking, findDemoBooking, listDemoBookings, parseStoredBookings, resetDemoBookings, saveDemoBooking, updateDemoBookingStatus, type DemoBooking } from './demoBookings'

class MemoryStorage implements Storage {
  private values = new Map<string, string>()
  get length() { return this.values.size }
  clear() { this.values.clear() }
  getItem(key: string) { return this.values.get(key) ?? null }
  key(index: number) { return Array.from(this.values.keys())[index] ?? null }
  removeItem(key: string) { this.values.delete(key) }
  setItem(key: string, value: string) { this.values.set(key, value) }
}

const booking: DemoBooking = {
  reference: 'MSD-DEMO-ABC123', guestName: 'Demo Guest', mobile: '9876543210', city: 'Pune', roomId: 'family-room',
  roomName: 'Family Room', checkIn: '2026-09-01', checkOut: '2026-09-03', adults: 2, children: 1, roomCount: 1,
  nights: 2, demoTariff: 1650, estimatedDemoTotal: 3300, status: 'received', createdAt: '2026-08-16T10:00:00.000Z', updatedAt: '2026-08-16T10:00:00.000Z',
}

describe('demo booking storage', () => {
  it('returns an empty collection for corrupt or unexpected data', () => {
    expect(parseStoredBookings('{broken')).toEqual([])
    expect(parseStoredBookings('{"not":"an array"}')).toEqual([])
    expect(parseStoredBookings('[{"reference":"bad"}]')).toEqual([])
  })

  it('persists and finds a valid booking', () => {
    const storage = new MemoryStorage()
    expect(saveDemoBooking(booking, storage)).toBe(true)
    expect(listDemoBookings(storage)).toHaveLength(1)
    expect(findDemoBooking('msd-demo-abc123', storage)?.guestName).toBe('Demo Guest')
  })

  it('updates status without losing booking details', () => {
    const storage = new MemoryStorage()
    saveDemoBooking(booking, storage)
    const updated = updateDemoBookingStatus(booking.reference, 'confirmed', storage)
    expect(updated?.status).toBe('confirmed')
    expect(findDemoBooking(booking.reference, storage)?.roomName).toBe('Family Room')
  })

  it('creates one reusable management sample instead of duplicates', () => {
    const storage = new MemoryStorage()
    const room = { id: 'standard-ac', name: 'Standard AC Room', tariff: 1250 }
    const first = createManagementSampleBooking(room, storage)
    const second = createManagementSampleBooking(room, storage)
    expect(first?.created).toBe(true)
    expect(second?.created).toBe(false)
    expect(second?.booking.reference).toBe(first?.booking.reference)
    expect(listDemoBookings(storage)).toHaveLength(1)
  })

  it('resets only persisted demo bookings', () => {
    const storage = new MemoryStorage()
    saveDemoBooking(booking, storage)
    expect(resetDemoBookings(storage)).toBe(1)
    expect(listDemoBookings(storage)).toEqual([])
    expect(resetDemoBookings(storage)).toBe(0)
  })
})
