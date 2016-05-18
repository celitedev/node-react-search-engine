import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import _ from 'lodash';
import {redirect} from '../../actions';
import CardsCarousel from '../Cards/CardsCarousel.js';

@connect(null, {redirect})
export default class Answer extends PureComponent {

  render() {
    const {answer, params} = this.props;
    const carouselSettings = {
      slidesToShow: 3,
      slidesToScroll: 3
    };
    return (
      <main className='mdl-layout__content'>
        <div className='page-content'>
          <div className='l-answerPage'>
            {_.map(answer.results, (answer, index) => {
              return answer.results.length && (
                  <div key={index}>
                    <div className='related-answer-text'>
                      <ul>
                        <li>
                          {answer.answerNLP}
                        </li>
                        <li>
                          <a href=''>View</a>
                        </li>
                      </ul>
                    </div>
                    <CardsCarousel settings={carouselSettings} question={params.question} results={answer.results}
                                   cardsStyle={styles.sliderCard}/>
                  </div>
                );
            })}
          </div>
        </div>
      </main>
    );
  }
}
