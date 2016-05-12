import { h, t, st } from '../../../test_util'
import test from 'blue-tape'
import React from 'react'
import { HomeView } from 'routes/Home/components/HomeView'
import { render } from 'enzyme'

h('(View) Home')

t('renders a welcome message', (a) => {
  const _component = render(<HomeView />)
  const welcome = _component.find('h4')
  a.plan(2)
  a.notEqual(welcome, undefined, 'welcome exists')
  a.notEqual(welcome.text().indexOf('Welcome!'), -1, 'welcome string exists')
})

t('renders an awesome duck image', (a) => {
  const _component = render(<HomeView />)
  const duck = _component.find('img')
  a.plan(2)
  a.notEqual(duck, undefined, 'welcome exists')
  a.notEqual(duck.attr('alt').indexOf('This is a duck, because Redux!'), -1,
    'duck image exists')
})
