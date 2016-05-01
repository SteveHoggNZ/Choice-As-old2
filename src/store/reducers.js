import { combineReducers } from 'redux-immutable'
import router from './routerReducer'

export const reducers = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    router,
    ...asyncReducers })
}

export const injectReducer = (store, { key, reducer }) => {
  if (!store.asyncReducers[key]) {
    store.asyncReducers[key] = reducer
    store.replaceReducer(reducers(store.asyncReducers))
  }
}

export default reducers
