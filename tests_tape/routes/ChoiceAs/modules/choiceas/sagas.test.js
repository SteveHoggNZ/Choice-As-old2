import { t } from '../../../../test_util'
import { select } from 'redux-saga/effects'
import { constants, selectors, sagas } from 'routes/ChoiceAs/modules/choiceas'
// import { expandedLog, deepDiffMapper } from 'util/debug/tools'

t('should export a function errorHandler', (a) => {
  a.equal(typeof sagas.errorHandler, 'function', 'function exported')

  a.deepEqual(sagas.errorHandler('test error'),
    {type: constants.ERROR, payload: new Error('test error')})

  a.end()
})

t('should export handlers object', (a) => {
  a.plan(1)
  a.equal(typeof sagas.handlers, 'object', 'handlers object exported')
})

t('should export a handler for TEST_RUN', (a) => {
  a.equal(typeof sagas.handlers[constants.TEST_RUN], 'object',
    'handler object exported')
  a.equal(typeof sagas.handlers[constants.TEST_RUN].handler, 'function',
    'handler function exported')
  a.equal(typeof sagas.handlers[constants.TEST_RUN].errorHandler, 'function',
    'errorHandler function exported')

  const { handler } = sagas.handlers[constants.TEST_RUN]
  const instance = handler()
  a.deepEqual(
    instance.next().value,
    select(selectors.getConditionsAndKeys),
    'handler yields select getConditionsAndKeys')

  a.equal(
    instance.next({conditions: 1, keys: 2}).value,
    22,
    'handler yields 22')

  a.ok(instance.next().done, 'handler is complete')

  a.end()
})
