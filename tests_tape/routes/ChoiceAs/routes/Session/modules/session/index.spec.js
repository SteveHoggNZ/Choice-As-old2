import { h, hh, hhh, t } from '../../../../../../test_util'
import test from 'blue-tape'
import Immutable from 'immutable'
import uuid from 'uuid-v4'
import { push as routerPush } from 'react-router-redux'
import { call, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import config from 'config'
import { constants, actions, selectors, sagas, initialState, reducer }
  from 'routes/ChoiceAs/routes/Session/modules/session'
import { selectors as selectorsChoiceAs }
  from 'routes/ChoiceAs/modules/choiceas'

const fixtures = {
  conditionsExample: {
    conditions: config.conditions,
    keys: config.keys
  }
}

h('(Redux Module) ChoiceAs/Session')

/* constants */
hh('(Constants)')

test('should export constants', (a) => {
  a.notEqual(constants.STATE_PATH, undefined, 'STATE_PATH is defined')
  a.notEqual(constants.ROUTE_PATH, undefined, 'ROUTE_PATH is defined')
  a.notEqual(constants.PREFIX, undefined, 'PREFIX is defined')

  const required = [
    'ERROR',
    'START',
    'INIT',
    'STOP',
    'LOG',
    'KEY_CLICK'
  ]
  for (let name of required) {
    a.notEqual(constants[name], undefined, `constants.${name} exists`)
    a.ok(constants[name].startsWith(constants.PREFIX),
      `${constants[name]} starts with ${constants.PREFIX}`)
  }
  a.end()
})

/* actions */
hh('(Actions)')
/* action creators */
hhh('(Action Creators)')

test('should export actions.creators', (a) => {
  a.plan(1)
  a.equal(typeof actions.creators, 'object', 'is and object')
})

test('should export keyClick action', (a) => {
  a.equal(typeof actions.creators.keyClick, 'function', 'is a function')

  a.deepEqual(actions.creators.keyClick('1-1-1', 'L1'),
    {type: constants.KEY_CLICK, payload: {sessionID: '1-1-1', keyID: 'L1'}},
    'action defined correctly')

  a.end()
})

test('should export start action', (a) => {
  a.equal(typeof actions.creators.start, 'function', 'is a function')

  a.deepEqual(actions.creators.start('C2'),
    {type: constants.START, payload: { conditionID: 'C2' } },
    'action defined correctly')

  a.end()
})

test('should export init action', (a) => {
  a.equal(typeof actions.creators.init, 'function', 'is a function')

  a.deepEqual(actions.creators.init('C2', 123),
    {type: constants.INIT, payload: {conditionID: 'C2', sessionID: 123}},
    'action defined correctly')

  a.end()
})

test('should export stop action', (a) => {
  a.equal(typeof actions.creators.stop, 'function', 'is a function')

  a.deepEqual(actions.creators.stop(),
    {type: constants.STOP},
    'action defined correctly')

  a.end()
})

test('should export log action', (a) => {
  a.equal(typeof actions.creators.log, 'function', 'is a function')

  a.deepEqual(actions.creators.log('2-2-2', 'test message'),
    {type: constants.LOG, payload: {sessionID: '2-2-2', msg: 'test message'}},
    'action defined correctly')

  a.end()
})

/* action handlers */
hhh('(Action Handlers)')

test('should export actions.handlers', (a) => {
  a.plan(1)
  a.equal(typeof actions.handlers, 'object', 'is and object')
})

test('should handle INIT', (a) => {
  a.plan(2)
  a.equal(typeof actions.handlers[constants.INIT], 'function',
    'handler function is defined')

  const state = Immutable.fromJS({})
  const action = {payload: {conditionID: 'C2', sessionID: '1-1-1'}}
  const output = actions.handlers[constants.INIT](state, action)

  a.ok(output.equals(Immutable.fromJS({
    '1-1-1': {
      conditionID: 'C2',
      trialCount: 0,
      log: []
    }
  })), 'inits the run state')
})

test('should handle LOG', (a) => {
  a.plan(2)
  a.equal(typeof actions.handlers[constants.LOG], 'function',
    'handler function is defined')

  const state = Immutable.fromJS({
    '2-2-2': {
      log: ['one']
    }
  })
  const action = {payload: {sessionID: '2-2-2', msg: 'two'}}
  const output = actions.handlers[constants.LOG](state, action)

  a.ok(output.equals(Immutable.fromJS({
    '2-2-2': {
      log: ['two', 'one']
    }
  })), 'logs the msg')
})

/* reducer */
hh('(Reducer)')

test('should export a reducer', (a) => {
  a.plan(1)
  a.equal(typeof reducer, 'function', 'is a function')
})

test('should export initialState', (a) => {
  a.plan(1)
  a.ok(Immutable.Iterable.isIterable(initialState),
    'initialState is an Immutable.js Iterable')
})

test('should run the handler on the state', (a) => {
  const startState = Immutable.fromJS({
    count: 0
  })

  const handlers = { one: (state, action) => state.set('count', 1) }
  const goodAction = {type: 'one'}
  const badAction = {type: 'two'}

  a.ok(reducer(startState, goodAction, handlers)
    .equals(Immutable.fromJS({count: 1})), 'handler state change is applied')

  a.equal(reducer(startState, badAction, handlers),
    startState, 'state is not changed')

  a.end()
})

/* selectors */
hh('(Selectors)')

test('should export selectors', (a) => {
  a.plan(1)
  a.equal(typeof selectors, 'object', 'is an object')
})

test('should export getSessionState', (a) => {
  a.plan(2)
  a.equal(typeof selectors.getSessionState, 'function', 'is an function')

  const startState = Immutable.fromJS({ [constants.STATE_PATH]: initialState })

  a.deepEqual(selectors.getSessionState(startState),
    startState.get(constants.STATE_PATH).toJS(),
    'gets test data from the initialState')
})

test('should export makeGetSession', (a) => {
  a.plan(3)
  a.equal(typeof selectors.makeGetSession, 'function', 'make is an function')

  const getSession = selectors.makeGetSession()

  a.equal(typeof getSession, 'function', 'get is a function')

  const startState = Immutable.fromJS({
    [constants.STATE_PATH]: {
      '1-1-1': { test: true },
      '2-2-2': { test: 'yes' }
    }
  })

  a.deepEqual(getSession(startState, {sessionID: '2-2-2'}), { test: 'yes' },
    'returns trial run')
})

/* sagas */
hh('(Sagas)')

test('should export a sagaMain', (a) => {
  a.plan(1)
  a.equal(typeof sagas.sagaMain, 'function', 'is a function')
})

test('should export util', (a) => {
  a.plan(1)
  a.equal(typeof sagas.util, 'object', 'is an object')
})

test('should export util arrayShuffle', (a) => {
  a.plan(2)
  a.equal(typeof sagas.util.arrayShuffle, 'function', 'is an function')

  const tmpArray = [1, 2, 3, 4, 5]
  const res1 = sagas.util.arrayShuffle(tmpArray).toString()
  const res2 = sagas.util.arrayShuffle(tmpArray).toString()
  const res3 = sagas.util.arrayShuffle(tmpArray).toString()
  const res4 = sagas.util.arrayShuffle(tmpArray).toString()
  const res5 = sagas.util.arrayShuffle(tmpArray).toString()

  a.ok(!(res1 === res2 === res3 === res4 === res5), 'arrays are not equal')
})

test('should export a errorHandler', (a) => {
  a.plan(1)
  a.equal(typeof sagas.errorHandler, 'function', 'is a function')
})

test('should export handlers', (a) => {
  a.plan(1)
  a.equal(typeof sagas.handlers, 'object', 'is an object')
})

test('should export a handler for KEY_CLICK', (a) => {
  a.equal(typeof sagas.handlers[constants.KEY_CLICK], 'object',
    'handler object exported')
  a.equal(typeof sagas.handlers[constants.KEY_CLICK].handler, 'function',
    'handler function exported')
  a.equal(typeof sagas.handlers[constants.KEY_CLICK].errorHandler, 'function',
    'errorHandler function exported')

  a.end()
})

test('should export a handler for START', (a) => {
  a.equal(typeof sagas.handlers[constants.START], 'object',
    'handler object exported')
  a.equal(typeof sagas.handlers[constants.START].handler, 'function',
    'handler function exported')
  a.equal(typeof sagas.handlers[constants.START].errorHandler, 'function',
    'errorHandler function exported')

  const { handler } = sagas.handlers[constants.START]
  const instance = handler()

  const value1 = instance.next().value
  a.deepEqual(value1, call(uuid), 'calls uuid')

  const value2 = instance.next().value
  a.deepEqual(value2, select(selectorsChoiceAs.getConditionsAndKeys),
    'handler yields select getConditionsAndKeys')

  const { conditions, keys } = fixtures.conditionsExample

  const dummyOrder = Object.keys(conditions)

  const value3 = instance.next(dummyOrder).value
  a.deepEqual(value3.CALL.fn, actions.creators.init,
    'call to actions.creators.init (args not checked)')

  const value4 = instance.next({type: 'DUMMY_TYPE', payload: 123}).value
  a.deepEqual(value4.PUT.action, {type: 'DUMMY_TYPE', payload: 123},
    'put action call')

  const value5 = instance.next().value
  a.deepEqual(value5.CALL.fn, routerPush,
    'call to routerPush (args not checked)')

  const value6 = instance.next({type: 'DUMMY_TYPE', payload: 123}).value
  a.deepEqual(value6.PUT.action, {type: 'DUMMY_TYPE', payload: 123},
    'put action call')

  a.ok(instance.next().done, 'handler is complete')

  a.end()
})
