import { st, sh } from '../../../../test_util'

import * as actionsDirect from 'routes/ChoiceAs/modules/choiceas/actions'
import {
  constants,
  actions
} from 'routes/ChoiceAs/modules/choiceas'

st('should export the actions from the actions file', (a) => {
  a.deepEqual(actions, actionsDirect, 'objects are equal')
})

sh('(Action Creator) testRun')

st('should be exported as a function', (a) => {
  a.equal(typeof actions.testRun, 'function', 'testRun is a function')
})
st('should return an action with type "TEST_RUN".', (a) => {
  a.equal(actions.testRun().type, constants.TEST_RUN, 'type set correctly')
})
st('should assign the first argument to the "payload" property', (a) => {
  a.equal(actions.testRun(5).payload, 5, 'payload set correctly')
})

sh('(Action Creator) keyClick')

st('should be exported as a function', (a) => {
  a.equal(typeof actions.keyClick, 'function', 'keyClick is a function')
})
st('should return an action with type "TEST_RUN".', (a) => {
  a.equal(actions.keyClick().type, constants.KEY_CLICK, 'type set correctly')
})
st('should assign the first argument to the "payload" property', (a) => {
  a.equal(actions.testRun(5).payload, 5, 'payload set correctly')
})
