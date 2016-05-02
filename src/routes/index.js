// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout/CoreLayout'
import Home from './Home'
import ChoiceAsRoute from './ChoiceAs'
import NotFoundRoute from './NotFound'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: Home,
  childRoutes: [
    ChoiceAsRoute(store),
    NotFoundRoute
  ]
  // Async example
  // getChildRoutes (location, next) {
  //   require.ensure([], (require) => {
  //     next(null, [
  //       // Provide store for async reducers and middleware
  //       // Steve: if used, remember to remove imports! (they're not required)
  //       require('./ChoiceAs').default(store),
  //       require('./NotFound').default
  //     ])
  //   })
  // }
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:
    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }
    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
