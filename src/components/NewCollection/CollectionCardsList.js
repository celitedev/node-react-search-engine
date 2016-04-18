import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import classnames from 'classnames';
import CollectionCardsListItem from './CollectionCardsListItem';
import 'material-design-icons';
let Reorder;
if (!process.env.SERVER_RENDERING) {
  Reorder = require('react-reorder');
}

export default class CollectionCardsList extends PureComponent {

  callback(event, item, index, newIndex, list) {
    //this.setState({arr: list});
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
