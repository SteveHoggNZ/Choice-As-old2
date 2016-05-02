import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from '../modules/choiceas'

import ChoiceAs from 'components/ChoiceAs'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

console.log('actions', actions.testRun)

const mapActionCreators = {
  testRun: () => actions.testRun(100)
}

const mapStateToProps = (state, ownProps) => ({
  debug: ownProps && ownProps.location && ownProps.location.pathname &&
    ownProps.location.pathname.endsWith('/debug') || false,
  test: ownProps && ownProps.location && ownProps.location.pathname &&
    ownProps.location.pathname.endsWith('/test') || false
})

/*  Note: mapStateToProps is where you should use `reselect` to create selectors, ie:

    import { createSelector } from 'reselect'
    const counter = (state) => state.counter
    const tripleCount = createSelector(counter, (count) => count * 3)
    const mapStateToProps = (state) => ({
      counter: tripleCount(state)
    })

    Selectors can compute derived data, allowing Redux to store the minimal possible state.
    Selectors are efficient. A selector is not recomputed unless one of its arguments change.
    Selectors are composable. They can be used as input to other selectors.
    https://github.com/reactjs/reselect    */

export default connect(mapStateToProps, mapActionCreators)(ChoiceAs)
