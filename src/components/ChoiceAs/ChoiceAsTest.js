/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'

export const ChoiceAsTest = (props: Props) => (
  <div className={classes.choiceContainer}>
    This is a test
    <a onClick={props.testRun}>Click to run test</a>
  </div>
)

ChoiceAsTest.propTypes = {
  testRun: React.PropTypes.func.isRequired
}

export default ChoiceAsTest
