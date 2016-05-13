import Immutable from 'immutable'
import { createSelector } from 'reselect'
import uuid from 'uuid-v4'
import { push as routerPush } from 'react-router-redux'
import { call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import sagaUtil from 'util/sagas'
import {
  selectors as selectorsChoiceAs,
  util as utilChoiceAs
} from '../../../../modules/choiceas'

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
const TRIAL_UPDATE = `${PREFIX}TRIAL_UPDATE`

export const constants = {
  STATE_PATH, ROUTE_PATH, PREFIX, ERROR,
  START, INIT, STOP, LOG, KEY_CLICK, TRIAL_UPDATE
}

/* actions */
/* - action creators */
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

const keyClick = (sessionID: string, keyID: string): Action => {
  return {
    type: constants.KEY_CLICK,
    payload: {
      sessionID,
      keyID
    }
  }
}

const trialUpdate = (
  sessionID: string,
  keyStageID: number, trialCount: number,
  nextKeyStageID: number, nextTrialCount: number,
  record: string
): Action => {
  return {
    type: constants.TRIAL_UPDATE,
    payload: {
      sessionID,
      keyStageID,
      trialCount,
      nextKeyStageID,
      nextTrialCount,
      record
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
  keyClick,
  trialUpdate
}

/* - action handlers */
const ACTION_HANDLERS = {
  [constants.INIT]: (state: object, action: {payload: object}): object => {
    return state.set(action.payload.sessionID,
      Immutable.fromJS({
        conditionID: action.payload.conditionID,
        keyStageID: 0,
        trialCount: 0,
        trials: [],
        log: []
      }))
  },
  [constants.TRIAL_UPDATE]: (state: object, action: {payload: object}): object => {
    const {
      sessionID,
      keyStageID,
      trialCount,
      nextKeyStageID,
      nextTrialCount,
      record
    } = action.payload
    return state.withMutations((s) => {
      s.setIn([sessionID, 'keyStageID'], nextKeyStageID)
        .setIn([sessionID, 'trialCount'], nextTrialCount)

      s.updateIn([sessionID, 'trials', trialCount], (trial) => {
        return trial ? trial.push(record) : Immutable.fromJS([record])
      })

      return s
    })
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
  [constants.KEY_CLICK]: {
    require: {payload: {sessionID: '', keyID: ''}},
    handler: function * (action) {
      const {sessionID, keyID} = action.payload

      // *** TODO, cache this result somewhere?
      const getSession = selectors.makeGetSession()

      const session = yield select(getSession, {sessionID})

      yield put(actions.creators
        .log(sessionID, '-----------------------------------------------'))

      yield put(actions.creators
        .log(sessionID, `Key click ${keyID}`))

      const { conditions, keys } =
        yield select(selectorsChoiceAs.getConditionsAndKeys)

      const condition = conditions[session.conditionID]

      const { keyStageID, trialCount } = session

      const keyStage = condition.keys[session.keyStageID]

      const keyStageFull = keyStage
        .reduce((acc, key) => ({
          ...acc,
          [key]: keys[key].probability
        }), {})

      yield put(actions.creators
        .log(sessionID, `Trial: ${trialCount + 1},
          Stage: ${keyStageID + 1}, Possible Keys: ${keyStage.join(', ')}`))

      /* reinforcer can be L* R* STAY_* or SWITCH_* */
      const reinforcer = utilChoiceAs.weightedRandomSelect(keyStageFull)

      /* loop nextStageID around to 0 if we go past the end of the array */
      const nextKeyStageID = (keyStageID + 1) % condition.keys.length
      let nextTrialCount = nextKeyStageID === 0
        ? trialCount + 1 : trialCount

      let previousKey = 'none'
      /* reinforcerKey will be L* or R* */
      let reinforcerKey
      if (reinforcer.startsWith('STAY_')) {
        /* previousKey from the same trial but the previous stage */
        previousKey = session.trials[trialCount][keyStageID - 1].reinforcerKey
        reinforcerKey = previousKey
      } else if (reinforcer.startsWith('SWITCH_')) {
        /* previousKey from the same trial but the previous stage */
        previousKey = session.trials[trialCount][keyStageID - 1].reinforcerKey
        // get the first of the previous stage's keys that doesn't match
        // the previous key
        reinforcerKey = condition.keys[session.keyStageID - 1]
          .filter((id) => id !== previousKey)[0]
      } else {
        reinforcerKey = reinforcer
      }

      yield put(actions.creators.log(sessionID,
        `Reinforcer Location: ${reinforcerKey}
          ${reinforcer !== reinforcerKey ? ' (' + reinforcer + ')' : ''}`))

      const record = {reinforcer, reinforcerKey, previousKey}

      yield put(actions.creators.trialUpdate(
        sessionID,
        keyStage, trialCount,
        nextKeyStageID, nextTrialCount, record))
    },
    errorHandler: sagaErrorHandler
  },
  [constants.START]: {
    handler: function * (action) {
      const { conditionID } = action.payload
      const sessionID = yield call(uuid)

      const { conditions, keys } =
        yield select(selectorsChoiceAs.getConditionsAndKeys)

      yield put(yield call(actions.creators.init, conditionID, sessionID))

      yield put(actions.creators.log(sessionID,
        `Initalised Condition ${conditionID}, Session ${sessionID}`))

      /* flatmap array of arrays then convert into a string */
      const keyString = conditions[conditionID].keys
        .reduce((acc, v) =>
          [...acc, ...v.reduce((acc2, v2) => [...acc2, v2], [])], [])
            .join(', ')

      yield put(actions.creators.log(sessionID, `Condition key sequence: ${keyString}`))

      /* absolute path required to stop not-found route */
      yield put(yield call(routerPush, `/choiceas/${ROUTE_PATH}/${sessionID}`))
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
