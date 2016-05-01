/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'

// FlowType annotations
type Props = {
  id: string
}

export const ChoiceKey = (props: Props) => (
  <div className={classes.choiceKey}>Choice Key {props.id}</div>
)

ChoiceKey.propTypes = {
  id: React.PropTypes.string.isRequired
  // isChoice: React.PropTypes.boolean.isRequired
  // counter: React.PropTypes.number.isRequired,
  // doubleAsync: React.PropTypes.func.isRequired,
  // increment: React.PropTypes.func.isRequired
}

export default ChoiceKey
