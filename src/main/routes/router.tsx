import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import '@/presentation/styles/global.scss'
import { makeLogin, makeSignup } from '@/main/factories/pages'
import { SurveyList } from '@/presentation/pages'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={() => { return (<SurveyList />) }} />
        <Route path="/login" component={makeLogin} />
        <Route path="/signup" component={makeSignup} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
