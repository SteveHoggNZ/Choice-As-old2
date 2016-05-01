import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'choiceas',
  getComponent (nextState, next) {
    console.log('getComponent ChoiceAs')
    require.ensure([
      './containers/ChoiceAsContainer',
      './modules/choiceas/reducer'
    ], (require) => {
      const ChoiceAs = require('./containers/ChoiceAsContainer').default
      const reducer = require('./modules/choiceas/reducer').default

      injectReducer(store, { key: 'choiceas', reducer })

      next(null, ChoiceAs)
    })
  }
})
