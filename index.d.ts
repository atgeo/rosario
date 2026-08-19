export type Mystery =
  | 'joyful'
  | 'sorrowful'
  | 'glorious'
  | 'luminous'

export type Language =
  | 'en'
  | 'la'
  | 'it'
  | 'ar'

export type PrayerKey =
  | 'apostlesCreed'
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

export type RosarioCurrent =
  | {
      readonly type: 'prayer'
      readonly key: PrayerKey
      readonly text: string
    }
  | {
      readonly type: 'mystery'
      readonly key: MysteryKey
      readonly text: string
    }

export interface RosarioSession {
  next(): void
  current(): RosarioCurrent
  done(): boolean
  reset(): void
  getDailyMystery(): Mystery
}

export default function rosario(
  options?: RosarioOptions,
): Promise<RosarioSession>
