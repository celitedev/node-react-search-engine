import React from 'react';
import {map} from 'lodash';
import CardsCarousel from '../Cards/CardsCarousel.js';
import classnames from 'classnames';
import {pure, compose, mapProps} from 'recompose';
import {answerCarousel} from '../componentsConfig/cardsCarousel';

const encance = compose(
  mapProps(
    props => {
      const {answer, params} = props;
      return {answer, params};
    }
  ),
  pure
);

const Answer = encance(({answer, params}) => (
  <main>
    <div className='page-content'>
      <div className='l-answerPage'>
        {map(answer.results, (answer, index) => {
          return answer.results.length > 0 && (
              <div key={index}>
                <div className={classnames('related-answer-text', styles.topicHeader)}>
                  <ul>
                    <li dangerouslySetInnerHTML={{__html: answer.answerNLP}}/>
                  </ul>
                </div>
                <CardsCarousel settings={answerCarousel} showAll={true} question={params.question} filterContext={answer.filterContext} results={answer.results}
                               cardsStyle={styles.sliderCard}/>
              </div>
            );
        }) }
      </div>
    </div>
  </main>
));

export default Answer;
