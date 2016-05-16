
import React from 'react';
import PureComponent from 'react-pure-render/component';
import ContentEditable from 'react-contenteditable';
import {connect} from 'redux-simple';
import { Link } from 'react-router';
import _ from 'lodash';
import classnames from 'classnames';
import Slider from 'react-slick';

import Card from './Card';

import {redirect} from '../../actions';

class NextArrow extends PureComponent {
  render() {
    return <a href='#' {...this.props} className={classnames('js-rowcontrol js-rowcontrol-next', styles.arrows)}>&gt;</a>;
  }
}

class PrevArrow extends PureComponent {
  render() {
    return <a href='#' {...this.props} className={classnames('js-rowcontrol js-rowcontrol-prev', styles.arrows)}>&lt;</a>;
  }
}


@connect(null, {redirect})
export default class CardsCarousel extends PureComponent {
  constructor(props, context) {
    super();
    this.state = {
      searchText: ''
    };
  }

  render() {
    const {searchText} = this.state;
    const {settings, sliderStyle, cardsStyle, results} = this.props;
    const setCarouselParams = {
      dots: true,
      infinite: false,
      speed: 500,
      initialSlide: 0,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      ...settings
    };
    return (
      <div className={sliderStyle}>
        <div className='l-cardCarousel-container l-cardCarousel-container-peek hasNext'>
                  <div className={classnames('l-cardCarousel-js', styles.root)}>
                    <div className=''>
                    <Slider {...setCarouselParams} dotsClass={styles.dotss}>
                      {_.map(results, (result, index) => {
                        return (
                        <div key={index} className={styles.sliderPosition}>
                          <Link to={`/details/${result.raw.id}`}>
                            <Card className={classnames('card m-card-imgRight', cardsStyle)} data={result}/>
                          </Link>
                        </div>
                          );
                      })}
                      </Slider>
                    </div>
                    <div className='controls-wrapper'>
                    <ul className='controls'>
                      </ul>
                      <Link to='/search' className='show-more'>
                        Show all
                      </Link>
                    </div>
                  </div>
                </div>
      </div>
    );
  }
}
