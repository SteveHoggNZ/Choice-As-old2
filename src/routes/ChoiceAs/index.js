import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'choiceas',
  getComponent (nextState, next) {
    require.ensure([
      './containers/ChoiceAsContainer',
      './modules/choiceas'
    ], (require) => {
      const ChoiceAs = require('./containers/ChoiceAsContainer').default
      const reducer = require('./modules/choiceas').default

      injectReducer(store, { key: 'choiceas', reducer })

      next(null, ChoiceAs)
    })
  }
})
