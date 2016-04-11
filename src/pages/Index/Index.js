import React from 'react';
import PureComponent from 'react-pure-render/component';

import {page} from '../page';

import MyCollections from '../../components/MyCollections';
import {API_REQUEST} from '../../actionTypes';

@page('Index')
export default class Index extends PureComponent {
  static fetchData({dispatch}) {
    return {
      collections: dispatch({
        type: API_REQUEST,
        method: 'get',
        path: '/collections'
      })
    };
  }

  getLocalStorageData () {
    localStorage.getItem();
  }

  render() {
    const {data, loaded} = this.props;
    return (
      <div className='col-md-12'>
        <MyCollections collections={loaded && data.collections || []}/>
      </div>
    );
  }

}
