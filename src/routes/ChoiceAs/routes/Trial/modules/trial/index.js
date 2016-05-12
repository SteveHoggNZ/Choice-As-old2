import Immutable from 'immutable'
import { createSelector } from 'reselect'
import uuid from 'uuid-v4'
import { push as routerPush } from 'react-router-redux'
import { call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import sagaUtil from 'util/sagas'
import { selectors as selectorsChoiceAs } from '../../../../modules/choiceas'

/* constants */
const STATE_PATH = 'trial'
const ROUTE_PATH = STATE_PATH

const PREFIX = 'choiceas/trial/'

const ERROR = `${PREFIX}ERROR`

const START = `${PREFIX}START`
const INIT = `${PREFIX}INIT`
const STOP = `${PREFIX}STOP`
const LOG = `${PREFIX}LOG`
const KEY_CLICK = `${PREFIX}KEY_CLICK`

export const constants = {
  STATE_PATH, ROUTE_PATH, PREFIX, ERROR, START, INIT, STOP, LOG, KEY_CLICK
}

/* actions */
/* - action creators */
const keyClick = (runID: string, keyID: string): Action => {
  return {
    type: constants.KEY_CLICK,
    payload: {
      runID,
      keyID
    }
  }
}

const start = (): Action => {
  return {
    type: constants.START
  }
}

const init = ({runID, runOrder}): Action => {
  return {
    type: constants.INIT,
    payload: {
      runID,
      runOrder
    }
  }
}

const stop = (): Action => {
  return {
    type: constants.STOP
  }
}

const log = (runID: string, msg: string): Action => {
  return {
    type: constants.LOG,
    payload: {
      runID,
      msg
    }
  }
}

const ACTION_CREATORS = {
  start,
  init,
  stop,
  log,
  keyClick
}

/* - action handlers */
const ACTION_HANDLERS = {
  [constants.INIT]: (state: object, action: {payload: object}): object => {
    return state.setIn(['run', action.payload.runID],
      Immutable.fromJS({
        runOrder: action.payload.runOrder,
        cursor: [action.payload.runOrder[0], 0],
        count: 0,
        log: []
      }))
  },
  [constants.LOG]: (state: object, action: {payload: object}): object => {
    return state.updateIn(['run', action.payload.runID, 'log'], (val) =>
      val.unshift(action.payload.msg))
      /* unshift = newest to the top of the list*/
  }
}

export const actions = {
  creators: ACTION_CREATORS,
  handlers: ACTION_HANDLERS
}

/* reducer */
export const initialState = Immutable.fromJS({
  run: {}
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
const _getTrialState = (state, props) => {
  console.warn('got props in selector', props)
  return state.getIn([constants.STATE_PATH])
}

const getTrialState = createSelector(
  _getTrialState,
  (_result) => _result.toJS()
)

const _getTrialRun = (state, props) => {
  console.warn('getting trial run')
  return state.getIn([constants.STATE_PATH, 'run', props.runID]) || undefined
}

const makeGetTrialRun = () => createSelector(
  [ _getTrialRun ],
  (trialRun) => {
    console.error('really getting trial run')
    return trialRun && trialRun.toJS()
  }
)

export const selectors = {
  // *** TODO, remove getTrialState
  getTrialState,
  makeGetTrialRun
}

/* sagas */
const sagaErrorHandler = (error) => {
  return {
    type: constants.ERROR,
    payload: new Error(error)
  }
}

const SAGA_UTIL = {
  arrayShuffle: (array) => {
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }
}

const SAGA_HANDLERS = {
  [constants.START]: {
    handler: function * (action) {
      const runID = yield call(uuid)

      const { conditions, keys } =
        yield select(selectorsChoiceAs.getConditionsAndKeys)

      const runOrder =
        yield call(SAGA_UTIL.arrayShuffle, Object.keys(conditions))

      yield put(yield call(actions.creators.init, {runID, runOrder}))

      yield put(actions.creators.log(runID, `initalised new run ${runID}`))
      yield put(actions.creators.log(runID,
        `run order randomised to ${runOrder.join(', ')}`))
      yield put(actions.creators.log(runID, `starting ${runOrder[0]}, set 1`))

      /* absolute path required to stop not-found route */
      yield put(yield call(routerPush, `/choiceas/${ROUTE_PATH}/${runID}`))

      console.log('runID', runID, conditions, runOrder)
    },
    errorHandler: sagaErrorHandler
  },
  [constants.KEY_CLICK]: {
    require: {payload: {runID: '', keyID: ''}},
    handler: function * (action) {
      const {runID, keyID} = action.payload
      yield put(actions.creators.log(runID, `key click ${keyID}`))
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
