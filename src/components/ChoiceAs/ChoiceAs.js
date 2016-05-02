/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'
import ChoiceKey from './ChoiceKey'

// FlowType annotations
type Props = {
  debug: boolean
}

export const ChoiceAs = (props: Props) => (
  <div>
    <h1>Choice As!{props.debug ? ' Debug Mode' : ''}</h1>
    <div className={classes.choiceContainer}>
      <ChoiceKey id='Left' />
      <ChoiceKey id='Right' />
    </div>
  </div>
)

ChoiceAs.propTypes = {
  debug: React.PropTypes.bool.isRequired
}

export default ChoiceAs
