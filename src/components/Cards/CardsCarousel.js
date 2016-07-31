import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import Slider from 'react-slick';
import Card from './Card';
import {map} from 'lodash';
import {redirect} from '../../actions';
import RaisedButton from 'material-ui/RaisedButton';


const debug = require('debug')('app:CardsCarousel');

if (!process.env.SERVER_RENDERING) {
  require('../../../modernizr');
}

class NextArrow extends PureComponent {
  render() {
    const aProps = Object.assign({}, this.props);
    const {onClick, miniMap, show} = aProps;

    delete aProps.miniMap;
    delete aProps.show;

    return (
      (_.isFunction(onClick) && (show || Modernizr.touchevents)) && (
        <a href='#' {...aProps}
           className={classnames('js-rowcontrol js-rowcontrol-next', styles.arrows, {[styles.arrowsStyle]: miniMap})}>&gt;</a>
      ) || null
    );
  }
}

class PrevArrow extends PureComponent {
  render() {
    const aProps = Object.assign({}, this.props);
    const {onClick, miniMap, show} = aProps;

    delete aProps.miniMap;
    delete aProps.show;

    return (
      (_.isFunction(onClick) && (show || Modernizr.touchevents)) && (
        <a href='#' {...aProps}
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

  beforeChange(e) {
    debug('beforeChange: ', e);
  }

  render() {
    const {settings, sliderStyle, cardsStyle, results, question, showAll, filterContext, miniMap, afterChange, answer} = this.props;
    const {showArrowBtns} = this.state;
    const f = JSON.stringify(filterContext);
    const showAllLabel = 'show all ' + answer.totalResults + ' ' + answer.typeHuman;
    const cardSettings = {
      identifiers1: results.find((r) => r.formatted.identifiers1),
      identifiers2: results.find((r) => r.formatted.identifiers2),
      headsup1: results.find((r) => r.formatted.headsup1),
      headsup2: results.find((r) => r.formatted.headsup2),
      databits1: results.find((r) => r.formatted.databits1),
      databits2: results.find((r) => {return (r.formatted.databits2 && r.formatted.databits2.length);}),
      whyshown: results.find((r) => r.formatted.whyshown)
    };
    const setCarouselParams = {
      dots: true,
      infinite: false,
      speed: 100,
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
              <Slider {...setCarouselParams} beforeChange={::this.beforeChange} afterChange={afterChange} className={sliderStyle}>
                {map(results, (result, index) => (
                  <div key={index} className={styles.sliderPosition}>
                      <Card className={classnames('card m-card-imgRight', cardsStyle)} shareBtn={true} settings={cardSettings} data={result}/>
                  </div>
                ))}
              </Slider>
              {showAll && (
                <Link to={`/search/${question}`} query={{ filter: f }}>
                <RaisedButton className={classnames(styles.showAllBtn)} label={showAllLabel} primary={true}/>
                  </Link>
              ) }
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}
