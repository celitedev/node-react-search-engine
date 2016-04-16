import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import classnames from 'classnames';
import CollectionCardsList from './CollectionCardsList';
import CollectionCardsAddButton from './CollectionCardsAddButton';
import 'material-design-icons';

export default class NewCollectionCards extends PureComponent {

  render() {
    const cards = [
      {
        id: 0,
        title: 'Title 1',
        content: 'Card content. Holy guacamole!',
        desc: 'Some optional description for first card'
      },
      {
        id: 1,
        title: 'Title 2',
        content: 'Card content. Holy guacamole!',
        desc: 'Some optional description for second card'
      },
      {
        id: 2,
        title: 'Title 3',
        content: 'Card content. Holy guacamole!',
        desc: ''
      },
      {
        id: 3,
        title: 'Title 4',
        content: 'Card content. Holy guacamole!',
        desc: 'Some optional description for forth card'
      }
    ];

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
