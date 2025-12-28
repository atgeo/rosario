import test from 'node:test'
import assert from 'node:assert'
import rosario from '../index.js'

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
