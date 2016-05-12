/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'

// FlowType annotations
type Props = {
  id: string
}

export const ChoiceKey = (props: Props) => {
  const keyClickHandler = () => {
    props.keyClick(props.runID, props.id)
  }

  return <div className={classes.choiceKey}
    onClick={keyClickHandler}>Choice Key {props.id}</div>
}

ChoiceKey.propTypes = {
  id: React.PropTypes.string.isRequired,
  runID: React.PropTypes.string.isRequired,
  keyClick: React.PropTypes.func.isRequired
  // isChoice: React.PropTypes.boolean.isRequired
  // counter: React.PropTypes.number.isRequired,
  // doubleAsync: React.PropTypes.func.isRequired,
  // increment: React.PropTypes.func.isRequired
}

export default ChoiceKey
