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
    <Link to='/choiceas/session' activeClassName={classes.activeRoute}>
      Choice As Session
    </Link>
    {' · '}
    <Link to='/choiceas/test' activeClassName={classes.activeRoute}>
      Choice As Test
    </Link>
  </div>
)

export default Header
