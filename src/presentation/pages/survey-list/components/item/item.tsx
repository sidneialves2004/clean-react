import React from 'react'
import { Calendar, Icon, IconName } from '@/presentation/components'
import Styles from './item-styles.scss'
import { LoadSurveyList } from '@/domain/usecases'

type Props = {
  survey: LoadSurveyList.SurveyModel
}

const SurveyItem: React.FC<Props> = ({ survey }: Props) => {
  const iconName = survey.didAnswer ? IconName.thumbUp : IconName.thumbDown
  return (
      <li className={Styles.surveyItemWrap}>
        <div className={Styles.surveyContent}>
          <Icon className={Styles.iconWrap} iconName={iconName}/>
          <Calendar className={Styles.calendarWrap} date={survey.date} />
          <p data-testid="question">{survey.question}</p>
        </div>
        <footer data-testid="footer">Ver resultado</footer>
    </li>
  )
}

export default SurveyItem
