import React from 'react'
import ReactDOM from 'react-dom'
import Router from '@/presentation/components/router/router'
import { makeLogin, makeSignup } from './factories/pages'

ReactDOM.render(
  <Router
    makeLogin={makeLogin}
    makeSignup={makeSignup}
  />,
  document.getElementById('main')
)
