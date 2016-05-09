import { t } from '../../../../util'

import * as constantsDirect from 'routes/ChoiceAs/modules/choiceas/constants'
import { constants } from 'routes/ChoiceAs/modules/choiceas'

const helpers = {
  hasConst: (a, name) => {
    a.notEqual(constants[name], undefined, `constants.${name} exists`)
    a.ok(constants[name].startsWith(constants.PREFIX),
      `${constants[name]} starts with ${constants.PREFIX}`)
  }
}

t('should export the contants', (a) => {
  a.plan(1)
  a.deepEqual(constants, constantsDirect, 'objects are equal')
})

t('should export a PREFIX constant', (a) => {
  a.plan(1)
  a.notEqual(constants.PREFIX, undefined, 'prefix is defined')
})

t('Should export required constants', (a) => {
  helpers.hasConst(a, 'ERROR')
  helpers.hasConst(a, 'CONDITION_START')
  helpers.hasConst(a, 'CONDITION_END')
  helpers.hasConst(a, 'TRIAL_START')
  helpers.hasConst(a, 'TRIAL_END')
  helpers.hasConst(a, 'KEY_CLICK')
  a.end()
})
