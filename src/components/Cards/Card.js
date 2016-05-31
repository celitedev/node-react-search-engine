import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import {connect} from 'redux-simple';
import _ from 'lodash';
import {Button} from 'react-mdl';
import {addCardToCollection, deleteCardFromCollection} from '../../actions';

function searchedCards(state) {
  const {savedCollectionInfo} = state.collection;
  return {savedCollectionInfo};
}

@connect(searchedCards, {addCardToCollection, deleteCardFromCollection})
export default class Card extends PureComponent {
  constructor(props, context) {
    super(props, context);
  }

  findCardById(id) {
    return _.find(this.props.savedCollectionInfo.cards, (card) => {
      return card.raw.id === id;
    });
  }
  render() {
    const {className, children, data = [], bgImage, cardNumber, addCards, delteCardBtn, savedCollectionInfo, addCardToCollection, deleteCardFromCollection} = this.props;
    const {formatted, raw} = data;
    return (
      <div className={className}>
        <div className='js-cardAnchor'>
          {delteCardBtn && (
          <div className={classnames('mdl-card__menu', styles.deleteCardBtn)}>
            <button className='mdl-button mdl-js-button mdl-button--raised mdl-button--accent'
                    onClick={() => deleteCardFromCollection(savedCollectionInfo.id, raw.id)}>
              <i className='material-icons'>delete</i>
            </button>
          </div>
          )}
          <div
            className={classnames('card--media showImageDetailClass showFallbackImageClass', {[styles.imgBackground]: !bgImage, [styles.image]: bgImage})}
            style={{backgroundImage: `url(${raw.image[0]})`}}></div>
          <div className={classnames('card--inner', styles.background)}>
            <div className={classnames('card--contents', styles.cardContent)}>
              <div className={classnames('card--category hideCategoryClass', styles.formatedNumber)}>
                {cardNumber && (
                  <span className={classnames('card--number hideNumberClass')}>{cardNumber}</span>
                )}
                {formatted.category}
              </div>
              <div className='card--identifier'>
                <h2 className='card--identifier--title hideIdentifier1Class'><span>{formatted.identifiers1}</span></h2>
                { formatted.identifiers2 && (
                  <div className='card--identifier--subtitle hideIdentifier2Class'>
                      {_.isArray(formatted.identifiers2) ? formatted.identifiers2.join(', ') : formatted.identifiers2}
                  </div>
                )}
              </div>
              {(formatted.headsup1 || formatted.headsup2) && (
                <div className='card--headsup headsupAccentBackgroundClass hideHeadsupTotalClass'>
                  {formatted.headsup1 && (
                    <div className='accent hideHeadsup1Class'>{formatted.headsup1}</div>
                  )}
                  {formatted.headsup2 && (
                    <div className='hideHeadsup2Class'>{_.isArray(formatted.headsup2) ? formatted.headsup2.join(', ') : formatted.headsup2}</div>
                  )}
                </div>
              )}
              {formatted.databits1 && (
                <div className='card--databits hideDatabitsTotalClass'>
                  <div className='hideDatabits1Class'>{formatted.databits1}</div>
                  <ul className='hideDatabits2Class'>
                    {formatted.databits2.map((databit, index) => (
                      <li key={index}>{databit}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className='card--whyshown hideWhyshownClass'>
                <div>{formatted.whyshown}</div>
              </div>
            </div>
            {children}
          </div>
        </div>
        <div className='card--actions'>
          {addCards && (
              ::this.findCardById(raw.id) && (
                <button
                  className='mdl-button mdl-button--colored mdl-button--accent'
                  onClick={() => deleteCardFromCollection(::this.findCardById(raw.id).collectionId, raw.id)}
                >
                  Remove card
                </button>
              ) || (
                <button className='mdl-button mdl-button--colored button--colored'
                  onClick={() => addCardToCollection(savedCollectionInfo.id, data)}
                >
                  Add card
                </button>
              )
          ) || (
            <div className='js-overflowCheck'>
              <button className='mdl-button mdl-button--colored'>Get Directions</button>
              <button className='mdl-button mdl-button--colored'>Manage Reservation</button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
