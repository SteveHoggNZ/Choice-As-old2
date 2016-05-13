import Immutable from 'immutable'
import { createSelector } from 'reselect'
import uuid from 'uuid-v4'
import { push as routerPush } from 'react-router-redux'
import { call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import sagaUtil from 'util/sagas'
import { selectors as selectorsChoiceAs } from '../../../../modules/choiceas'

/* constants */
const STATE_PATH = 'session'
const ROUTE_PATH = STATE_PATH

const PREFIX = 'choiceas/session/'

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
const keyClick = (sessionID: string, keyID: string): Action => {
  return {
    type: constants.KEY_CLICK,
    payload: {
      sessionID,
      keyID
    }
  }
}

const start = (conditionID: string): Action => {
  return {
    type: constants.START,
    payload: {
      conditionID
    }
  }
}

const init = (conditionID: string, sessionID: string): Action => {
  return {
    type: constants.INIT,
    payload: {
      conditionID,
      sessionID
    }
  }
}

const stop = (): Action => {
  return {
    type: constants.STOP
  }
}

const log = (sessionID: string, msg: string): Action => {
  return {
    type: constants.LOG,
    payload: {
      sessionID,
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
    return state.set(action.payload.sessionID,
      Immutable.fromJS({
        conditionID: action.payload.conditionID,
        // runOrder: action.payload.runOrder,
        // cursor: [action.payload.runOrder[0], 0],
        trialCount: 0,
        log: []
      }))
  },
  [constants.LOG]: (state: object, action: {payload: object}): object => {
    return state.updateIn([action.payload.sessionID, 'log'], (val) =>
      val.unshift(action.payload.msg)) /* unshift, newest item to the top */
  }
}

export const actions = {
  creators: ACTION_CREATORS,
  handlers: ACTION_HANDLERS
}

/* reducer */
export const initialState = Immutable.fromJS({})
export const reducer = (
  state : number = initialState,
  action : Action,
  handlers : object = actions.handlers
): number => {
  const handler = handlers[action.type]

  return handler ? handler(state, action) : state
}

/* selectors */
const _getSessionState = (state, props) => {
  console.warn('got props in selector', props)
  return state.getIn([constants.STATE_PATH])
}

const getSessionState = createSelector(
  _getSessionState,
  (_result) => _result.toJS()
)

const _getSession = (state, props) => {
  console.warn('getting session')
  return state.getIn([constants.STATE_PATH, props.sessionID]) || undefined
}

const makeGetSession = () => createSelector(
  /* this isn't working so great at the moment; error is called below */
  [ _getSession ],
  (session) => {
    console.error('really getting session')
    return session && session.toJS()
  }
)

export const selectors = {
  // *** TODO, remove getSessionState
  getSessionState,
  makeGetSession
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
      const { conditionID } = action.payload
      const sessionID = yield call(uuid)

      const { conditions, keys } =
        yield select(selectorsChoiceAs.getConditionsAndKeys)

      yield put(yield call(actions.creators.init, conditionID, sessionID))

      yield put(actions.creators.log(sessionID, `initalised new session ${sessionID}`))

      /* absolute path required to stop not-found route */
      yield put(yield call(routerPush, `/choiceas/${ROUTE_PATH}/${sessionID}`))

      console.log('sessionID', sessionID, conditions)
    },
    errorHandler: sagaErrorHandler
  },
  [constants.KEY_CLICK]: {
    require: {payload: {sessionID: '', keyID: ''}},
    handler: function * (action) {
      const {sessionID, keyID} = action.payload
      yield put(actions.creators.log(sessionID, `key click ${keyID}`))
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
