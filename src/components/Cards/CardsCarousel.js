import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import Slider from 'react-slick';
import Card from './Card';
import _ from 'lodash';
import {redirect} from '../../actions';

class NextArrow extends PureComponent {
  render() {
    const {onClick} = this.props;
    return (
      _.isFunction(onClick) && (
      <a href='#' {...this.props}
         className={classnames('js-rowcontrol js-rowcontrol-next', styles.arrows)}>&gt;</a>
         )
    );
  }
}

class PrevArrow extends PureComponent {
  render() {
    const {onClick} = this.props;
    return (
      _.isFunction(onClick) && (<a href='#' {...this.props}
         className={classnames('js-rowcontrol js-rowcontrol-prev', styles.arrows)}>&lt;</a>
         )
    );
  }
}


@connect(null, {redirect})
export default class CardsCarousel extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      searchText: ''
    };
  }

  render() {
    const {settings, sliderStyle, cardsStyle, results, question, showAll, afterChange} = this.props;
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
              <Slider {...setCarouselParams} afterChange={afterChange} className={sliderStyle}>
                {_.map(results, (result, index) => (
                  <div key={index} className={styles.sliderPosition}>
                    <Link to={`/details/${question}/${result.raw.id}`}>
                      <Card className={classnames('card m-card-imgRight', cardsStyle)} data={result}/>
                    </Link>
                  </div>
                ))}
              </Slider>
            </div>
            {showAll && (
              <div className='controls-wrapper'>
                <ul className='controls'>
                </ul>
                <Link to={`/search/${question}`} className='show-more'>Show all</Link>
              </div>
              ) }
          </div>
        </div>
      </div>
    );
  }
}
