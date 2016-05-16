import React, {PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import _ from 'lodash';
import config from '../../config.js';

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

  constructor(props, context) {
    super();
    this.map = null;
    this.state = {
      oldMarker: null,
      defaultView: [[
        40.735654,
        -73.990382
      ], 13]
    };
  }

  componentDidMount() {
    const {options, setView, zoomControls, multipleMarkers} = this.props;
    const container = findDOMNode(this.refs.map);
    const {accessToken, kwhenMapId} = config.mapbox;
    const view = setView ? setView : this.state.defaultView;
    function iconParams (index) {
      return {
        className: 'css-icon',
        iconSize: [40, 40],
        html: `<i>${index}</i>`
      };
    }
    L.mapbox.accessToken = accessToken;
    this.map = L.mapbox.map(container, kwhenMapId, options).setView([...view], 13);

    if (zoomControls) {
      const zoomCtrl = new L.Control.Zoom({
        ...zoomControls
      }).addTo(this.map);
    }
    if (multipleMarkers) {
      _.map(multipleMarkers, (marker, index) => {
        L.marker([
          marker.raw.geo.latitude,
          marker.raw.geo.longitude,
        ], {
          icon: L.divIcon(iconParams(index))
        }).addTo(this.map);
      });
    } else {
      const marker = L.marker([
        ...view
      ], {
        icon: L.divIcon(iconParams)
      }).addTo(this.map);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchResults !== this.props.searchResults) {
      console.log('Map new props');
    }
  }

  render() {
    const {className, id, children} = this.props;
    return (
      <div ref='map' id={id} className={className}>
          <div className='mobile-cover'></div>
          <div className='back-to-list'></div>
      </div>
    );
  }
}
