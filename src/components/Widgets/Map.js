import React, {PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import _ from 'lodash';
import config from '../../config.js';

const debug = require('debug')('app:map');

let L;
if (!process.env.SERVER_RENDERING) {
  L = require('mapbox.js');
}

export default class Map extends PureComponent {
  static propTypes = {
    options: PropTypes.object,
    setView: PropTypes.array,
    multipleMarkers: PropTypes.array
  }

  static childContextTypes = {
    map: PropTypes.object
  }
  getChildContext() {
    return {
        map: this.map
    };
  }

  constructor(props, context) {
    super();
    this.map = null;
    this.state = {
      viewPoint: props.setView || [[
        40.735654,
        -73.990382
      ], 13],
      oldMarker: null
    };
  }

  componentDidMount() {
    const {multipleMarkers} = this.props;
    this.initMap();
     this.showMarkers(multipleMarkers);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.multipleMarkers.length === 1) {
      this.map.remove();
    this.setState({
      viewPoint: nextProps.setView
    });
    setTimeout(() => {
      this.initMap();
      this.showMarkers(nextProps.multipleMarkers);
    }, 100);
    } else {
      this.showMarkers(nextProps.multipleMarkers);
    }
  }

  initMap() {
    const {options, zoomControls} = this.props;
    const container = findDOMNode(this.refs.map);
    const {accessToken, kwhenMapId} = config.mapbox;
    const {viewPoint} = this.state;

    L.mapbox.accessToken = accessToken;
    this.map = L.mapbox.map(container, kwhenMapId, options).setView([...viewPoint], 13);

    if (zoomControls) {
      const zoomCtrl = new L.Control.Zoom({
        ...zoomControls
      }).addTo(this.map);
    }
  }

  showMarkers(multipleMarkers) {
    const {viewPoint} = this.state;
    function iconParams(index) {
      if (!_.isUndefined(index)) {
        return {
          className: 'css-icon',
          iconSize: [40, 40],
          html: index + 1
        };
      }
      return {
        className: 'css-icon-detail',
        iconSize: [32, 32]
      };
    }

    if (multipleMarkers && multipleMarkers.length > 1) {
      let markerElement = null;
      _.map(multipleMarkers, (marker, index) => {
        const geo = marker.raw.geo;
        if (!geo) {
          return;
        }
        markerElement = L.marker([
          geo.latitude,
          geo.longitude
        ], {
          icon: L.divIcon(iconParams(index))
        })
        .on('mouseover', (e) => {
          document.querySelector(`.card-${index}`)
            .classList.add('highlightedCard');
        })
        .on('mouseout', (e) => {
          document.querySelector(`.card-${index}`)
            .classList.remove('highlightedCard');
        })
        .on('click', (e) => {
          document.querySelector(`.card-${index}`)
            .scrollIntoView({block: 'end', behavior: 'auto'});
        })
        .addTo(this.map);
      });
    } else {
      L.marker([
        ...viewPoint
      ], {
        icon: L.divIcon(iconParams())
      }).addTo(this.map);
    }
  }

  render() {
    const {className, id, children} = this.props;
    return (
      <div ref='map' id={id} className={classnames(className)}>
        {children}
      </div>
    );
  }
}
