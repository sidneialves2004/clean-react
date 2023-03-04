import { Calendar } from '@/presentation/components'
import React from 'react'
import FlipMove from 'react-flip-move'
import Styles from './result-styles.scss'
import { useHistory } from 'react-router-dom'
import { LoadSurveyResult } from '@/domain/usecases'
import { SurveyResultAnswerData } from '@/presentation/pages/survey-result/components'

type Props = {
  surveyResult: LoadSurveyResult.ResultModel
}

const Result: React.FC<Props> = ({ surveyResult }: Props) => {
  const { goBack } = useHistory()
  return (
    <>
      <hgroup>
        <Calendar date={surveyResult.date} className={Styles.calendarWrap} />
        <h2 data-testid="question">{surveyResult.question}</h2>
      </hgroup>
      <FlipMove data-testid="answers" className={Styles.answerList}>
        <>
          { surveyResult.answers.map(answer => (
              <SurveyResultAnswerData key={answer.answer} answer={answer} />
          ))}
        </>
      </FlipMove>
      <button data-testid="back-button" className={Styles.button} onClick={goBack}>Voltar</button>
    </>
  )
}

export default Result
