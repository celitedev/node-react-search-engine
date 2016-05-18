import React from 'react';
import PureComponent from 'react-pure-render/component';
import CollectionCardsList from './CollectionCardsList';
import CollectionCardsAddButton from './CollectionCardsAddButton';
import {connect} from 'redux-simple';
import {saveCollectionInfo} from '../../actions';

function collection(state) {
  const {savedCollectionInfo} = state.collection;
  return {savedCollectionInfo};
}

@connect(collection, {saveCollectionInfo})
export default class NewCollectionCards extends PureComponent {

  render() {
    const {cards} = this.props.savedCollectionInfo;
    return (
      <div className={styles.root}>
        <div className='mdl-grid'>
          <CollectionCardsAddButton cards={cards}/>
        </div>
        <div className='mdl-grid'>
          <CollectionCardsList cards={cards}/>
        </div>
        <div className='mdl-grid'>
          {cards && cards.length && (
            <CollectionCardsAddButton cards={cards}/>
          )}
        </div>
      </div>
    );
  }
}
