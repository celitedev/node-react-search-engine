import React from 'react';
import PureComponent from 'react-pure-render/component';
import _ from 'lodash';
import CardsCarousel from '../Cards/CardsCarousel.js';
import classnames from 'classnames';

export default class Answer extends PureComponent {

  createHumanAnswerAsHTML(sHtml) {
    return {__html: sHtml};
  }

  render() {
    const {answer, params} = this.props;
    const carouselSettings = {
      responsive: [{
        breakpoint: 4000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }, {
          breakpoint: 1600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          },
          className: 'class'
        }, {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        }, {
          breakpoint: 800,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }]
    };

    return (
      <main className='mdl-layout__content'>
        <div className='page-content'>
          <div className='l-answerPage'>
            {_.map(answer.results, (answer, index) => {
              return answer.results.length && (
                <div key={index}>
                  <div className={classnames('related-answer-text', styles.topicHeader)}>
                    <ul>
                      <li dangerouslySetInnerHTML={::this.createHumanAnswerAsHTML(answer.answerNLP)}/>
                    </ul>
                  </div>
                  <CardsCarousel settings={carouselSettings} showAll={true} question={params.question} filterContext={answer.filterContext} results={answer.results}
                    cardsStyle={styles.sliderCard}/>
                </div>
              ) || null;
            }) }
          </div>
        </div>
      </main>
    );
  }
}
