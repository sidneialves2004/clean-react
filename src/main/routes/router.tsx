import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import '@/presentation/styles/global.scss'
import { SurveyList } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'
import { makeLogin, makeSignup } from '@/main/factories/pages'
import { setCurrenetAccountAdapter } from '@/main/adapters'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrenetAccountAdapter
      }}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={() => { return (<SurveyList />) }} />
          <Route path="/login" component={makeLogin} />
          <Route path="/signup" component={makeSignup} />
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default Router
