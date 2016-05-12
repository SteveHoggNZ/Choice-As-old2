import React from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './Header.scss'

export const Header = () => (
  <div>
    <h1>Choice As!</h1>
    <IndexLink to='/' activeClassName={classes.activeRoute}>
      Home
    </IndexLink>
    {' · '}
    <IndexLink to='/choiceas' activeClassName={classes.activeRoute}>
      Choice As
    </IndexLink>
    {' · '}
    <Link to='/choiceas/trial' activeClassName={classes.activeRoute}>
      Choice As Trial
    </Link>
    {' · '}
    <Link to='/choiceas/test' activeClassName={classes.activeRoute}>
      Choice As Test
    </Link>
  </div>
)

export default Header
