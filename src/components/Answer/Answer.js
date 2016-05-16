import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import { Link } from 'react-router';
import _ from 'lodash';
import classnames from 'classnames';

import {redirect} from '../../actions';

import CardsCarousel from '../Cards/CardsCarousel.js';

@connect(null, {redirect})
export default class Answer extends PureComponent {
  constructor(props, context) {
    super();
  }

  render() {
    const {results} = this.props.answer;
    const carouselSettings = {
      slidesToShow: 3,
      slidesToScroll: 3,
    };
    return (
      <main className='mdl-layout__content'>
        <div className='page-content'>
          <div className='l-answerPage'>
          {_.map(results, (answer, index) => {
            return (
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
                <CardsCarousel settings={carouselSettings} results={answer.results} cardsStyle={styles.sliderCard}/>
              </div>
              );
          })}
          </div>
        </div>
      </main>
    );
  }
}
