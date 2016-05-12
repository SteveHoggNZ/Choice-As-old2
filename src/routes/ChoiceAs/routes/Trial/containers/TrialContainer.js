import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { constants, actions, selectors } from '../modules/trial'
import { selectors as selectorsChoiceAs } from '../../../modules/choiceas'

import ChoiceAsTrial from 'components/ChoiceAs/ChoiceAsTrial'

const makeMapStateToProps = () => {
  /*
    creates private copy of getTrialRun for each runID
    https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
  */
  const getTrialRun = selectors.makeGetTrialRun()
  return (state, ownProps) => {
    const runIDMatcher = new RegExp(`/${constants.ROUTE_PATH}/(.+)`)
    const runIDMatches = ownProps && ownProps.location &&
      ownProps.location.pathname &&
      ownProps.location.pathname.match(runIDMatcher) || []
    const runID = runIDMatches[1] || undefined

    return {
      runID,
      trialState: selectors.getTrialState(state, {test: true}), // *** TODO, remove ***
      trialRun: getTrialRun(state, {runID})
    }
  }
}

// const mapStateToProps = (state, ownProps) => {
//   const runIDMatcher = new RegExp(`/${constants.ROUTE_PATH}/(.+)`)
//   const runIDMatches = ownProps && ownProps.location &&
//     ownProps.location.pathname &&
//     ownProps.location.pathname.match(runIDMatcher) || []
//
//   return {
//     runID: runIDMatches[1] || undefined,
//     trialState: selectors.getTrialState(state, {test: true})
//   }
// }

const mapActionCreators = (dispatch) => ({
  startClick: bindActionCreators(actions.creators.start, dispatch),
  keyClick: bindActionCreators(actions.creators.keyClick, dispatch)
})

export default connect(makeMapStateToProps, mapActionCreators)(ChoiceAsTrial)
