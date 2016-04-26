import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import classnames from 'classnames';
import CollectionCardsListItem from './CollectionCardsListItem';
import { connect } from 'redux-simple';
import { saveCollectionInfo } from '../../actions';
let Reorder;
if (!process.env.SERVER_RENDERING) {
  Reorder = require('react-reorder');
}
@connect(null, {saveCollectionInfo})
export default class CollectionCardsList extends PureComponent {
  constructor(props, contex) {
    super();
  }
  callback(event, item, index, newIndex, list) {
    this.props.saveCollectionInfo({cards: list});
  }

  render() {
    const { cards } = this.props;
    return (
      <div className={ classnames('mdl-grid', styles.root) }>
        <div className={styles.collectionCardUl}>
          {Reorder && (
            <Reorder
              itemKey='id'
              holdTime='300'
              list={cards}
              template={CollectionCardsListItem}
              callback={::this.callback}
              listClass='listClassReorder'
              itemClass='itemClassReorder'
            />
          )}
        </div>
      </div>
    );
  }
}
