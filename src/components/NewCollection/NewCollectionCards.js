import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import classnames from 'classnames';

import 'material-design-icons';

export default class NewCollectionCards extends PureComponent {

  render() {
    const cards = [
      {
        title: 'Title 1',
        content: 'Card content. Holy guacamole!',
        desc: 'Some optional description for first card'
      },
      {
        title: 'Title 2',
        content: 'Card content. Holy guacamole!',
        desc: 'Some optional description for second card'
      },
      {
        title: 'Title 3',
        content: 'Card content. Holy guacamole!'
      },
      {
        title: 'Title 4',
        content: 'Card content. Holy guacamole!',
        desc: 'Some optional description for forth card'
      }
    ];
    return (
      <div className='mdl-grid'>
        <div className={styles.root}>
          <ul className={styles.collectionCardUl}>
            {cards.map((item, i) =>
              <li key={i} className={styles.collectionCardWide}>
                <div className={classnames('mdl-card mdl-shadow--2dp')} >
                  <div className='mdl-card__title'>
                    <h2 className='mdl-card__title-text'>{ item.title }</h2>
                  </div>
                  <div className='mdl-card__supporting-text'>
                    { item.content }
                  </div>
                  <div className='mdl-card__menu'>
                    <button className='mdl-button mdl-js-button mdl-button--raised'>
                      Drag
                    </button>
                    <button className='mdl-button mdl-js-button mdl-button--raised'>
                      <i className='material-icons'>delete</i> Delete
                    </button>
                  </div>
                </div>
                {(() => {
                  if (item.desc) {
                    return (
                        <div className={ classnames('mdl-card__supporting-text mdl-shadow--2dp', styles.cardDescription) }>
                          { item.desc }
                        </div>
                    );
                  }
                })()}
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
