import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';

import {page} from '../page';

import MyCollections from '../../components/MyCollections';
import {API_REQUEST} from '../../actionTypes';

@page('MyCollections')
export default class Index extends PureComponent {
  static fetchData({dispatch}) {
    return {
      collections: dispatch({
        type: API_REQUEST,
        method: 'get',
        path: '/collections/all'
      })
    };
  }

  render() {
    const {data, loaded} = this.props;
    return (
      <div className={classnames(styles.background)}>
        <MyCollections collections={loaded && data.collections || []}/>
      </div>
    );
  }

}
