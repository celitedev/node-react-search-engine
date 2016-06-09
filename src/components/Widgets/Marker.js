import React, {PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import _ from 'lodash';
import config from '../../config.js';

const debug = require('debug')('app:map');

let L;
if (!process.env.SERVER_RENDERING) {
  L = require('mapbox.js');
}

export default class Marker extends PureComponent {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number
  }

  static contextTypes = {
    map: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.map = context.map;
    this.state = {
      viewPoint: props.setView || [[
        40.735654,
        -73.990382
      ], 13],
      oldMarker: null
    };
  }

  componentDidMount() {
    const {x, y, id} = this.props;
    this.showMarker(x, y, id);
  }

  componentWillReceiveProps(nextProps) {
    debug('Map new props');
    this.showMarker(nextProps.x, nextProps.y, nextProps.id);
  }

  showMarker(x, y, id) {
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

    const markerElement = L.marker([
      x,
      y
    ], {
        icon: L.divIcon(iconParams(id))
      })
      .addTo(this.map);
    // L.marker([
    //   ...viewPoint
    // ], {
    //     icon: L.divIcon(iconParams())
    //   }).addTo(this.map);
  }
  render() {
    return null;
  }
}
