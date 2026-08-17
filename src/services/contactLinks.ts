import { siteConfig } from '../data/site'

export const defaultWhatsappMessage = `Namaste, I would like to enquire about accommodation at ${siteConfig.businessName}, ${siteConfig.location.split(',')[0]}.`

export function createWhatsappLink(message = defaultWhatsappMessage) {
  const number = siteConfig.phoneLink.replace(/\D/g, '')
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function createBookingWhatsappMessage(details: { reference: string; guestName?: string; room: string; checkIn: string; checkOut: string }) {
  const guest = details.guestName ? ` Guest: ${details.guestName}.` : ''
  return `Namaste, I would like to enquire about my demo accommodation request at ${siteConfig.businessName}, ${siteConfig.location.split(',')[0]}.${guest} Demo reference: ${details.reference}. Room: ${details.room}. Dates: ${details.checkIn} to ${details.checkOut}. I understand this is not a confirmed booking.`
}

export function createPlaceDirectionsLink(placeName: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${placeName}, Ujjain, Madhya Pradesh`)}`
}
