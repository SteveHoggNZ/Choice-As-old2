/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'
import ChoiceKey from './ChoiceKey'

export const ChoiceAsTrial = (props: Props) => (
  <div className={classes.choiceContainer}>
    <ChoiceKey id='Left' />
    <ChoiceKey id='Right' />
  </div>
)

ChoiceAsTrial.propTypes = {}

export default ChoiceAsTrial
