import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import {Menu, MenuItem} from 'react-mdl';
import Map from '../Widgets/Map';
import Card from '../Cards/Card';
import Waypoint from 'react-waypoint';
import _ from 'lodash';
import {loadMoreResults, filterResults} from '../../actions';
import CardsCarousel from '../Cards/CardsCarousel';
import {types} from '../Index/exampleQuestions';
const debug = require('debug')('app:search');

@connect(null, {loadMoreResults, filterResults})
export default class Search extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      answer: props.answer,
      results: props.answer.results,
      resultsPage: 1,
      filter: 'Places',
      selectedMarker: null,
      isSlider: false,
      slideIndex: 0
    };
  }
  async loadNewResults() {
    const {loadMoreResults} = this.props;
    const {results, resultsPage, answer} = this.state;
    debug('Load new results start:', 'results: ', results, 'page: ', resultsPage, 'answer: ', answer);
    try {
      const newResults = await loadMoreResults(resultsPage, answer.filterContext.filter);
      this.setState({
        results: [...results, ...newResults.results],
        resultsPage: resultsPage + 1
      });
    } catch (err) {
      debug('Load new results error:', err);
    }
  }

  handleWaypointEnter() {
    this.loadNewResults();
  }

  filterHandler(type) {
    this.filterResults({}, types[type]);
    this.setState({
      filter: type
    });
  }

  showMap() {
    this.setState({
      isSlider: true
    });
  }

  closeMap() {
    this.setState({
      isSlider: false
    });
  }

  cardChanged(index) {
    const {results} = this.state;
    if (results.length - 2 === index) {
      debug('Reached wayPoint ', results);
      this.handleWaypointEnter();
    }
    this.setState({
      slideIndex: index
    });
  }

  setMapView(index) {
    if (this.state.results[index]) {
      const {raw} = this.state.results[index];
    if (raw.geo) {
      return [raw.geo.latitude,
            raw.geo.longitude];
    }
    }
  }

  async filterResults(filter, type) {
    const {filterResults} = this.props;
    try {
      debug('fetch strat', 'type:', type, 'filter', filter);
      const answer = await filterResults(type, filter);
      debug('searchRequest results', answer);
      this.setState({
        answer: answer,
        results: answer.results
      });
    } catch (err) {
      debug('searchRequest Error', err);
    }
  }

  removeFilter() {
    const {filter, answer} = this.state;
    const {subtype, name} = answer.filterContext.filter;
    debug('removeFilter', subtype, name);
    this.filterResults({}, types[filter]);
  }

  filtersPin(e) {
    console.log(e);
  }

  render() {
    const {params} = this.props;
    const {answer, results, filter, selectedMarker, isSlider, slideIndex} = this.state;
    let raw;
    let setMapView;
    if (!_.isEmpty(answer.results)) {
      raw = answer.results[0].raw;
      setMapView = [
      raw.geo.latitude,
      raw.geo.longitude
    ];
    }
    const {subtypes, name} = answer.filterContext.filter;
    let oneResult = [];
    if (isSlider) {
      oneResult = [results[slideIndex]];
    }

    const mapOptions = {
      scrollWheelZoom: true,
      zoomControl: false
    };
    const zoomControls = {
      position: 'topright'
    };
    const carouselSettings = {
      dots: false,
      responsive: [{
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }]
    };
    return (
      <main className='search-page'>
        <div id='js-filtersContainerPartial-container' className='filters'>
          <button id='type-selector' className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'>
            {filter}
            <i className='material-icons'>keyboard_arrow_right</i>
          </button>
          <Menu target='type-selector' >
            <MenuItem onClick={() => this.filterHandler('happening')}>Happening</MenuItem>
            <MenuItem onClick={() => this.filterHandler('places')}>Places</MenuItem>
            <MenuItem onClick={() => this.filterHandler('creative Work')}>Creative work</MenuItem>
            <MenuItem onClick={() => this.filterHandler('Person / Group')}>Person / Group</MenuItem>
          </Menu>
          <div className='mdl-menu__container is-upgraded'>
            <div className='mdl-menu__outline mdl-menu--bottom-left'></div>
          </div>
          {!_.isEmpty(answer.filterContext.filter) && (
            <div className='filters--active'>
              <div className='mdl-tag' onClick={() => this.removeFilter()}>{subtypes || name}</div>
            </div>
          )}
          {!_.isEmpty(answer.filterContext.filter) && (
          <div className='filters--activeDialog'>
            <span className='mdl-badge mdl-badge--overlap' data-badge='1'>
              <button id='activeFilters-selector'
                className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'>
                <i className='material-icons'>filter_list</i></button>
            </span>
            <div className={classnames('mdl-menu__container is-upgraded', styles.mobileFilters)}>
              <div className='mdl-menu__outline mdl-menu--bottom-right'></div>
              <ul className='mdl-menu mdl-menu--bottom-right mdl-js-menu' htmlFor='activeFilters-selector'>
                <li className='mdl-menu__item' tabIndex='-1' onClick={() => this.removeFilter()} >{subtypes || name}</li>
              </ul>
            </div>
          </div>
          )}
        </div>
        {results.length && (
          <Map id='map' className={classnames('leaflet-container leaflet-retina leaflet-fade-anim', isSlider && ('is-opened ' + styles.is_opened))} options={mapOptions} multipleMarkers={isSlider ? oneResult : results} setView={isSlider ? this.setMapView(slideIndex) : setMapView} zoomControls={zoomControls} >
            <div className='mobile-cover' onClick={() => this.showMap()}></div>
            <div className={classnames('back-to-list', isSlider && styles.showBackArrow)} onClick={() => this.closeMap()}></div>
          </Map>
        ) || null}
        <div classNmae='page-content'>
          <div id='js-searchResultPartial-container' className={classnames('l-searchPage l-cardResults m-card-results m-card-imgRight', isSlider && 'is-slider' && styles.carouselStyle)}>
            { isSlider && (
              <CardsCarousel afterChange={(e) => this.cardChanged(e)} miniMap={true} settings={carouselSettings} question={params.question} results={results}
                cardsStyle={classnames(`card actionBarHidden`, styles.cardStyle) }/>
            ) || (
              results.map((result, index) => (
                <Link key={index} to={`/details/${params.question}/${result.raw.id}`}>
                  <Card data={result} cardNumber={index + 1}
                    className={classnames(`card actionBarHidden card-${index}`, { [styles.active]: selectedMarker === result.id }, styles.cardStyle) } bgImage={true}/>
                </Link>
              ))
            )
            }
            {results.length && (
            <Waypoint
              onEnter={::this.handleWaypointEnter}
              threshold={0.2}
            />
            ) || null}
          </div>
        </div>
      </main>
    );
  }
}
