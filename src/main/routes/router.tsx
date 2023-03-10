import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import '@/presentation/styles/global.scss'
import { ApiContext } from '@/presentation/contexts'
import { makeLogin, makeSignup, makeSurveyList, makeSurveyResult } from '@/main/factories/pages'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters'
import { PrivateRoute } from '@/presentation/components'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter
      }}>
      <BrowserRouter>
        <Switch>
          <PrivateRoute path="/" exact component={makeSurveyList} />
          <Route path="/login" component={makeLogin} />
          <Route path="/signup" component={makeSignup} />
          <PrivateRoute path="/surveys/:id" component={makeSurveyResult} />
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default Router
