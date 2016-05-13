/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'
import ChoiceKey from './ChoiceKey'

const ChoiceAsSessionButton = (props: Props) => {
  const startSessionHandler = () => {
    props.startClick(props.conditionID)
  }

  return <button onClick={startSessionHandler}>
    Start Session {props.conditionName}
  </button>
}

ChoiceAsSessionButton.propTypes = {
  conditionID: React.PropTypes.string.isRequired,
  conditionName: React.PropTypes.string.isRequired,
  startClick: React.PropTypes.func.isRequired
}

export const ChoiceAsSession = (props: Props) => {
  const infoClickHandle = () => {
    console.warn('valid id?', props.session !== undefined)
  }

  const buildLog = () => {
    if (props.session && props.session.log) {
      let i = 0
      return props.session.log
        .map((v) => <li key={i++}>{props.session.log.length + 1 - i} {v}</li>)
    }
  }

  return <div>
    {!props.sessionID &&
      <div>
        <ChoiceAsSessionButton startClick={props.startClick}
          conditionID='C1' conditionName='Condition 1' />
        <ChoiceAsSessionButton startClick={props.startClick}
          conditionID='C2' conditionName='Condition 2' />
        <ChoiceAsSessionButton startClick={props.startClick}
          conditionID='C3' conditionName='Condition 3' />
      </div>}
    {props.sessionID &&
      <div className={classes.choiceContainer} onClick={infoClickHandle}>
        <ChoiceKey id='L1' sessionID={props.sessionID} keyClick={props.keyClick} />
        <ChoiceKey id='R1' sessionID={props.sessionID} keyClick={props.keyClick} />
      </div>}
    <br />
    <ul className={classes.choiceLog}>{buildLog()}</ul>
  </div>
}

ChoiceAsSession.propTypes = {
  sessionID: React.PropTypes.string,
  // sessionState: React.PropTypes.object.isRequired,
  session: React.PropTypes.object,
  startClick: React.PropTypes.func.isRequired,
  keyClick: React.PropTypes.func.isRequired
}

export default ChoiceAsSession
