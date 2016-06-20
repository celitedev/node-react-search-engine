import React, {PropTypes, Component} from 'react';
import {findDOMNode} from 'react-dom';
import { pure } from 'recompose';
import classnames from 'classnames';
import _ from 'lodash';
import config from '../../config.js';

const debug = require('debug')('app:map');

let L;
if (!process.env.SERVER_RENDERING) {
  L = require('mapbox.js');
}

@pure
export default class Map extends Component {
  static propTypes = {
    options: PropTypes.object,
    setView: PropTypes.array
  };

  static childContextTypes = {
    map: PropTypes.object
  };
  getChildContext() {
    return {
        map: this.map
    };
  }

  constructor(props, context) {
    super(props, context);
    this.map = null;
    this.state = {
      viewPoint: props.setView,
      oldMarker: null
    };
  }

  componentDidMount() {
    const {multipleMarkers} = this.props;
    this.initMap();
    this.showMarkers(multipleMarkers);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.refreshMap !== nextProps.refreshMap) {
      this.map.remove();
      this.initMap();
    }
    if (!_.isArray(nextProps.multipleMarkers)) {
      _.each(this.map._layers, (layer) => {
        if (!_.isUndefined(layer) && layer.options.icon) {
          this.map.removeLayer(layer);
        }
      });
      this.setState({
        viewPoint: nextProps.setView
      });
      if (nextProps.multipleMarkers.geo) {
        const {latitude, longitude} = nextProps.multipleMarkers.geo;
        setTimeout(() => {
          this.map.setView([latitude, longitude], 13);
          this.map.invalidateSize();
          this.showMarkers(nextProps.multipleMarkers);
        }, 200);
      }
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
    this.map = L.mapbox.map(container, kwhenMapId, options);
    function viewPointSet() {
      if (viewPoint) return viewPoint;
      return [
        40.723076,
        -73.994855
      ];
    }
      this.map.setView([...viewPointSet()], 15);
      setTimeout(() => {
        this.map.setView([...viewPointSet()], 13, {
        'animate': true,
        'pan': {
          'duration': 10
        },
        'zoom': {
          'animate': true
        }
      });
      }, 100);

    if (zoomControls) {
      new L.Control.Zoom({
        ...zoomControls
      }).addTo(this.map);
    }
  }

  showMarkers(multipleMarkers) {
    debug('markers', multipleMarkers);
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
    if (_.isArray(multipleMarkers) && multipleMarkers.length > 1) {
      _.map(multipleMarkers, (marker) => {
        debug('markers render', marker);
        const {geo, index} = marker;
        if (!geo) {
          return;
        }
        L.marker([
          geo.latitude,
          geo.longitude
        ], {
          icon: L.divIcon(iconParams(index))
        })
        .on('mouseover', () => {
          document.querySelector(`.card-${index}`)
            .classList.add('highlightedCard');
        })
        .on('mouseout', () => {
          document.querySelector(`.card-${index}`)
            .classList.remove('highlightedCard');
        })
        .on('click', () => {
          document.querySelector(`.card-${index}`)
            .scrollIntoView({block: 'end', behavior: 'smooth'});
        })
        .addTo(this.map);
      });
    } else if (viewPoint) {
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
