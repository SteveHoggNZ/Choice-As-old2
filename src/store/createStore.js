import Immutable from 'immutable'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'

import reducers from './reducers'

export default (initialState = Immutable.Map(), history) => {
  const sagaMiddleware = createSagaMiddleware()

  let middleware = applyMiddleware(sagaMiddleware,
    thunk, routerMiddleware(history))

  // Use DevTools chrome extension in development
  if (__DEBUG__) {
    const devToolsExtension = window.devToolsExtension

    if (typeof devToolsExtension === 'function') {
      middleware = compose(middleware, devToolsExtension())
    }
  }

  const store = createStore(reducers(), initialState, middleware)

  store.asyncReducers = {}
  store.runningSagas = {}
  store.sagaMiddleware = sagaMiddleware

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default

      store.replaceReducer(reducers)
    })
  }

  return store
}
