import React from 'react';
import {findDOMNode} from 'react-dom';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import {Menu, MenuItem} from 'react-mdl';
import Map from '../Widgets/Map';
import Marker from '../Widgets/Marker';
import Card from '../Cards/Card';
import Waypoint from 'react-waypoint';
import {loadMoreResults} from '../../actions';
import {Element} from 'react-scroll';
import CardsCarousel from '../Cards/CardsCarousel';
const debug = require('debug')('app:search');

@connect(null, {loadMoreResults})
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
    const {results, resultsPage} = this.state;

    try {
      const newResults = await loadMoreResults(resultsPage, {subtypes: 'restaurant'});
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

  filterHandler(e) {
    this.setState({
      filter: e.target.innerHTML
    });
  }

  selectMarker(markerId) {
    console.log(markerId);
  }

  showMap() {
    this.setState({
      isSlider: true
    });
  }
  cardChanged(index) {
    const {results} = this.state;
    if (results.length - 2 === index) {
      this.handleWaypointEnter();
    }
    this.setState({
      slideIndex: index
    });
  }

  setMapView(index) {
    const {raw} = this.state.results[index];
    if (raw.geo) {
      return [raw.geo.latitude,
            raw.geo.longitude];
    }
  }

  render() {
    const {params} = this.props;
    const {answer, results, filter, selectedMarker, isSlider, slideIndex} = this.state;
    const {raw} = answer.results[0];
    let oneResult = [];
    if (isSlider) {
      oneResult = [results[slideIndex]];
    }

    const mapOptions = {
      scrollWheelZoom: true,
      zoomControl: false
    };
    const setMapView = [
      raw.geo.latitude,
      raw.geo.longitude
    ];
    const zoomControls = {
      position: 'topright'
    };
    const carouselSettings = {
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
          <button id='type-selector' className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'
                  data-upgraded=',MaterialButton'>
            {filter}
            <i className='material-icons'>keyboard_arrow_right</i>
          </button>
          <Menu target='type-selector' >
            <MenuItem onClick={::this.filterHandler}>Happening</MenuItem>
            <MenuItem onClick={::this.filterHandler}>Places</MenuItem>
            <MenuItem onClick={::this.filterHandler}>Creative work</MenuItem>
            <MenuItem onClick={::this.filterHandler}>Person / Group</MenuItem>
          </Menu>
          <div className='mdl-menu__container is-upgraded'>
            <div className='mdl-menu__outline mdl-menu--bottom-left'></div>
          </div>

          <div className='filters--active'>
            <div className='mdl-tag'>restaurant</div>
          </div>

          <div className='filters--activeDialog'>
              <span className='mdl-badge mdl-badge--overlap' data-badge='1'>
                <button id='activeFilters-selector'
                        className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'
                        data-upgraded=',MaterialButton'><i className='material-icons'>filter_list</i></button>
              </span>
            <div className='mdl-menu__container is-upgraded'>
              <div className='mdl-menu__outline mdl-menu--bottom-right'></div>
              <ul className='mdl-menu mdl-menu--bottom-right mdl-js-menu' htmlFor='activeFilters-selector'
                  data-upgraded=',MaterialMenu'>
                <li className='mdl-menu__item' tabIndex='-1'>restaurant</li>
              </ul>
            </div>
          </div>
        </div>
        <Map id='map' className={classnames('leaflet-container leaflet-retina leaflet-fade-anim', isSlider && ('is-opened ' + styles.is_opened))} options={mapOptions} multipleMarkers={isSlider ? oneResult : results} setView={isSlider ? this.setMapView(slideIndex) : setMapView} zoomControls={zoomControls} >
          <div className='mobile-cover' onClick={() => this.showMap()}></div>
          <div className='back-to-list'></div>
        </Map>
        <div classNmae='page-content'>
          <div id='js-searchResultPartial-container' className={classnames('l-searchPage l-cardResults m-card-results m-card-imgRight', isSlider && 'is-slider')}>
            { isSlider && (
              <CardsCarousel afterChange={(e) => this.cardChanged(e)} settings={carouselSettings} question={params.question} results={results}
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
            <Waypoint
              onEnter={::this.handleWaypointEnter}
              threshold={0.2}
            />
          </div>
        </div>
      </main>
    );
  }
}
