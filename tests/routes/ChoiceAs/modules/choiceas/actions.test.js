import * as actionsDirect from 'routes/ChoiceAs/modules/choiceas/actions'
import {
  constants,
  actions
} from 'routes/ChoiceAs/modules/choiceas'

it('Should export the actions from the actions file', () => {
  expect(actions).to.deep.equal(actionsDirect, 'objects are equal')
})

describe('(Action Creator) keyClick', () => {
  it('Should be exported as a function.', () => {
    expect(actions.keyClick).to.be.a('function')
  })
  it('Should return an action with type "KEY_CLICK".', () => {
    expect(actions.keyClick()).to.have.property('type', constants.KEY_CLICK)
  })
  it('Should assign the first argument to the "payload" property.', () => {
    expect(actions.keyClick(5)).to.have.property('payload', 5)
  })
})
