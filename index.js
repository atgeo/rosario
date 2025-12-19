import { MYSTERIES } from './mysteries.js'
import { PRAYERS } from './prayers.js'

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

export default function rosario ({ mystery = 'joyful' } = {}) {
  const order = buildOrder(mystery)
  let index = 0

  return {
    next() {
      if (index < order.length - 1) index++
    },

    current() {
      const key = order[index]
      return {
        prayer: key,
        text: PRAYERS[key]
      }
    },

    done() {
      return index >= order.length - 1
    },

    reset() {
      index = 0
    }
  }
}
