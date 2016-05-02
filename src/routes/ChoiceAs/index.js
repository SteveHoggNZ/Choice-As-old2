import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'choiceas',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const ChoiceAs = require('./containers/ChoiceAsContainer').default
      const reducer = require('./modules/choiceas/reducer').default

      /*  Add the reducer to the store on key 'choiceas'  */
      injectReducer(store, { key: 'choiceas', reducer })

      /*  Return getComponent   */
      cb(null, ChoiceAs)
    /* Webpack named bundle   */
    }, 'choiceas')
  },
  childRoutes: [
    { path: 'debug' }
  ]
})
