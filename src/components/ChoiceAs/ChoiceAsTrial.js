/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'
import ChoiceKey from './ChoiceKey'

export const ChoiceAsTrial = (props: Props) => {
  const startTrialHandler = () => {
    props.startClick()
  }

  const infoClickHandle = () => {
    console.warn('trial run', props.trialRun)
    console.warn('valid id?', props.trialState.run[props.runID] !== undefined)
  }

  const buildLog = () => {
    if (props.trialRun && props.trialRun.log) {
      let i = 0
      return props.trialRun.log
        .map((v) => <li key={i++}>{v}</li>)
    }
  }

  return <div>
    {!props.runID && <button onClick={startTrialHandler}>Start Trial</button>}
    {props.runID &&
      <div className={classes.choiceContainer} onClick={infoClickHandle}>
        <ChoiceKey id='L1' runID={props.runID} keyClick={props.keyClick} />
        <ChoiceKey id='R1' runID={props.runID} keyClick={props.keyClick} />
      </div>}
    <br />
    <ul className={classes.choiceLog}>{buildLog()}</ul>
  </div>
}

ChoiceAsTrial.propTypes = {
  runID: React.PropTypes.string,
  trialState: React.PropTypes.object.isRequired,
  trialRun: React.PropTypes.object,
  startClick: React.PropTypes.func.isRequired,
  keyClick: React.PropTypes.func.isRequired
}

export default ChoiceAsTrial
