/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'

const ChoiceAsTestResult = (props: Props) => (
  <li className={classes.testResultsContainer}>
    <div>{props.name}</div>
    {Object.keys(props.keys).map((key) =>
      <div key={key}>
        {key}: {props.keys[key].toLocaleString()} / {' '}
          {props.iterations.toLocaleString()} = {' '}
          {(props.keys[key] / props.iterations)
            .toFixed(props.iterations.toString().length)}
      </div>)}
  </li>
)

export const ChoiceAsTest = (props: Props) => (
  <div>
    <h4>Test #1: Running this test will loop through each condition{' '}
    {props.results.iterations.toLocaleString()} times and record{' '}
    where the re-enforcer is. This should match the requested probability.</h4>
    <button onClick={props.run} disabled={props.results.running}>
      {props.results.running ? 'Running ...' : 'Run Test'}
    </button>
    <br /><br />
    {!props.results.running && props.results &&
      props.results && props.results.jobs &&
      <ul> {
        props.results.jobs.map((j) =>
          <ChoiceAsTestResult key={j.name} name={j.name}
            keys={j.result} iterations={props.results.iterations} />)
      } </ul>
    }
  </div>
)

ChoiceAsTest.propTypes = {
  run: React.PropTypes.func.isRequired,
  results: React.PropTypes.object.isRequired
}

export default ChoiceAsTest
