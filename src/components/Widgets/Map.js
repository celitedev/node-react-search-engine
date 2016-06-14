import React, {PropTypes, Component} from 'react';
import {findDOMNode} from 'react-dom';
import { pure } from 'recompose';
import classnames from 'classnames';
import _ from 'lodash';
import config from '../../config.js';

let L;
if (!process.env.SERVER_RENDERING) {
  L = require('mapbox.js');
}

@pure
export default class Map extends Component {
  static propTypes = {
    options: PropTypes.object,
    setView: PropTypes.array,
    multipleMarkers: PropTypes.array
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
    const {viewPoint} = this.state;
    if (viewPoint) {
      this.initMap();
      this.showMarkers(this.props.multipleMarkers);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.multipleMarkers.length === 1) {
      _.each(this.map._layers, (layer) => {
        if (!_.isUndefined(layer) && layer.options.icon) {
          this.map.removeLayer(layer);
        }
      });
      this.setState({
        viewPoint: nextProps.setView
      });
      setTimeout(() => {
        this.map.setView(nextProps.setView, 13);
        this.map.invalidateSize();
        this.showMarkers(nextProps.multipleMarkers);
      }, 200);
    } else {
      this.showMarkers(nextProps.multipleMarkers);
    }
    if (this.props.refreshMap !== nextProps.refreshMap) {
      this.map.remove();
      this.initMap();
    }
  }

  initMap() {
    const {options, zoomControls} = this.props;
    const container = findDOMNode(this.refs.map);
    const {accessToken, kwhenMapId} = config.mapbox;
    const {viewPoint} = this.state;

    L.mapbox.accessToken = accessToken;
    this.map = L.mapbox.map(container, kwhenMapId, options);
    this.map.setView([...viewPoint], 15);
    setTimeout(() => {
      this.map.setView([...viewPoint], 13, {
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
      _.map(multipleMarkers, (marker, index) => {
        const geo = marker.raw.geo;
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
