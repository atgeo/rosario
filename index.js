import { MYSTERIES } from './src/mysteries.js'
import { loadLang } from './src/lang/index.js'

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

function buildOrder (mystery, { includeConcludingPrayers = false }) {
  const events = MYSTERIES[mystery]
  if (!events) throw new Error('Unknown mystery')

  return [
    { type: 'prayer', key: 'apostlesCreed' },
    { type: 'prayer', key: 'ourFather' },
    { type: 'prayer', key: 'hailMary' },
    { type: 'prayer', key: 'hailMary' },
    { type: 'prayer', key: 'hailMary' },
    { type: 'prayer', key: 'gloryBe' },

    ...events.flatMap(eventKey => [
      { type: 'mystery', key: eventKey },
      ...DECADE.map(prayerKey => ({
        type: 'prayer',
        key: prayerKey,
      })),
    ]),

    ...(includeConcludingPrayers
      ? CONCLUDING_PRAYERS.map(key => ({
        type: 'prayer',
        key,
      }))
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
  includeConcludingPrayers = false,
} = {}) {
  const locale =
    typeof lang === 'string'
      ? await loadLang(lang)
      : lang

  if (!locale || !locale.prayers) {
    throw new Error('Invalid language object: missing `prayers`')
  }

  const order = buildOrder(mystery, { includeConcludingPrayers })
  let index = 0

  return {
    next () {
      if (index < order.length - 1) index++
    },

    current () {
      const item = order[index]

      if (item.type === 'mystery') {
        return {
          type: 'mystery',
          key: item.key,
          text: locale.mysteries[item.key],
        }
      }

      return {
        type: 'prayer',
        key: item.key,
        text: locale.prayers[item.key],
      }
    },

    done () {
      return index >= order.length - 1
    },

    reset () {
      index = 0
    },

    getDailyMystery: () => mystery,
  }
}
