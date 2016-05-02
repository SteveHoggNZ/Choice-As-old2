/* @flow */
import Immutable from 'immutable'
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
    conditions: {
      1: {
        name: 'Condition 1',
        keys: [
          ['l5', 'r5'],
          ['l1', 'r9']
        ]
      },
      2: {
        name: 'Condition 2',
        keys: [
          ['l5', 'r5'],
          ['l5', 'r5']
        ]
      },
      3: {
        name: 'Condition 3',
        keys: [
          ['l5', 'r5'],
          ['l9', 'r1']
        ]
      }
    },
    keys: {
      l5: {
        name: 'left',
        probability: 0.5
      },
      l1: {
        name: 'left',
        probability: 0.1
      },
      l9: {
        name: 'left',
        probability: 0.9
      },
      r5: {
        name: 'right',
        probability: 0.5
      },
      r1: {
        name: 'right',
        probability: 0.1
      },
      r9: {
        name: 'right',
        probability: 0.9
      }
    }
  }
})
export default (
  state : number = initialState,
  action : Action
): number => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
