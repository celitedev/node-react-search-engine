import React from 'react';
import PureComponent from 'react-pure-render/component';

import { page } from '../page';

import MyCollections from '../../components/MyCollections';

@page('Index')
export default class Index extends PureComponent {

  static fetchData({ dispatch }) {
    return Promise.resolve({});
  }
  render() {
    return (
      <div className='col-md-12'>
        <MyCollections />
      </div>
    );
  }

}
