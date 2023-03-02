import React, { useState } from 'react'
import Styles from './survey-result-styles.scss'
import { Header, Footer, Loading, Calendar, Error } from '@/presentation/components'
import FlipMove from 'react-flip-move'
import { LoadSurveyResult } from '@/domain/usecases'

const SurveyResult: React.FC = () => {
  const [state] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.ResultModel
  })
  return (
    <div className={Styles.surveyResultWrap}>
      <Header />
      <div data-testid="survey-result" className={Styles.contentWrap}>
          { state.surveyResult &&
          <>
            <hgroup>
              <Calendar date={new Date()} className={Styles.calendarWrap} />
              <h2>Qual é seu framework favorito ?  twertweQual é seu framework favorito ?</h2>
            </hgroup>
            <FlipMove className={Styles.answerList}>
              <li className={Styles.active}>
                <img src='https://miro.medium.com/v2/resize:fit:640/format:webp/1*cPh7ujRIfcHAy4kW2ADGOw.png' alt="" />
                <span className={Styles.answer}>ReactJS</span>
                <span className={Styles.percent}>50%</span>
              </li>
            </FlipMove>
            <button>Voltar</button>
        </>
        }
        { state.isLoading && <Loading /> }
        { state.isLoading && <Error error={state.error} reload={() => {}} /> }
      </div>
      <Footer />
    </div>
  )
}

export default SurveyResult
