import { injectReducer } from 'store/reducers'
import { startSaga } from 'store/sagas'

export default (store) => ({
  path: 'trial',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Trial = require('./containers/TrialContainer').default
      const { reducer, sagas } = require('./modules/trial')

      /*  Add the reducer to the store on key 'choiceas'  */
      injectReducer(store, { key: 'trial', reducer })

      /*  Start running the Saga  */
      startSaga(store, { key: 'trial', saga: sagas.sagaMain })

      /*  Return getComponent   */
      cb(null, Trial)
    /* Webpack named bundle   */
    }, 'choiceas-trial')
  },
  childRoutes: [ { path: '*' } ]
})
