import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import '@/presentation/styles/global.scss'
import Start from '@/presentation/pages/start/start'

type Factory = {
  makeLogin: React.FC
  makeSignup: React.FC
}

const Router: React.FC<Factory> = (factory: Factory) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={() => { return (<Start />) }} />
        <Route path="/login" component={factory.makeLogin} />
        <Route path="/signup" component={factory.makeSignup} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
