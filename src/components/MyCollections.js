import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';

import 'material-design-icons';

export default class MyCollections extends PureComponent {

  render() {
    const {collections} = this.props;
    return (
      <ul className={styles.root + ' mdl-list'}>
        <div className='mdl-card__title'>
          <h2 className='mdl-card__title-text'>My collections</h2>
        </div>
        {collections.map((c) => (
        <li key={c.id} className='mdl-list__item'>
          <div className={classnames('mdl-card mdl-shadow--4dp', styles.root)}>
            <div className='mdl-card__title'>
              <h4 className='mdl-card__title-text'>{c.title}</h4>
            </div>
            {c.cards.map((card) => (
            <div key={card.id} className={classnames('mdl-card mdl-shadow--8dp', styles.cardList)}>
              <div className='mdl-card__title'>
                <h2 className={classnames('mdl-card__title-text', styles.cardInfo)}>{card.title}</h2>
              </div>
              <div className={styles.cardImage}>
                <img className={styles.cardImg} src='http://lorempixel.com/600/337/nature/'/>
              </div>
              <div className={classnames('mdl-card__supporting-text', styles.cardInfo)}>
                {card.description}
              </div>
            </div>
            ))}

          </div>
        </li>
        ))}
        <ul className={classnames('pagination', styles.pagination)}>
          <li className='mdl-button mdl-js-button mdl-button--icon'><a href='#!'>1</a></li>
          <li className='mdl-button mdl-js-button mdl-button--icon'><a href='#!'>2</a></li>
          <li className='mdl-button mdl-js-button mdl-button--icon'><a href='#!'>3</a></li>
        </ul>
      </ul>

    );
  }
}
