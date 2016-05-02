/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'
import ChoiceAsTest from './ChoiceAsTest'
import ChoiceAsTrial from './ChoiceAsTrial'

// FlowType annotations
type Props = {
  debug: boolean,
  test: number
}

export const ChoiceAs = (props: Props) => (
  <div>
    <h1>Choice As!{props.debug ? ' Debug Mode' : ''}</h1>
    {
      props.test
      ? <ChoiceAsTest {...props} />
      : <ChoiceAsTrial />
    }
  </div>
)

ChoiceAs.propTypes = {
  debug: React.PropTypes.bool.isRequired,
  test: React.PropTypes.bool.isRequired
}

export default ChoiceAs
