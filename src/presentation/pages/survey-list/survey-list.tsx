import { Footer, Header, Icon, IconName } from '@/presentation/components'
import React from 'react'
import Styles from './survey-list-styles.scss'

const SurveyList: React.FC = () => {
  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
          <h2>Enquetes</h2>
          <ul>
            <li>
              <div className={Styles.surveyContent}>
                <Icon className={Styles.iconWrap} iconName={IconName.thumbDown}/>
                <time>
                  <span className={Styles.day}>22</span>
                  <span className={Styles.month}>10</span>
                  <span className={Styles.year}>2023</span>
                </time>
                <p>Me diga qual é seu framework favorito?</p>
              </div>
              <footer>
                    Ver resultado
              </footer>
            </li>
            <li></li>
            <li></li>
            <li></li>
           </ul>
      </div>
      <Footer />
    </div>
  )
}

export default SurveyList
