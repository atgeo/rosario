import { MYSTERIES } from './src/mysteries.js'
import { loadLang } from './src/lang/index.js'

const OPENING = [
  'creed',
  'ourFather',
  'hailMary',
  'hailMary',
  'hailMary',
  'gloryBe',
]

const DECADE = [
  'ourFather',
  ...Array(10).fill('hailMary'),
  'gloryBe',
  'fatimaPrayer',
]

const CONCLUDING_PRAYERS = [
  'hailHolyQueen',
  'closingPrayer',
]

const REQUIRED_PRAYERS = [...new Set([
  ...OPENING,
  ...DECADE,
  ...CONCLUDING_PRAYERS,
])]

const REQUIRED_MYSTERIES = Object.values(MYSTERIES).flat()

function isNonEmptyString (value) {
  return typeof value === 'string' && value.trim() !== ''
}

function assertLocale (locale) {
  if (locale == null || typeof locale !== 'object') {
    throw new Error('Invalid language object')
  }

  const hasPrayers = locale.prayers != null && typeof locale.prayers === 'object'
  const hasMysteries = locale.mysteries != null && typeof locale.mysteries === 'object'
  const missing = []

  if (!hasPrayers) missing.push('prayers')
  if (!hasMysteries) missing.push('mysteries')

  if (hasPrayers) {
    for (const key of REQUIRED_PRAYERS) {
      if (!isNonEmptyString(locale.prayers[key])) {
        missing.push(`prayers.${key}`)
      }
    }
  }

  if (hasMysteries) {
    for (const key of REQUIRED_MYSTERIES) {
      if (!isNonEmptyString(locale.mysteries[key])) {
        missing.push(`mysteries.${key}`)
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(`Invalid language object: missing \`${missing.join('`, `')}\``)
  }
}

function buildOrder (mystery, { includeConcludingPrayers = true }) {
  const events = MYSTERIES[mystery]
  if (!events) throw new Error('Unknown mystery')

  return [
    ...OPENING.map(key => ({ key })),

    ...events.flatMap((eventKey, decadeIndex) =>
      DECADE.map(prayerKey => ({
        key: prayerKey,
        mystery: {
          set: mystery,
          key: eventKey,
          decade: decadeIndex + 1,
        },
      })),
    ),

    ...(includeConcludingPrayers
      ? CONCLUDING_PRAYERS.map(key => ({ key }))
      : []),
  ]
}

function getDailyMystery() {
  const day = new Date().getDay()

  switch (day) {
    case 0: return 'glorious'
    case 1: return 'joyful'
    case 2: return 'sorrowful'
    case 3: return 'glorious'
    case 4: return 'luminous'
    case 5: return 'sorrowful'
    case 6: return 'joyful'
  }
}

export default async function rosario ({
  mystery = getDailyMystery(),
  lang = 'en',
  includeConcludingPrayers = true,
} = {}) {
  const locale =
    typeof lang === 'string'
      ? await loadLang(lang)
      : lang

  assertLocale(locale)

  const order = buildOrder(mystery, { includeConcludingPrayers })
  let index = 0

  return {
    next () {
      if (index < order.length) index++
    },

    current () {
      const item = order[Math.min(index, order.length - 1)]
      const step = {
        key: item.key,
        text: locale.prayers[item.key],
      }

      if (item.mystery) {
        step.mystery = {
          set: item.mystery.set,
          key: item.mystery.key,
          text: locale.mysteries[item.mystery.key],
          decade: item.mystery.decade,
        }
      }

      return step
    },

    done () {
      return index >= order.length
    },

    reset () {
      index = 0
    },

    getDailyMystery: () => mystery,
  }
}
