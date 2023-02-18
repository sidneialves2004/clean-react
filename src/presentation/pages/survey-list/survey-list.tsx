import React, { useEffect, useState } from 'react'
import { Footer, Header } from '@/presentation/components'
import { SurveyItem, SurveyItemEmpty } from './components'
import Styles from './survey-list-styles.scss'
import { LoadSurveyList } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const [state, setState] = useState({
    surveys: [] as SurveyModel[]
  })

  useEffect(() => {
    loadSurveyList.loadAll()
      .then(surveys => setState({ surveys }))
  }, [])

  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
          <h2>Enquetes</h2>
          <ul data-testid="survey-list">
            {
              state.surveys.length
                ? state.surveys.map(survey => <SurveyItem survey={survey} key={survey.id} />)
                : <SurveyItemEmpty />
            }
          </ul>
      </div>
      <Footer />
    </div>
  )
}

export default SurveyList
