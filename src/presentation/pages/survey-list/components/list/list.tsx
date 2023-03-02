import React from 'react'
import { SurveyItemEmpty, SurveyItem } from '@/presentation/pages/survey-list/components'
import Styles from './list-styles.scss'
import { LoadSurveyList } from '@/domain/usecases'

type Props = {
  surveys: LoadSurveyList.SurveyModel[]
}

const List: React.FC<Props> = ({ surveys }: Props) => {
  return (
    <ul data-testid="survey-list" className={Styles.listWrap}>
      {
        surveys.length
          ? surveys.map((survey: LoadSurveyList.SurveyModel) => <SurveyItem survey={survey} key={survey.id} />)
          : <SurveyItemEmpty />
      }
    </ul>
  )
}

export default List
