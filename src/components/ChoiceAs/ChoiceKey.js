/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'

// FlowType annotations
type Props = {
  id: string
}

export const ChoiceKey = (props: Props) => {
  const keyClickHandler = () => {
    props.keyClick(props.sessionID, props.id)
  }

  return <div className={classes.choiceKey}
    onClick={keyClickHandler}>Choice Key {props.id}</div>
}

ChoiceKey.propTypes = {
  id: React.PropTypes.string.isRequired,
  sessionID: React.PropTypes.string.isRequired,
  keyClick: React.PropTypes.func.isRequired
}

export default ChoiceKey
