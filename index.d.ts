export type Mystery =
  | 'joyful'
  | 'sorrowful'
  | 'glorious'
  | 'luminous'

export type Language =
  | 'en'
  | 'la'
  | 'it'
  | 'es'
  | 'pt'
  | 'fr'
  | 'de'
  | 'ar'
  | 'tl'
  | 'id'
  | 'vi'
  | 'fi'
  | 'lt'

export type PrayerKey =
  | 'creed'
  | 'ourFather'
  | 'hailMary'
  | 'gloryBe'
  | 'fatimaPrayer'
  | 'hailHolyQueen'
  | 'closingPrayer'

export type MysteryKey =
  | 'annunciation'
  | 'visitation'
  | 'nativity'
  | 'presentation'
  | 'findingInTemple'
  | 'baptism'
  | 'weddingAtCana'
  | 'proclaimingKingdom'
  | 'transfiguration'
  | 'institutionEucharist'
  | 'agonyInGarden'
  | 'scourgingAtPillar'
  | 'crowningWithThorns'
  | 'carryingCross'
  | 'crucifixion'
  | 'resurrection'
  | 'ascension'
  | 'descentHolySpirit'
  | 'assumption'
  | 'coronation'

export interface RosarioLocale {
  prayers: Record<PrayerKey, string>
  mysteries: Record<MysteryKey, string>
}

export interface RosarioOptions {
  mystery?: Mystery
  lang?: Language | RosarioLocale
  includeConcludingPrayers?: boolean
}

export interface RosarioMystery {
  readonly set: Mystery
  readonly key: MysteryKey
  readonly text: string
  readonly decade: 1 | 2 | 3 | 4 | 5
}

export interface RosarioCurrent {
  readonly key: PrayerKey
  readonly text: string
  readonly index: number
  readonly mystery?: RosarioMystery
}

export interface RosarioSession {
  readonly total: number
  next(): void
  current(): RosarioCurrent
  done(): boolean
  reset(): void
  getDailyMystery(): Mystery
}

export default function rosario(
  options?: RosarioOptions,
): Promise<RosarioSession>
