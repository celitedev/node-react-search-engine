import React from 'react';
import ReactDOM from 'react-dom';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import { Link } from 'react-router';
import _ from 'lodash';
import classnames from 'classnames';
import config from '../../config';
import {IconButton, Menu, MenuItem} from 'react-mdl';
import InfiniteGrid from 'react-infinite-grid';
import Map from '../Widgets/Map';
import Card from '../Cards/Card';

export default class Search extends PureComponent {
  constructor(props, context) {
    super();
  }

  loadNewResults() {
    return () => console.log('newResults');
  }

  render() {
    const {answer} = this.props;
    const items = _.map(answer.results, (result, index) => {
      return <Card data={result} className='actionBarHidden'/>;
    });
    const mapOptions = {
      scrollWheelZoom: true,
      zoomControl: false
    };
    const setMapView = [
      40.735654,
      -73.990382
    ];
    const zoomControls = {
      position: 'topright'
    };

    return (
      <main className='search-page'>
          <div id='js-filtersContainerPartial-container' className='filters'>
            <button id='type-selector' className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored' data-upgraded=',MaterialButton'>
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

            <div className='filters--active'><div className='mdl-tag'>restaurant</div></div>

            <div className='filters--activeDialog'>
              <span className='mdl-badge mdl-badge--overlap' data-badge='1'>
                <button id='activeFilters-selector' className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored' data-upgraded=',MaterialButton'><i className='material-icons'>filter_list</i></button>
              </span>
              <div className='mdl-menu__container is-upgraded'><div className='mdl-menu__outline mdl-menu--bottom-right'></div><ul className='mdl-menu mdl-menu--bottom-right mdl-js-menu' htmlFor='activeFilters-selector' data-upgraded=',MaterialMenu'><li className='mdl-menu__item' tabIndex='-1'>restaurant</li></ul></div>
            </div>
          </div>
          <Map id='map' options={mapOptions} multipleMarkers={answer.results} setView={setMapView} zoomControls={zoomControls}>
            <div className='mobile-cover'></div>
            <div className='back-to-list'></div>
          </Map>
        <div classNmae='page-content'>
          <div id='js-searchResultPartial-container' className='l-searchPage'>
          {
            _.map(answer.results, (result, index) => {
              return <Card key={index} data={result} className={classnames('card actionBarHidden', styles.cardStyle)} noImage={true}/>;
            })
          }
          </div>
        </div>
      </main>
    );
  }
}
