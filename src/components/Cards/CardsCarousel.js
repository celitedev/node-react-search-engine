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
    const {onClick, miniMap} = this.props;
    return (
      _.isFunction(onClick) && (
      <a href='#' {...this.props}
         className={classnames('js-rowcontrol js-rowcontrol-next', styles.arrows, {[styles.arrowsStyle]: miniMap})}>&gt;</a>
         )
    );
  }
}

class PrevArrow extends PureComponent {
  render() {
    const {onClick, miniMap} = this.props;
    return (
      _.isFunction(onClick) && (<a href='#' {...this.props}
         className={classnames('js-rowcontrol js-rowcontrol-prev', styles.arrows, {[styles.arrowsStyle]: miniMap})}>&lt;</a>
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
    const {settings, sliderStyle, cardsStyle, results, question, showAll, afterChange, filterContext, miniMap} = this.props;
    const f = JSON.stringify(filterContext);
    const setCarouselParams = {
      dots: true,
      infinite: false,
      speed: 500,
      initialSlide: 0,
      nextArrow: <NextArrow miniMap={miniMap}/>,
      prevArrow: <PrevArrow miniMap={miniMap}/>,
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
                      <Card className={classnames('card m-card-imgRight', cardsStyle)} data={result}/>
                  </div>
                ))}
              </Slider>
              {showAll && (
                <span className={classnames(styles.showAllBtn)}>
                  <Link to={`/search/${question}`} query={{ filter: f }}>
                    Show all
                  </Link>
                </span>
              ) }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
