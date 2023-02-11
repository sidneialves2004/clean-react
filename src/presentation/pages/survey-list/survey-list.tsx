import { Logo } from '@/presentation/components'
import Footer from '@/presentation/components/footer/footer'
import React from 'react'
import Styles from './survey-list-styles.scss'

const SurveyList: React.FC = () => {
  return (
    <div className={Styles.surveyListWrap}>
      <header className={Styles.headerWrap}>
        <div className={Styles.headerContent}>
            <Logo />
            <div className={Styles.logoutWrap}>
              <span>Sidnei</span>
              <a href="#">Sair</a>
            </div>
        </div>
      </header>
      <div className={Styles.contentWrap}>
          <h2>Enquetes</h2>
          <ul>
            <li>
              <div className={Styles.surveyContent}>
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
            <li>
              <div className={Styles.surveyContent}>
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
            <li>
              <div className={Styles.surveyContent}>
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

            <li>
              <div className={Styles.surveyContent}>
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
            <li>
              <div className={Styles.surveyContent}>
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
          </ul>
      </div>
      <Footer />
    </div>
  )
}

export default SurveyList
