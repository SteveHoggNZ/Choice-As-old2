import { h, t } from '../../test_util'
import { fork, take, put, select } from 'redux-saga/effects'
import sagaUtil from 'util/sagas'

h('(Util) sagaUtil')

t('should export a checkRequire function', (a) => {
  a.equal(typeof sagaUtil.checkRequire, 'function', 'is a function')

  a.throws(() => sagaUtil.checkRequire({one: ''}, {}),
    /expected action.one to exist/, 'should throw error on missing require')

  a.throws(() => sagaUtil.checkRequire({one: /^[a-z]$/}, {one: 'ab2c'}),
    /expected action.one to match /, 'should throw error on non-match regex')

  a.throws(() => sagaUtil.checkRequire({one: ''}, {one: 'ab2c'}),
    /undefined/, 'should not throw')

  a.throws(() =>
    sagaUtil.checkRequire({one: {two: /^[a-z]$/}}, {one: {two: 'ab2c'}}),
      /expected action.one.two to match /,
      'should throw error on deep non-match regex')

  a.end()
})

t('should export a function wrapHandler', (a) => {
  a.equal(typeof sagaUtil.wrapHandler, 'function', 'function exported')

  const makeTestHandler = () =>
    function * generator (action) {
      yield `${action.payload.name} 1`
      yield `${action.payload.name} 2`
      yield `${action.payload.name} 3`
    }

  const errorHandler = (error) => {
    return `${error} was handled`
  }

  const handler = sagaUtil.wrapHandler({handler: makeTestHandler(), errorHandler})
  const iterator = handler({payload: {name: 'test'}})

  /* test yields from the generator */
  a.equal(iterator.next().value, 'test 1', 'generator() yield #1 returned')
  a.equal(iterator.next().value, 'test 2', 'generator()  yield #2 returned')

  /* test error handling of the wrapper */
  const result = iterator.throw(new Error('test error')).value
  a.deepEqual(result,
    put(new Error('test error').toString() + ' was handled'),
    'returns a saga PUT with formatted errorHandler error')

  /* test required field checker */
  let checkerCalled = false

  sagaUtil.wrapHandler({
    handler: makeTestHandler(),
    errorHandler,
    checker: (require, action) => { checkerCalled = true }
  })().next()
  a.ok(!checkerCalled, 'should not call the checker when require is not set')

  sagaUtil.wrapHandler({
    handler: makeTestHandler(),
    errorHandler,
    require: {one: ''},
    checker: (require, action) => { checkerCalled = true }
  })().next()
  a.ok(checkerCalled, 'should call the checker when require is set')

  const badHandler = sagaUtil.wrapHandler({
    handler: makeTestHandler(),
    errorHandler,
    require: {one: ''},
    checker: (require, action) => { throw new Error('checker fail test') }
  })
  const badIterator = badHandler({payload: {name: 'test'}})

  a.deepEqual(badIterator.next().value,
    put(new Error('checker fail test').toString() + ' was handled'),
    'should catch and handle the error thrown by the checker')

  a.end()
})

t('should export a makeSagaMain that forks all handlers', (a) => {
  a.equal(typeof sagaUtil.makeSagaMain, 'function', 'function exported')

  const testHandlers = {
    ['one']: {
      handler: () => '',
      errorHandler: () => ''
    },
    ['two']: {
      handler: () => '',
      errorHandler: () => ''
    }
  }

  const testWrapper = ({handler, errorHandler}) => handler

  const iterator = sagaUtil.makeSagaMain
    ({handlers: testHandlers})
    ({wrapper: testWrapper})
  const forks = iterator.next().value
  const handlerKeys = Object.keys(testHandlers)

  a.ok(Array.isArray(forks), 'array of forks returned')

  a.equal(forks.length, handlerKeys.length,
    'number of forks equals the number of handlers')

  for (let i = 0; i < forks.length; i++) {
    // each fork is a new monitor generator
    const key = handlerKeys[i]
    const monitor = forks[i].FORK.fn()

    for (let j = 0; j < 2; j++) {
      // loop through monitor twice to confirm there are 2 actions that repeat
      a.deepEqual(
        monitor.next().value,
        take(key),
        `monitor action ${j * 2 + 1} is take key '${key}'`
      )

      a.deepEqual(
        monitor.next().value,
        fork(testHandlers[key].handler, undefined),
        `monitor action ${j * 2 + 2} is fork handler for '${key}'`
      )
    }
  }
  a.end()
})
