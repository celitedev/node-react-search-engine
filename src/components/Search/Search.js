import React from 'react';
import {findDOMNode} from 'react-dom';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import {Menu, MenuItem} from 'react-mdl';
import Map from '../Widgets/Map';
import Card from '../Cards/Card';
import Waypoint from 'react-waypoint';
import {loadMoreResults} from '../../actions';

const debug = require('debug')('app:search');

@connect(null, {loadMoreResults})
export default class Search extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      answer: props.answer,
      results: props.answer.results,
      resultsPage: 1
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
    return () => debug('newResults');
  }

  handleWaypointEnter() {
    this.loadNewResults();
  }

  render() {
    const {params} = this.props;
    const {answer, results} = this.state;
    const {raw} = answer.results[0];

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

    return (
      <main className='search-page'>
        <div id='js-filtersContainerPartial-container' className='filters'>
          <button id='type-selector' className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'
                  data-upgraded=',MaterialButton'>
            Places
            <i className='material-icons'>keyboard_arrow_right</i>
          </button>
          <Menu target='type-selector'>
            <MenuItem>Happening</MenuItem>
            <MenuItem>Place</MenuItem>
            <MenuItem>Creative work</MenuItem>
            <MenuItem>Person / Group</MenuItem>
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
        <Map id='map' options={mapOptions} multipleMarkers={results} setView={setMapView} zoomControls={zoomControls}>
          <div className='mobile-cover'></div>
          <div className='back-to-list'></div>
        </Map>
        <div classNmae='page-content'>
          <div id='js-searchResultPartial-container' className='l-searchPage'>
            {results.map((result, index) => (
              <Link key={index} to={`/details/${params.question}/${result.raw.id}`}>
                <Card data={result} cardNumber={index + 1}
                      className={classnames('card actionBarHidden', styles.cardStyle)} bgImage={true}/>
              </Link>
            ))}
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
