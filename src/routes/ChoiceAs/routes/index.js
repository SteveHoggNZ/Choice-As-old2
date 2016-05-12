import TrialRoute from './Trial'
import TestRoute from './Test'

/* export child routes */
export default (store) => [
  { path: 'debug' },
  TrialRoute(store),
  TestRoute(store)
]
