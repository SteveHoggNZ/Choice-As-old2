/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'
import ChoiceKey from './ChoiceKey'

// FlowType annotations
type Props = {
  // isChoice: boolean
  // counter: number,
  // doubleAsync: Function,
  // increment: Function
}

export const ChoiceAs = (props: Props) => (
  <div>
    <h1>Choice As!</h1>
    <div className={classes.choiceContainer}>
      <ChoiceKey id='Left' />
      <ChoiceKey id='Right' />
    </div>
  </div>
)

ChoiceAs.propTypes = {
  // isChoice: React.PropTypes.boolean.isRequired
  // counter: React.PropTypes.number.isRequired,
  // doubleAsync: React.PropTypes.func.isRequired,
  // increment: React.PropTypes.func.isRequired
}

export default ChoiceAs
