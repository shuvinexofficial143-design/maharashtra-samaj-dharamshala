export type Lang = 'hi' | 'en'
export type LocalText = { hi: string; en: string }
export type Availability = 'available' | 'limited' | 'soldout'

export type Room = {
  id: string
  name: LocalText
  tagline: LocalText
  description: LocalText
  occupancy: string
  beds: LocalText
  cooling: LocalText
  bathroom: LocalText
  size: string
  tariff: number
  availability: Availability
  amenities: LocalText[]
  suitableFor: LocalText[]
  image: string
}
