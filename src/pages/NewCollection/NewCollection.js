import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import _ from 'lodash';
import {page} from '../page';
import {API_REQUEST} from '../../actionTypes';
import {saveCollectionInfo} from '../../actions';
import NewCollectionHeader from '../../components/NewCollection/NewCollectionHeader';
import NewCollectionDescription from '../../components/NewCollection/NewCollectionDescription';
import NewCollectionCards from '../../components/NewCollection/NewCollectionCards';
import CollectionAddCardDialog from '../../components/NewCollection/CollectionAddCardDialog';

function collection(state) {
  const {showPlaceholders, savedCollectionInfo} = state.collection;
  return {showPlaceholders, savedCollectionInfo};
}

@page('NewCollection', collection, {saveCollectionInfo})
export default class NewCollection extends PureComponent {

  static fetchData({dispatch, params}) {
    return {
      collection: dispatch({
        type: API_REQUEST,
        method: 'get',
        path: '/collections/one',
        query: params
      })
    };
  }

  saveCollection(collection) {
    this.props.saveCollectionInfo({...collection});
  }

  render() {
    const {data, loading, savedCollectionInfo, params} = this.props;
    if (data && savedCollectionInfo.id !== data.collection.id) {
      this.saveCollection(data.collection);
    }
    if (loading || (!_.isEmpty(params) && !savedCollectionInfo.id)) {
      return <div>Loading...</div>;
    }
    return (
      <div className={classnames(styles.background)}>
        <NewCollectionHeader />
        <NewCollectionDescription />
        <NewCollectionCards />
        <CollectionAddCardDialog />
      </div>
    );
  }

}
