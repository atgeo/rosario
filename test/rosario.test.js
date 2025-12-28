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
