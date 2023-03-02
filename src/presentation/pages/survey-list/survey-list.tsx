import { Error, Footer, Header } from '@/presentation/components'
import { List } from '@/presentation/pages/survey-list/components'
import { LoadSurveyList } from '@/domain/usecases'
import React, { useEffect, useState } from 'react'
import Styles from './survey-list-styles.scss'
import { useErrorHandler } from '@/presentation/hooks'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState(old => ({ ...old, error: error.message }))
  })

  const reload = (): void => {
    setState(old => ({
      ...old,
      surveys: [],
      error: '',
      reload: !old.reload
    }))
  }
  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.SurveyModel[],
    error: '',
    reload: false
  })

  useEffect(() => {
    loadSurveyList.loadAll()
      .then(surveys => setState(old => ({ ...old, surveys })))
      .catch(error => {
        handleError(error)
      })
  }, [state.reload])

  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
          <h2>Enquetes</h2>
            {
              state.error
                ? <Error error={state.error} reload={reload}/>
                : <List surveys={state.surveys} />
            }
      </div>
      <Footer />
    </div>
  )
}

export default SurveyList
