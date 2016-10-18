import React from 'react';
import {map} from 'lodash';
import CardsCarousel from '../Cards/CardsCarousel.js';
import CardsPagination from '../Cards/CardPagination.js';
import Card from '../Cards/Card.js';
import classnames from 'classnames';
import {pure, compose, mapProps} from 'recompose';
import {answerCarousel} from '../componentsConfig/cardsCarousel';
import Footer from '../Footer/Footer.js';

import {Link} from 'react-router';

const enhance = compose(
  mapProps(
    props => {
      const {answer, params, mainTab, subTab} = props;
      return {answer, params, mainTab, subTab};
    }
  ),
  pure
);

const Answer = enhance(({answer, params, mainTab, subTab}) => (

  <main className='mdl-layout__content'>
    <div className='page-content'>
      <div className='l-answerPage'>
        {map(answer.results, (answer, index) => {
          return answer.results.length > 0 && index === mainTab && (
              <div key={index} className={styles.paginationSection}>
                <div className={classnames('related-answer-text', styles.topicHeader)}>
                  <Link dangerouslySetInnerHTML={{__html: answer.answerNLP}} to={`/search/${params.question}`} query={{ filter: JSON.stringify(answer.filterContext) }}/>
                </div>
                {/* <CardsCarousel settings={answerCarousel} showAll={true} question={params.question} filterContext={answer.filterContext} results={answer.results}
                               cardsStyle={styles.sliderCard} answer={answer}/> */}
               <CardsPagination settings={answerCarousel} showAll={true} question={params.question} filterContext={answer.filterContext} results={answer.results}
                              cardsStyle={styles.paginationCard} answer={answer}/>
              </div>
            );
        })}
      </div>
    </div>
    <Footer />
  </main>
));

export default Answer;
