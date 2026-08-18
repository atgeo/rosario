import test from 'node:test'
import assert from 'node:assert'
import rosario from '../index.js'

function collectSteps (r) {
  const steps = []

  do {
    steps.push(r.current())
    r.next()
  } while (!r.done())

  steps.push(r.current())
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

test('eventually completes', async () => {
  const r = await rosario()

  while (!r.done()) {
    r.next()
  }

  assert.ok(r.done())
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

test('returns a mystery at the start of a decade', async () => {
  const r = await rosario({ mystery: 'joyful', lang: 'en' })

  let step

  do {
    step = r.current()
    if (step.type !== 'mystery') r.next()
  } while (step.type !== 'mystery')

  assert.strictEqual(step.type, 'mystery')
  assert.ok(step.key)
  assert.ok(step.text)
  assert.strictEqual(step.text, 'The Annunciation')
})

test('omits concluding prayers by default', async () => {
  const r = await rosario({ mystery: 'joyful', lang: 'en' })
  const keys = collectSteps(r).map(step => step.key)

  assert.ok(!keys.includes('hailHolyQueen'))
  assert.ok(!keys.includes('closingPrayer'))
})

test('appends Hail Holy Queen and closing prayer after 5 decades when enabled', async () => {
  const r = await rosario({
    mystery: 'joyful',
    lang: 'en',
    includeConcludingPrayers: true,
  })

  const steps = collectSteps(r)
  const keys = steps.map(step => step.key)

  const lastMysteryIndex = keys.lastIndexOf('findingInTemple')
  const hailIndex = keys.indexOf('hailHolyQueen')
  const closingIndex = keys.indexOf('closingPrayer')

  assert.ok(hailIndex > lastMysteryIndex)
  assert.strictEqual(closingIndex, hailIndex + 1)
  assert.strictEqual(closingIndex, keys.length - 1)

  assert.ok(steps[hailIndex].text)
  assert.ok(steps[closingIndex].text)
})

test('resolves concluding prayer text in every language', async () => {
  for (const lang of ['en', 'la', 'it', 'ar']) {
    const r = await rosario({
      mystery: 'joyful',
      lang,
      includeConcludingPrayers: true,
    })

    const steps = collectSteps(r)
    const hail = steps.find(step => step.key === 'hailHolyQueen')
    const closing = steps.find(step => step.key === 'closingPrayer')

    assert.ok(hail?.text, `missing hailHolyQueen text for ${lang}`)
    assert.ok(closing?.text, `missing closingPrayer text for ${lang}`)
  }
})
