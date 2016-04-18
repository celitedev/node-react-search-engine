import React from 'react';
import PureComponent from 'react-pure-render/component';

import {page} from '../page';


@page('Playground')
export default class Playground extends PureComponent {
  static fetchData({dispatch}) {
    return Promise.resolve({});
  }

  render() {
    return (
      <div>
        playground33669900889977777999
      </div>
    );
  }

}
