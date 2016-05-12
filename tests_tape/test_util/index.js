import test from 'blue-tape'

const testPrefix = '--'

/* test */
export const t = (name, cb) => test(`${testPrefix} ${name}`, cb)
export const tt = (name, cb) => test(`${testPrefix}${testPrefix} ${name}`, cb)

/* single test */
export const st = (name, cb) => {
  const scb = (assert) => {
    assert.plan(1)
    return cb(assert)
  }
  test(`${testPrefix} ${name}`, scb)
}

/* headings */
export const h = (name) => test(name, (a) => a.end())
export const hh = (name) => test(`${testPrefix} ${name}`, (a) => a.end())
export const hhh = (name) => test(`${testPrefix}${testPrefix} ${name}`, (a) => a.end())
export const sh = (name) => h('- ' + name)
export const ssh = (name) => h('-- ' + name)
