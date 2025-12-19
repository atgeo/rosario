import test from 'node:test'
import assert from 'node:assert'
import rosario from '../index.js'

test('creates a rosary session', () => {
  const r = rosario()
  assert.ok(r)
  assert.strictEqual(typeof r.next, 'function')
})

test('starts at the first prayer', () => {
  const r = rosario()
  const current = r.current()
  assert.ok(current)
})

test('advances through prayers', () => {
  const r = rosario()
  const first = r.current()

  r.next()
  const second = r.current()

  assert.notStrictEqual(first, second)
})

test('eventually completes', () => {
  const r = rosario()

  while (!r.done()) {
    r.next()
  }

  assert.ok(r.done())
})

test('throws on invalid mystery', () => {
  assert.throws(() => {
    rosario({ mystery: 'invalid' })
  })
})
