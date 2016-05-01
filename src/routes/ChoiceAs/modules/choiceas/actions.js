/* @flow */
import * as constants from './constants'

export const keyClick = (keyID: number): Action => {
  return {
    type: constants.KEY_CLICK,
    payload: keyID
  }
}
