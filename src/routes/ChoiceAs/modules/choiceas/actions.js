/* @flow */
import * as constants from './constants'

export const testRun = (iterations: number): Action => {
  return {
    type: constants.TEST_RUN,
    payload: iterations
  }
}

export const keyClick = (keyID: number): Action => {
  return {
    type: constants.KEY_CLICK,
    payload: keyID
  }
}
