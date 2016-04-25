import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import classnames from 'classnames';
import _ from 'lodash';
import CollectionCardsList from './CollectionCardsList';
import CollectionCardsAddButton from './CollectionCardsAddButton';
import { connect } from 'redux-simple';
import { saveCollectionInfo } from '../../actions';
import 'material-design-icons';

function collection(state) {
  const { savedCollectionInfo } = state.collection;
  return { savedCollectionInfo };
}

@connect(collection, {saveCollectionInfo})
export default class NewCollectionCards extends PureComponent {
  constructor(props, state) {
    super();
    this.state = {
    };
  }
  render() {
    const { savedCollectionInfo } = this.props;
    const cards = _.reverse(savedCollectionInfo.cards);
    return (
        <div className={ classnames(styles.root) }>
          <div className={ classnames('mdl-grid') }>
            <CollectionCardsAddButton cards={cards} />
          </div>
          <div className={ classnames('mdl-grid') }>
            <CollectionCardsList cards={cards} />
          </div>
          <div className={ classnames('mdl-grid') }>
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
