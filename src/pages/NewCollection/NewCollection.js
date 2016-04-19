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
import CollectionAddCardDialog from '../../components/NewCollection/CollectionAddCardDialog';
import CollectionInfo from '../../components/NewCollection/CollectionInfo';

function collection(state) {
  const {showPlaceholders} = state.collection;
  return {showPlaceholders};
}

@page('NewCollection', collection)
export default class Index extends PureComponent {
  static fetchData({dispatch}) {
    return {
      collection: dispatch({
        type: API_REQUEST,
        method: 'get',
        path: '/getCollection'
      })
    };
  }

  render() {
    const {data, loaded, showPlaceholders} = this.props;
    return (
      <div className={classnames(styles.background)}>
        <NewCollectionHeader />
        {showPlaceholders ? <NewCollectionDescription /> : <CollectionInfo />}
        <NewCollectionCards collection={data}/>
        <CollectionAddCardDialog />
      </div>
    );
  }

}
