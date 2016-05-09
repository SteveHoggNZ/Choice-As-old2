import { h, hh, t, tt, st } from '../../util'
import test from 'blue-tape'
import HomeRoute from 'routes/Home'

h('(Route) Home')

t('should return a route configuration object', (a) => {
  a.plan(1)
  a.equal(typeof HomeRoute.component(), 'object', 'returns an object')
})

t('should define a route component', (a) => {
  a.plan(1)
  a.equal(HomeRoute.component().type, 'div')
})
