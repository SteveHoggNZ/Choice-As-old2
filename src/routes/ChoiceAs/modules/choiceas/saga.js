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

export function * monitorTestRuns () {
  yield * takeEvery(constants.TEST_RUN, testRun)
}

export default function * () {
  yield [
    fork(monitorTestRuns)
  ]
}
