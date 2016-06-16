import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import CollectionCardsListItem from './CollectionCardsListItem';
import {connect} from 'redux-simple';
import {saveCollectionInfo} from '../../actions';
let Reorder;
if (!process.env.SERVER_RENDERING) {
  Reorder = require('react-reorder');
}
function user(state) {
  const {authenticated} = state.auth;
  return {authenticated};
}

@connect(user, {saveCollectionInfo})
export default class CollectionCardsList extends PureComponent {

  callback(event, item, index, newIndex, list) {
    this.props.saveCollectionInfo({cards: list});
  }

  render() {
    const {cards, authenticated} = this.props;
    return (
      <div className={classnames('mdl-grid', styles.root)}>
        <div className={styles.collectionCardUl}>
          {Reorder && (
            <Reorder
              itemKey='id'
              holdTime='100'
              list={cards}
              template={CollectionCardsListItem}
              callback={::this.callback}
              listClass='listClassReorder'
              itemClass={classnames('itemClassReorder', styles.clickCursor)}
              disableReorder={!authenticated}
            />
          )}
        </div>
      </div>
    );
  }
}
