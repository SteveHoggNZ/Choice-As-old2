/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'

// FlowType annotations
type Props = {
  id: string
}

export const ChoiceKey = (props: Props) => {
  const keyClickHandler = () => {
    if (!props.session || props.session.locked === false) {
      props.keyClick(props.sessionID, props.id)
    }
  }

  return <div className={classes.choiceKey}
    onClick={keyClickHandler}>
    Choice Key {props.id}
    {props.wasClicked && <div><br /><b>Was clicked</b></div>}
    {props.hasReinforcer && <div><br /><b>Has reinforcer</b></div>}
    {props.reveal && <div><br /><b>Revealed</b></div>}
  </div>
}

ChoiceKey.propTypes = {
  id: React.PropTypes.string.isRequired,
  sessionID: React.PropTypes.string.isRequired,
  session: React.PropTypes.object,
  wasClicked: React.PropTypes.bool,
  hasReinforcer: React.PropTypes.bool,
  reveal: React.PropTypes.bool,
  keyClick: React.PropTypes.func.isRequired
}

export default ChoiceKey
