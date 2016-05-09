/* @flow */
import { takeEvery } from 'redux-saga'
import { call, put, fork, select } from 'redux-saga/effects'
import * as constants from './constants'
// import * as actions from './actions'
import * as selectors from './selectors'

export function * testRun (action) {
  const { conditions, keys } = yield select(selectors.getConditionsAndKeys)

  yield call(console.log, ['Got state', conditions, keys])
  // try {
  //   if (!action || !action.payload || !action.payload.todolistid) {
  //     throw new Error('Expected argument todolistid in action.payload')
  //   } else if (!action || !action.payload || !action.payload.todoid) {
  //     throw new Error('Expected argument todoid in action.payload')
  //   }
  //
  //   const { todolistid, todoid } = action.payload
  //
  //   const confirmed = yield call(confirm, 'Are you sure you want to delete?')
  //
  //   if (confirmed) {
  //     yield put(todoDeleteRequest(todolistid, todoid))
  //
  //     yield call(collecto.deleteItem, { itemID: todoid })
  //
  //     yield put(todoDeleteReceive(todolistid, todoid))
  //   }
  // } catch (error) {
  //   // console.warn('Failed to delete to do', error)
  //   yield put(todoDeleteFail(error.toString()))
  // }
}

export const checkRequire = (require, action, actionpath = []) => {
  const formatpath = (p1, p2) => p1.length === 0 ? p2 : `${p1.join('.')}.${p2}`
  for (let key of Object.keys(require)) {
    if (!action[key]) {
      throw new Error(`expected action.${formatpath(actionpath, key)} to exist`)
    }

    if (require[key] instanceof RegExp && !action[key].match(require[key])) {
      throw new Error(`expected action.${formatpath(actionpath, key)} ` +
        `to match ${require[key].toString()}`)
    } else if (typeof require[key] === 'object') {
      checkRequire(require[key], action[key], [...actionpath, key])
    }
  }
}

export const wrapHandler = ({
  handler, errorHandler, require, checker = checkRequire
}) =>
  function * wrappedHandler (action) {
    try {
      if (require) {
        checker(require, action)
      }

      yield * handler(action)
    } catch (error) {
      console.error('got wrapped error', error)
      yield put(errorHandler(error.toString()))
    }
  }

export const errorHandler = (error) => {
  return {
    type: constants.ERROR,
    payload: new Error(error)
  }
}

export const handlers = {
  [constants.TEST_RUN]: {
    // require: {payload: {steve: ''}},
    handler: function * (action) {
      const { conditions, keys } = yield select(selectors.getConditionsAndKeys)
      console.log('called test_run')
      console.log(conditions, keys)

      // yield call(console.log, ['Got state', conditions, keys])
      yield 22
      // yield call(console.log, 'running handler')
    },
    errorHandler
  }
}

export default function * ({hldrs = handlers, wrapper = wrapHandler} = {}) {
  // fork a monitor for each defined handler
  const makeMonitor = (name) =>
    function * () {
      yield * takeEvery(name, wrapper({...hldrs[name]}))
    }

  const forks = Object.keys(hldrs)
    .map((name) => fork(makeMonitor(name)))

  yield forks
}
