import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import Slider from 'react-slick';
import Card from './Card';
import _ from 'lodash';
import {redirect} from '../../actions';

if (!process.env.SERVER_RENDERING) {
  require('../../../modernizr');
}

class NextArrow extends PureComponent {
  render() {
    const {onClick, miniMap, show} = this.props;
    return (
      (_.isFunction(onClick) && (show || Modernizr.touchevents)) && (
      <a href='#' {...this.props}
         className={classnames('js-rowcontrol js-rowcontrol-next', styles.arrows, {[styles.arrowsStyle]: miniMap})}>&gt;</a>
       ) || null
    );
  }
}

class PrevArrow extends PureComponent {
  render() {
    const {onClick, miniMap, show} = this.props;
    return (
      (_.isFunction(onClick) && (show || Modernizr.touchevents)) && (
        <a href='#' {...this.props}
         className={classnames('js-rowcontrol js-rowcontrol-prev', styles.arrows, {[styles.arrowsStyle]: miniMap})}>&lt;</a>
       ) || null
    );
  }
}


@connect(null, {redirect})
export default class CardsCarousel extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      searchText: '',
      showArrowBtns: false
    };
  }

  showArrows() {
    const {showArrowBtns} = this.state;
    this.setState({
      showArrowBtns: true
    });
  }
  hideArrows(e) {
    if (!(e.relatedTarget && e.relatedTarget.nodeName === 'A')) {
      const {showArrowBtns} = this.state;
      this.setState({
        showArrowBtns: false
      });
    }
  }

  render() {
    const {settings, sliderStyle, cardsStyle, results, question, showAll, afterChange, filterContext, miniMap} = this.props;
    const {showArrowBtns} = this.state;
    const f = JSON.stringify(filterContext);
    const setCarouselParams = {
      dots: true,
      infinite: false,
      speed: 500,
      initialSlide: 0,
      nextArrow: <NextArrow miniMap={miniMap} show={showArrowBtns}/>,
      prevArrow: <PrevArrow miniMap={miniMap} show={showArrowBtns}/>,
      ...settings
    };
    return (
      <div onMouseOver={::this.showArrows} onMouseOut={::this.hideArrows}>
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
                    <span className={styles.showAll}>SHOW ALL</span>
                  </Link>
                </span>
              ) }
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}
