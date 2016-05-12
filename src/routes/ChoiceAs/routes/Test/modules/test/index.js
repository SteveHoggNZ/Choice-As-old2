import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import sagaUtil from 'util/sagas'
import {
  selectors as selectorsChoiceAs,
  util as utilChoiceAs
} from '../../../../modules/choiceas'

/* constants */
const STATE_PATH = 'test'

const PREFIX = 'choiceas/test/'

const ERROR = `${PREFIX}ERROR`

const RUN_REQUEST = `${PREFIX}RUN_REQUEST`
const RUN_START = `${PREFIX}RUN_START`
const RUN_RETURN = `${PREFIX}RUN_STOP`

export const constants = {
  STATE_PATH, PREFIX, ERROR, RUN_REQUEST, RUN_START, RUN_RETURN
}

/* actions */
/* - action creators */
const runRequest = (iterations: number): Action => {
  return {
    type: constants.RUN_REQUEST,
    payload: iterations
  }
}

const runStart = () => {
  return {
    type: constants.RUN_START
  }
}

const runReturn = (result: object): Action => {
  return {
    type: constants.RUN_RETURN,
    payload: result
  }
}

const ACTION_CREATORS = {
  runRequest,
  runStart,
  runReturn
}

/* - action handlers */
const ACTION_HANDLERS = {
  [constants.RUN_START]: (state: object, action: {payload: object}): object =>
    state.set('running', true),
  [constants.RUN_RETURN]: (state: object, action: {payload: object}): object =>
    state.withMutations(
      (s) => s.set('running', false)
        .set('jobs', action.payload.jobs))
}

export const actions = {
  creators: ACTION_CREATORS,
  handlers: ACTION_HANDLERS
}

/* reducer */
export const initialState = Immutable.fromJS({
  running: false,
  lastrun: undefined,
  iterations: 1000000,
  jobs: []
})
export const reducer = (
  state : number = initialState,
  action : Action,
  handlers : object = actions.handlers
): number => {
  const handler = handlers[action.type]

  return handler ? handler(state, action) : state
}

/* selectors */
const _getTestResults = (state) => {
  return state.getIn([constants.STATE_PATH])
}

const getTestResults = createSelector(
  _getTestResults,
  (_result) => _result.toJS()
)

export const selectors = {
  getTestResults
}

/* sagas */
const sagaErrorHandler = (error) => {
  return {
    type: constants.ERROR,
    payload: new Error(error)
  }
}

const SAGA_UTIL = {
  buildTestJobs: (conditions, keys) => {
    let actionJobs = []

    for (let conditionID of Object.keys(conditions)) {
      const condition = conditions[conditionID]
      for (let i = 0; i < condition.keys.length; i++) {
        let job = {}
        for (let j = 0; j < condition.keys[i].length; j++) {
          const keyID = condition.keys[i][j]
          job = { ...job, [keyID]: keys[keyID].probability }
        }
        actionJobs = [
          ...actionJobs,
          {
            name: `${condition.name}, set ${i + 1}`,
            job
          }
        ]
      }
    }

    return actionJobs
  }
}

const SAGA_HANDLERS = {
  [constants.RUN_REQUEST]: {
    handler: function * (action) {
      yield put(yield call(actions.creators.runStart))

      /*
        yield a delay to allow state change to propagate
        i.e. running the jobs is a busy wait that causes new state
        to be not picked-up on.
      */
      yield call(delay, 1)

      const { conditions, keys } =
        yield select(selectorsChoiceAs.getConditionsAndKeys)

      const actionJobs = yield call(SAGA_UTIL.buildTestJobs, conditions, keys)

      const iterations = action.payload || 1000

      let results = {
        iterations,
        jobs: []
      }
      for (let {job, name} of actionJobs) {
        // an object to record counts with each job key initialised to 0
        let testCounts = Object.keys(job)
          .reduce((acc, key) => {
            return {
              ...acc,
              [key]: 0
            }
          }, {})

        for (let i = 0; i < iterations; i++) {
          // increment the counter for the key that is returned
          testCounts[utilChoiceAs.weightedRandomSelect(job)]++
        }

        results.jobs = [
          ...results.jobs,
          {name, result: testCounts}
        ]
      }

      yield put(yield call(actions.creators.runReturn, results))
    },
    errorHandler: sagaErrorHandler
  }
}

const sagaMain = sagaUtil.makeSagaMain({handlers: SAGA_HANDLERS})

export const sagas = {
  errorHandler: sagaErrorHandler,
  util: SAGA_UTIL,
  handlers: SAGA_HANDLERS,
  sagaMain
}

export default reducer
