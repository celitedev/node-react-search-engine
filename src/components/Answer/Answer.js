import React from 'react';
import {map} from 'lodash';
import CardsCarousel from '../Cards/CardsCarousel.js';
import classnames from 'classnames';
import {pure, compose, mapProps} from 'recompose';
import {answerCarousel} from '../componentsConfig/cardsCarousel';
import Footer from '../Footer/Footer.js';

import {Link} from 'react-router';

const enhance = compose(
  mapProps(
    props => {
      const {answer, params} = props;
      return {answer, params};
    }
  ),
  pure
);

const Answer = enhance(({answer, params}) => (

  <main className='mdl-layout__content'>
    <div className='page-content'>
      <div className='l-answerPage'>
        {map(answer.results, (answer, index) => {
          return answer.results.length > 0 && (
              <div key={index}>
                <div className={classnames('related-answer-text', styles.topicHeader)}>
                  <Link dangerouslySetInnerHTML={{__html: answer.answerNLP}} to={`/search/${params.question}`} query={{ filter: JSON.stringify(answer.filterContext) }}/>
                </div>
                <CardsCarousel settings={answerCarousel} showAll={true} question={params.question} filterContext={answer.filterContext} results={answer.results}
                               cardsStyle={styles.sliderCard} answer={answer}/>
              </div>
            );
        }) }
      </div>
    </div>
    <Footer />
  </main>
));

export default Answer;
