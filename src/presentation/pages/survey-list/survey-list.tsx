import { Footer, Header } from '@/presentation/components'
import { SurveyContext, List, Error } from '@/presentation/pages/survey-list/components'
import { ApiContext } from '@/presentation/contexts'
import { LoadSurveyList } from '@/domain/usecases'
import { AccessDiniedError } from '@/domain/errors'
import React, { useContext, useEffect, useState } from 'react'
import Styles from './survey-list-styles.scss'
import { useHistory } from 'react-router-dom'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const history = useHistory()
  const { setCurrentAccount } = useContext(ApiContext)
  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.SurveyModel[],
    error: '',
    reload: false
  })

  useEffect(() => {
    loadSurveyList.loadAll()
      .then(surveys => setState({ ...state, surveys }))
      .catch(error => {
        if (error instanceof AccessDiniedError) {
          setCurrentAccount(undefined)
          history.replace('/login')
        } else {
          setState({ ...state, error: error.message })
        }
      })
  }, [state.reload])

  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
          <h2>Enquetes</h2>
          <SurveyContext.Provider value={{ state, setState }}>
            {
              state.error ? <Error /> : <List />
            }
          </SurveyContext.Provider>
      </div>
      <Footer />
    </div>
  )
}

export default SurveyList
