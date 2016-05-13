/* @flow */
import React from 'react'
import classes from './ChoiceAs.scss'

const ChoiceAsTestResult = ({conditionID, counts, iterations}: Props) => {
  let uniqueID = 0

  // counts are an array of objects, so we need nested loops
  return <div className={classes.testResultsContainer}>
    <br /><div>{conditionID}</div><br />
    {counts.map((count) => (
      <div key={uniqueID++}>
      {Object.keys(count).map((keyID) => (
        <div key={uniqueID++}>{keyID}: {count[keyID]} / {iterations} = {' '}
          {(count[keyID] / iterations)
            .toFixed(iterations.toString().length)} {' '}</div>
      ))}
      </div>
    ))}
  </div>
}

export const ChoiceAsTest = ({run, results}: Props) => (
  <div>
    <h4>Test #1: Running this test will loop through each condition{' '}
    multiple times and record where the re-enforcer is. This should match{' '}
    the requested probability.</h4>
    <button onClick={run} disabled={results.running}>
      {results.running ? 'Running ...' : 'Run Test'}
    </button>
    <br /><br />
    {!results.running && results.counts &&
      (Object.keys(results.counts).length > 0) &&
      <div>
        <h5>Results for {results.iterations.toLocaleString()} iterations</h5>
        <div> {
          Object.keys(results.counts).map((conditionID) =>
            <ChoiceAsTestResult key={conditionID} conditionID={conditionID}
              counts={results.counts[conditionID]}
              iterations={results.iterations} />
          )
        } </div>
      </div>
    }
  </div>
)

ChoiceAsTest.propTypes = {
  run: React.PropTypes.func.isRequired,
  results: React.PropTypes.object.isRequired
}

export default ChoiceAsTest
