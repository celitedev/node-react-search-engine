import React, {Component} from 'react';
import { pure } from 'recompose';
import autobind from 'autobind-decorator';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import {Menu, MenuItem, RaisedButton, Badge} from 'material-ui';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import Map from '../Widgets/Map';
import Card from '../Cards/Card';
import Waypoint from 'react-waypoint';
import _ from 'lodash';
import {loadMoreResults, filterResults} from '../../actions';
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import FilterListIcon from 'material-ui/svg-icons/content/filter-list';
import CardsCarousel from '../Cards/CardsCarousel';
import {types} from '../../exampleQuestions';
const debug = require('debug')('app:search');

@connect(null, {loadMoreResults, filterResults})
@pure
export default class Search extends Component {
  constructor(props, context) {
    super(props, context);
    const {answer} = props;
    const filter = _.findKey(types, (o) => {
      return o === answer.filterContext.type;
    });
    this.state = {
      answer: answer,
      results: answer.results,
      resultsPage: 1,
      filter: filter,
      selectedMarker: null,
      isSlider: false,
      slideIndex: 0,
      removeFilter: false
    };
  }
  async loadNewResults() {
    const {loadMoreResults} = this.props;
    const {results, resultsPage, answer} = this.state;
    debug('Load new results start:', 'results: ', results, 'page: ', resultsPage, 'answer: ', answer);
    try {
      const newResults = await loadMoreResults(resultsPage, answer.filterContext);
      debug('Load new results finished: ', newResults);
      this.setState({
        results: [...results, ...newResults.results],
        resultsPage: resultsPage + 1
      });
    } catch (err) {
      debug('Load new results error:', err);
    }
  }

  @autobind
  handleWaypointEnter() {
    this.loadNewResults();
  }

  filterHandler(type) {
    this.filterResults({}, types[type]);
    this.setState({
      filter: type
    }, this.handleRequestClose());
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
    if (results.length - 2 === index || results.length - 1 === index) {
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
  @autobind
  removeFilter() {
    const {filter, answer, removeFilter} = this.state;
    const {subtype, name} = answer.filterContext.filter;
    debug('removeFilter', subtype, name);
    this.filterResults({}, types[filter]);
    this.setState({
      removeFilter: !removeFilter
    });
  }

  @autobind
  handleFilterTouchTap (event) {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      openFilters: true,
      anchorFilters: event.currentTarget,
    });
  }

  @autobind
  handleBageTouchTap (event) {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      openBageBtn: true,
      anchorBage: event.currentTarget,
    });
  }

  handleRequestClose = () => {
    this.setState({
      openFilters: false,
      openBageBtn: false
    });
  };

  render() {
    const {params} = this.props;
    const {answer, results, filter, selectedMarker, isSlider, slideIndex, removeFilter, openFilters, openBageBtn, anchorFilters, anchorBage} = this.state;
    let setMapView;
    if (!_.isEmpty(answer.results)) {
      isGeo = _.find(answer.results, (result) => {
        return !_.isUndefined(result.raw.geo);
      });
      if (_.isObject(isGeo)) {
        setMapView = [
          isGeo.raw.geo.latitude,
          isGeo.raw.geo.longitude
        ];
      }
    }
    const mapMarkers = _.filter(results, (result) => {
      return result.raw.geo;
    });
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
      dots: true,
      speed: 100,
      responsive: [{
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }]
    };
    return (
      <main className={classnames('search-page', !isSlider && styles.containerMargin)}>
        <div className={classnames('filters', !isSlider && styles.stickyHeader)}>
          <RaisedButton
            label={filter}
            labelPosition='before'
            labelColor='white'
            backgroundColor='#3F51B5'
            icon={<ArrowDownIcon color='white'/>}
            onTouchTap={this.handleFilterTouchTap}
            className={styles.dropDownFilter}
          />
          <Popover
            open={openFilters}
            anchorEl={anchorFilters}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
            animation={PopoverAnimationVertical}
          >
            <Menu>
              <MenuItem primaryText='Happening' onClick={() => this.filterHandler('happening')}/>
              <MenuItem primaryText='Places' onClick={() => this.filterHandler('places')}/>
              <MenuItem primaryText='Creative work' onClick={() => this.filterHandler('creative Work')}/>
              <MenuItem primaryText='Person / Group' onClick={() => this.filterHandler('Person / Group')}/>
            </Menu>
          </Popover>
          {!_.isEmpty(answer.filterContext.filter) && (
            <div className='filters--active'>
              {name && (
                <RaisedButton
                  label={`Search: ${name}`}
                  labelPosition='before'
                  onTouchTap={this.removeFilter}
                  backgroundColor='#00cd75'
                  className={styles.filters}
                />
              )}
              {subtypes && (
                <RaisedButton
                  label={subtypes}
                  labelPosition='before'
                  onTouchTap={this.removeFilter}
                  backgroundColor='#00cd75'
                  className={styles.filters}
                />
              )}
            </div>
          )}
          {!_.isEmpty(answer.filterContext.filter) && (
          <div className='filters--activeDialog'>
            <Badge
              badgeContent={_.keys(answer.filterContext.filter).length}
              primary={true}
              style={{'padding': 0, 'position': 'initial'}}
            >
              <RaisedButton
                primary={true}
                icon={<FilterListIcon color='white' />}
                onTouchTap={this.handleBageTouchTap}
              />
            </Badge>
            <Popover
              open={openBageBtn}
              anchorEl={anchorBage}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleRequestClose}
              animation={PopoverAnimationVertical}
            >
              <Menu>
                {name && (
                  <MenuItem primaryText={name} onClick={() => this.filterHandler()}/>
                )}
                {subtypes && (
                  <MenuItem primaryText={subtypes} onClick={() => this.filterHandler()}/>
                )}
              </Menu>
            </Popover>
          </div>
          )}
        </div>
        {_.isObject(isGeo) && (
          <Map id='map' className={classnames('leaflet-container leaflet-retina leaflet-fade-anim', isSlider && ('is-opened ' + styles.is_opened))} refreshMap={removeFilter} options={mapOptions} multipleMarkers={isSlider ? oneResult : mapMarkers} setView={isSlider ? this.setMapView(slideIndex) : setMapView} zoomControls={zoomControls} >
            <div className='mobile-cover' onClick={() => this.showMap()}></div>
            <div className={classnames('back-to-list', isSlider && styles.showBackArrow)} onClick={() => this.closeMap()}></div>
          </Map>
        )}
        <div classNmae='page-content'>
          <div id='js-searchResultPartial-container' className={classnames('l-searchPage l-cardResults m-card-results m-card-imgRight', styles.carouselOverflowFix, isSlider && 'is-slider')}>
            { isSlider && (
              <CardsCarousel afterChange={(e) => this.cardChanged(e)} miniMap={true} settings={carouselSettings} question={params.question} results={results}
                cardsStyle={classnames(`card actionBarHidden fixDots`, styles.cardStyle) }/>
            ) || (
              <div>
              {
              results.map((result, index) => (
                <Link key={index} to={`/details/${result.raw.id}`}>
                  <Card data={result} cardNumber={index + 1}
                    className={classnames(`card actionBarHidden card-${index}`, { [styles.active]: selectedMarker === result.id }, styles.cardStyle) } bgImage={true}/>
                </Link>
              ))}
              {results.length > 0 && (
                <Waypoint
                  onEnter={this.handleWaypointEnter}
                  threshold={0.2}
                />
                )}
              </div>
            )
            }
          </div>
        </div>
      </main>
    );
  }
}
