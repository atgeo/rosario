import { MYSTERIES } from './src/mysteries.js'
import { loadLang } from './src/lang/index.js'

const DECADE = [
  'ourFather',
  ...Array(10).fill('hailMary'),
  'gloryBe',
  'fatimaPrayer',
]

function buildOrder (mystery) {
  const events = MYSTERIES[mystery]
  if (!events) throw new Error('Unknown mystery')

  return [
    'apostlesCreed',
    'ourFather',
    'hailMary',
    'hailMary',
    'hailMary',
    'gloryBe',
    ...events.flatMap(event => DECADE),
  ]
}

export default async function rosario ({
  mystery = 'joyful',
  lang = 'en',
} = {}) {
  const locale =
    typeof lang === 'string'
      ? await loadLang(lang)
      : lang

  if (!locale || !locale.prayers) {
    throw new Error('Invalid language object: missing `prayers`')
  }

  const order = buildOrder(mystery)
  let index = 0

  return {
    next () {
      if (index < order.length - 1) index++
    },

    current () {
      const key = order[index]
      return {
        prayer: key,
        text: locale.prayers[key],
      }
    },

    done () {
      return index >= order.length - 1
    },

    reset () {
      index = 0
    },
  }
}
