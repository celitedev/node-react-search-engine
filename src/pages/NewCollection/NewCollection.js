/**
 * Created by Mlobaievskyi on 13/04/16.
 */
import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';

import {page} from '../page';

import {API_REQUEST} from '../../actionTypes';

import NewCollectionHeader from '../../components/NewCollection/NewCollectionHeader';
import NewCollectionDescription from '../../components/NewCollection/NewCollectionDescription';
import NewCollectionCards from '../../components/NewCollection/NewCollectionCards';

@page('NewCollection')
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

  render() {
    const {data, loaded} = this.props;
    return (
      <div className={classnames(styles.background)}>
        <NewCollectionHeader />
        <NewCollectionDescription />
        <NewCollectionCards />
      </div>
    );
  }

}
