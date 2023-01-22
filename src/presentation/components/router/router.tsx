import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import '@/presentation/styles/global.scss'
import { makeLogin } from '@/main/factories/pages'
import Start from '@/presentation/pages/start/start'
import { Signup } from '@/presentation/pages'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={() => { return (<Start />) }} />
        <Route path="/login" component={makeLogin} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
