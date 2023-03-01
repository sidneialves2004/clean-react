import React from 'react'
import Styles from './survey-result-styles.scss'
import { Header, Footer, Loading } from '@/presentation/components'
import FlipMove from 'react-flip-move'

const SurveyResult: React.FC = () => {
  return (
    <div className={Styles.surveyResultWrap}>
      <Header />
      <div className={Styles.contentWrap}>
          <h2>Qual é seu framework favorito ?</h2>
          <FlipMove className={Styles.answerList}>
            <li>
              <img src='https://miro.medium.com/v2/resize:fit:640/format:webp/1*cPh7ujRIfcHAy4kW2ADGOw.png' alt="" />
              <span className={Styles.answer}>ReactJS</span>
              <span className={Styles.percent}>50%</span>
            </li>
            <li className={Styles.active}>
              <img src='https://miro.medium.com/v2/resize:fit:640/format:webp/1*cPh7ujRIfcHAy4kW2ADGOw.png' alt="" />
              <span className={Styles.answer}>ReactJS</span>
              <span className={Styles.percent}>50%</span>
            </li>
            <li>
              <img src='https://miro.medium.com/v2/resize:fit:640/format:webp/1*cPh7ujRIfcHAy4kW2ADGOw.png' alt="" />
              <span className={Styles.answer}>ReactJS</span>
              <span className={Styles.percent}>50%</span>
            </li>
          </FlipMove>
          <button>Voltar</button>
          { false && <Loading /> }
      </div>
      <Footer />
    </div>
  )
}

export default SurveyResult
