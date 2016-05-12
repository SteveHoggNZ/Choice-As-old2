/* @flow */
import Immutable from 'immutable'
import config from 'config'
import * as constants from './constants'

const ACTION_HANDLERS = {
  // [constants.KEY_CLICK]: (state: number, action: {payload: number}): number =>
  //   state + action.payload
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = Immutable.fromJS({
  entities: {
    conditions: config.conditions,
    keys: config.keys
  }
})
export default (
  state : number = initialState,
  action : Action
): number => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
