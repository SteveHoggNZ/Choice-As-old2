import test from 'blue-tape'
import { h, sh } from '../../../../test_util'

h('(Redux Module) ChoiceAs')
sh('(Constants)')
require('./constants.test.js')
sh('(Util)')
// require('./util.test.js')
sh('(Actions)')
require('./actions.test.js')
sh('(Sagas)')
require('./sagas.test.js')
