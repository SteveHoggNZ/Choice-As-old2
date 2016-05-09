import { ssh, t, st } from '../../../../util'
import { util } from 'routes/ChoiceAs/modules/choiceas'

ssh('weightedRandomSelect')

st('should be exported as a function', (a) => {
  a.equal(typeof util.weightedRandomSelect, 'function', 'is a function')
})

t('should throw an error if no values supplied', (a) => {
  a.plan(3)
  a.throws(() => util.weightedRandomSelect(),
    /Expected value in the form/, 'no input throws error')
  a.throws(() => util.weightedRandomSelect([]),
    /Expected non-empty object/, 'empty array throws error')
  a.throws(() => util.weightedRandomSelect({}),
    /Expected non-empty object/, 'empty object throws error')
})

t('should throw an error if the weights are not decimals', (a) => {
  a.plan(2)
  a.throws(() => util.weightedRandomSelect({key1: 'a'}),
    /Expected all weights to be numbers/, 'invalid key1 throws error')
  a.throws(() => util.weightedRandomSelect({key1: 0.3, key2: []}),
    /Expected all weights to be numbers/, 'invalid key2 throws error')
})

t('Throws an error if the weights do not sum to 1.', (a) => {
  a.plan(4)
  const sumError = /Expected the weights for all keys to sum to 1/
  const expectPrefix = /exception when weights sum to/
  a.throws(() => util.weightedRandomSelect({key1: 0.2}),
    sumError, `${expectPrefix} 0.2`)
  a.throws(() => util.weightedRandomSelect({key1: 0.2, key2: 0.1, key3: 0.3}),
    sumError, `${expectPrefix} 0.6`)
  a.throws(() => util.weightedRandomSelect({key1: 0.4, key2: 0.5, key3: 0.2}),
    sumError, `${expectPrefix} 1.1`)
  a.equal(util.weightedRandomSelect({key1: 0.0, key2: 1.0}), 'key2',
    'key2 selected; no exception with weight sum = 1')
})

ssh('Selection Distribution')

const confirmSelectWeights = ({
  assert,
  spec,
  loopCount,
  errorMargin
}) => {
  let testCounts = Object.keys(spec)
    .reduce((acc, key) => {
      return {
        ...acc,
        [key]: 0
      }
    }, {})

  for (let i = 0; i < loopCount; i++) {
    testCounts[util.weightedRandomSelect(spec)]++
  }

  for (let key of Object.keys(spec)) {
    const weight = spec[key]
    const weightActual = testCounts[key] / loopCount
    const weightDiff = Math.abs(weight - weightActual)
    // console.log('key', key, 'expected', weight,
    //   'actual', weightActual, 'diff', weightDiff)
    assert.ok(weightDiff <= errorMargin,
      `expect ${weight} +- ${errorMargin} ` +
      `actual ${weightActual} +- ${weightDiff}`)
  }

  assert.end()
}

const errorMargin = 0.002
const loopCount = 500000

t(`should distribute 0.5 and 0.5 equally +- ${errorMargin} for ` +
  `${loopCount} selections.`,
  (assert) => {
    confirmSelectWeights({
      assert,
      spec: {key1: 0.5, key2: 0.5},
      loopCount,
      errorMargin
    })
  })

t(`should distribute 0.1 and 0.9 properly +- ${errorMargin} for ` +
  `${loopCount} selections.`,
  (assert) => {
    confirmSelectWeights({
      assert,
      spec: {key1: 0.1, key2: 0.9},
      loopCount,
      errorMargin
    })
  })

t(`should distribute 0.9 and 0.1 properly +- ${errorMargin} for ` +
  `${loopCount} selections.`,
  (assert) => {
    confirmSelectWeights({
      assert,
      spec: {key1: 0.9, key2: 0.1},
      loopCount,
      errorMargin
    })
  })

t(`should distribute 0.2, 0.4, 0.1, 0.3 properly +- ${errorMargin} for ` +
  `${loopCount} selections.`,
  (assert) => {
    confirmSelectWeights({
      assert,
      spec: {key1: 0.2, key2: 0.4, key3: 0.1, key4: 0.3},
      loopCount,
      errorMargin
    })
  })
