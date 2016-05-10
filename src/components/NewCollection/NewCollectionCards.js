import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import classnames from 'classnames';
import CollectionCardsList from './CollectionCardsList';
import CollectionCardsAddButton from './CollectionCardsAddButton';
import { connect } from 'redux-simple';
import { saveCollectionInfo } from '../../actions';

function collection(state) {
  const { savedCollectionInfo } = state.collection;
  return { savedCollectionInfo };
}

@connect(collection, {saveCollectionInfo})
export default class NewCollectionCards extends PureComponent {
  constructor(props, context) {
    super();
  }

  render() {
    const { savedCollectionInfo } = this.props;
    const {cards} = savedCollectionInfo;
    return (
        <div className={styles.root}>
          <div className='mdl-grid'>
            <CollectionCardsAddButton cards={cards} />
          </div>
          <div className='mdl-grid'>
            <CollectionCardsList cards={cards} />
          </div>
          <div className='mdl-grid'>
            {(() => {
              if (cards && cards.length) {
                return (
                  <CollectionCardsAddButton cards={cards} />
                );
              }
            })()}
          </div>
        </div>
    );
  }
}
