import test from 'node:test'
import assert from 'node:assert'
import rosario from '../index.js'
import en from '../src/lang/en.js'

function collectSteps (r) {
  const steps = []

  while (!r.done()) {
    steps.push(r.current())
    r.next()
  }

  return steps
}

test('creates a rosary session', async () => {
  const r = await rosario()
  assert.ok(r)
  assert.strictEqual(typeof r.next, 'function')
})

test('starts at the first prayer', async () => {
  const r = await rosario()
  const current = r.current()
  assert.ok(current)
})

test('advances through prayers', async () => {
  const r = await rosario()
  const first = r.current()

  r.next()
  const second = r.current()

  assert.notStrictEqual(first, second)
})

test('is not done on the last prayer', async () => {
  const r = await rosario({
    mystery: 'joyful',
    includeConcludingPrayers: false,
  })
  let last

  while (!r.done()) {
    last = r.current()
    r.next()
  }

  assert.strictEqual(last.key, 'fatimaPrayer')
  assert.ok(r.done())
  assert.strictEqual(r.current().key, 'fatimaPrayer')
})

test('is done after next on the closing prayer', async () => {
  const r = await rosario({ mystery: 'joyful' })
  let last

  while (!r.done()) {
    last = r.current()
    r.next()
  }

  assert.strictEqual(last.key, 'closingPrayer')
  assert.ok(r.done())
})

test('defaults to Glorious mysteries on Sunday', async (t) => {
  t.mock.timers.enable({
    apis: ['Date'],
    now: new Date(2026, 7, 16, 12),
  })

  const r = await rosario()
  assert.strictEqual(r.getDailyMystery(), 'glorious')
})

test('throws on invalid mystery', async () => {
  await assert.rejects(
    () => rosario({ mystery: 'invalid' }),
    /Unknown mystery/,
  )
})

test('throws on unsupported language', async () => {
  await assert.rejects(
    () => rosario({ lang: 'aa' }),
    /Unsupported language: aa/,
  )
})

test('throws when custom locale is missing prayers', async () => {
  await assert.rejects(
    () => rosario({ lang: { mysteries: en.mysteries } }),
    /missing `prayers`/,
  )
})

test('throws when custom locale is missing mysteries', async () => {
  await assert.rejects(
    () => rosario({ lang: { prayers: en.prayers } }),
    /missing `mysteries`/,
  )
})

test('throws when custom locale is missing a required prayer', async () => {
  const lang = structuredClone(en)
  delete lang.prayers.hailMary

  await assert.rejects(
    () => rosario({ lang }),
    /missing `prayers.hailMary`/,
  )
})

test('throws when custom locale has empty mystery text', async () => {
  const lang = structuredClone(en)
  lang.mysteries.annunciation = '   '

  await assert.rejects(
    () => rosario({ lang }),
    /missing `mysteries.annunciation`/,
  )
})

test('accepts a complete custom locale', async () => {
  const r = await rosario({ mystery: 'joyful', lang: structuredClone(en) })
  assert.strictEqual(r.current().key, 'creed')
  assert.ok(r.current().text)
})

test('attaches mystery to decade prayers only', async () => {
  const r = await rosario({ mystery: 'joyful', lang: 'en' })
  const steps = collectSteps(r)

  const opening = steps.slice(0, 6)
  const firstDecade = steps.slice(6, 19)
  const lastDecade = steps.slice(6 + 13 * 4, 6 + 13 * 5)
  const concluding = steps.slice(-2)

  for (const step of [...opening, ...concluding]) {
    assert.strictEqual(step.mystery, undefined)
  }

  assert.deepStrictEqual(firstDecade[0], {
    key: 'ourFather',
    text: en.prayers.ourFather,
    mystery: {
      set: 'joyful',
      key: 'annunciation',
      text: 'The Annunciation',
      decade: 1,
    },
  })

  for (const step of firstDecade) {
    assert.strictEqual(step.mystery?.key, 'annunciation')
    assert.strictEqual(step.mystery?.decade, 1)
  }

  for (const step of lastDecade) {
    assert.strictEqual(step.mystery?.key, 'findingInTemple')
    assert.strictEqual(step.mystery?.decade, 5)
  }
})

test('includes concluding prayers by default', async () => {
  const r = await rosario({ mystery: 'joyful', lang: 'en' })
  const steps = collectSteps(r)
  const hailIndex = steps.findIndex(step => step.key === 'hailHolyQueen')
  const closingIndex = steps.findIndex(step => step.key === 'closingPrayer')

  assert.ok(hailIndex > 0)
  assert.strictEqual(steps[hailIndex - 1].key, 'fatimaPrayer')
  assert.strictEqual(steps[hailIndex - 1].mystery?.key, 'findingInTemple')
  assert.strictEqual(closingIndex, hailIndex + 1)
  assert.strictEqual(closingIndex, steps.length - 1)
})

test('omits Hail Holy Queen and closing prayer when includeConcludingPrayers is false', async () => {
  const r = await rosario({
    mystery: 'joyful',
    lang: 'en',
    includeConcludingPrayers: false,
  })
  const keys = collectSteps(r).map(step => step.key)

  assert.ok(!keys.includes('hailHolyQueen'))
  assert.ok(!keys.includes('closingPrayer'))
  assert.strictEqual(keys.at(-1), 'fatimaPrayer')
})

test('resolves concluding prayer text in every language', async () => {
  for (const lang of ['en', 'la', 'it', 'ar']) {
    const r = await rosario({
      mystery: 'joyful',
      lang,
    })

    const steps = collectSteps(r)
    const hail = steps.find(step => step.key === 'hailHolyQueen')
    const closing = steps.find(step => step.key === 'closingPrayer')

    assert.ok(hail?.text, `missing hailHolyQueen text for ${lang}`)
    assert.ok(closing?.text, `missing closingPrayer text for ${lang}`)
  }
})
