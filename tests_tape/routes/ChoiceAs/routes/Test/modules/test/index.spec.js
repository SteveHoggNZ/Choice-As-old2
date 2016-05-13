import { h, hh, hhh, t, tt } from '../../../../../../test_util'
import test from 'blue-tape'
import Immutable from 'immutable'
import { call, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import config from 'config'
import { constants, actions, selectors, sagas, initialState, reducer }
  from 'routes/ChoiceAs/routes/Test/modules/test'
import { selectors as selectorsChoiceAs }
  from 'routes/ChoiceAs/modules/choiceas'

const fixtures = {
  conditionsExample: {
    conditions: config.conditions,
    keys: config.keys
  },
  jobsExample: [
    { name: 'condition 1, set 1', job: {L5: 0.5, R5: 0.5} },
    { name: 'condition 1, set 2', job: {L5: 0.5, R5: 0.5} },
    { name: 'condition 2, set 1', job: {L5: 0.5, R5: 0.5} },
    { name: 'condition 2, set 2', job: {L9: 0.9, R1: 0.1} },
    { name: 'condition 3, set 1', job: {L5: 0.5, R5: 0.5} },
    { name: 'condition 3, set 2', job: {L1: 0.1, R9: 0.9} }
  ]
}

h('(Redux Module) ChoiceAs/Test')

/* constants */
hh('(Constants)')

test('should export constants', (a) => {
  a.notEqual(constants.STATE_PATH, undefined, 'STATE_PATH is defined')
  a.notEqual(constants.PREFIX, undefined, 'PREFIX is defined')

  const required = [
    'ERROR',
    'RUN_REQUEST',
    'RUN_START',
    'RUN_RETURN'
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

test('should export runRequest action', (a) => {
  a.equal(typeof actions.creators.runRequest, 'function', 'is a function')

  a.deepEqual(actions.creators.runRequest(345),
    {type: constants.RUN_REQUEST, payload: 345},
    'action defined correctly')

  a.end()
})

test('should export runStart action', (a) => {
  a.equal(typeof actions.creators.runStart, 'function', 'is a function')

  a.deepEqual(actions.creators.runStart(),
    {type: constants.RUN_START},
    'action defined correctly')

  a.end()
})

test('should export runReturn action', (a) => {
  a.equal(typeof actions.creators.runReturn, 'function', 'is a function')

  a.deepEqual(actions.creators.runReturn({iterations: 10, jobs: 123}),
    {type: constants.RUN_RETURN, payload: {iterations: 10, jobs: 123}},
    'action defined correctly')

  a.end()
})

/* action handlers */
hhh('(Action Handlers)')

test('should export actions.handlers', (a) => {
  a.plan(1)
  a.equal(typeof actions.handlers, 'object', 'is and object')
})

test('should handle RUN_REQUEST', (a) => {
  a.plan(2)
  a.equal(typeof actions.handlers[constants.RUN_REQUEST], 'function',
    'handler function is defined')

  const state = Immutable.fromJS({iterations: 123})
  const action = {payload: 456}
  const output = actions.handlers[constants.RUN_REQUEST](state, action)

  a.ok(output.equals(Immutable.fromJS({iterations: 456})),
    'sets iterations to payload')
})

test('should handle RUN_START', (a) => {
  a.plan(2)
  a.equal(typeof actions.handlers[constants.RUN_START], 'function',
    'handler function is defined')

  const output = actions.handlers[constants.RUN_START](
    Immutable.fromJS({running: false})
  )
  a.ok(output.equals(Immutable.fromJS({running: true})),
    'sets running to true')
})

test('should handle RUN_RETURN', (a) => {
  a.plan(2)
  a.equal(typeof actions.handlers[constants.RUN_RETURN], 'function',
    'handler function is defined')

  const state = Immutable.fromJS({running: true, iterations: 1001, counts: 123})
  const action = {payload: 456}
  const output = actions.handlers[constants.RUN_RETURN](state, action)

  a.ok(output.equals(
    Immutable.fromJS({running: false, iterations: 1001, counts: 456})),
    'sets running and counts')
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

test('should export getTestResults', (a) => {
  a.plan(2)
  a.equal(typeof selectors.getTestResults, 'function', 'is an function')

  const startState = Immutable.fromJS({ [constants.STATE_PATH]: initialState })

  a.deepEqual(selectors.getTestResults(startState),
    startState.get(constants.STATE_PATH).toJS(),
    'gets test data from the initialState')
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

test('should export a errorHandler', (a) => {
  a.plan(1)
  a.equal(typeof sagas.errorHandler, 'function', 'is a function')
})

test('should export handlers', (a) => {
  a.plan(1)
  a.equal(typeof sagas.handlers, 'object', 'is an object')
})

test('should export a handler for RUN_REQUEST', (a) => {
  a.equal(typeof sagas.handlers[constants.RUN_REQUEST], 'object',
    'handler object exported')
  a.equal(typeof sagas.handlers[constants.RUN_REQUEST].handler, 'function',
    'handler function exported')
  a.equal(typeof sagas.handlers[constants.RUN_REQUEST].errorHandler, 'function',
    'errorHandler function exported')

  const { handler } = sagas.handlers[constants.RUN_REQUEST]
  const instance = handler({payload: 1})

  a.deepEqual(instance.next().value, call(actions.creators.runStart),
    'calls actions.creators.runStart')

  a.deepEqual(instance.next({}).value.PUT.action, {}, 'put action call')

  a.deepEqual(instance.next().value, call(delay, 1), 'call to delay')

  a.deepEqual(
    instance.next().value,
    select(selectorsChoiceAs.getConditionsAndKeys),
      'handler yields select getConditionsAndKeys')

  const { conditions, keys } = fixtures.conditionsExample

  a.deepEqual(
    instance.next({conditions, keys}).value.CALL.fn,
    actions.creators.runReturn,
    'call to actions.creators.runReturn (args not checked)')

  a.deepEqual(
    instance.next({type: 'DUMMY_TYPE', payload: 123}).value.PUT.action,
    {type: 'DUMMY_TYPE', payload: 123},
    'put action call')

  a.ok(instance.next().done, 'handler is complete')

  a.end()
})
