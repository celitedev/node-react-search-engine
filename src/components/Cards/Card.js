import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import {connect} from 'redux-simple';
import _ from 'lodash';
import {Paper, Menu, MenuItem, FlatButton, IconMenu, Divider} from 'material-ui';
import {addCardToCollection, deleteCardFromCollection, toggleLoginModal, redirect, switchCreateCollectionDialog} from '../../actions';
import DeleteIcon from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import LoginPopover from '../Common/LoginPopover';

const debug = require('debug')('app:card');

function searchedCards(state) {
  const {savedCollectionInfo} = state.collection;
  const {authenticated, user} = state.auth;
  return {savedCollectionInfo, authenticated, user};
}

@connect(searchedCards, {addCardToCollection, deleteCardFromCollection, toggleLoginModal, redirect, switchCreateCollectionDialog})
export default class Card extends PureComponent {
  static contextTypes = {
    horizon: React.PropTypes.func
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      addCardToColMenu: false,
      horizon: context.horizon,
      collections: []
    };
  }

  findCardById(id) {
    return _.find(this.props.savedCollectionInfo.cards, (card) => {
      return card.raw.id === id;
    });
  }

  handleItemChange(open, reason) {
    debug('Add to collection', open, reason);
  }

  findCardInCollection(collection) {
    const {data} = this.props;
    const isCardInCollection = _.find(collection.cards, {id: data.raw.id});
    if (!isCardInCollection) {
      this.addCardToCollection(collection);
    } else {
      debug('Card already in collection');
    }
  }

  addCardToCollection(collection) {
    const {horizon} = this.state;
    const {user, data} = this.props;
    const collections = horizon('collections');
    collections.upsert({
      ...collection, cards: [...collection.cards, {...data, id: data.raw.id}], userId: user.id
    }).subscribe(collection => {
      debug('Collection updeted');
    },
    (err) => debug('Collection update error', err),
    () => {
      debug('Collection update finished');
    });
  }

  handleOpenMenu(e) {
    const {authenticated, toggleLoginModal, user} = this.props;
    if (!authenticated) {
      toggleLoginModal();
    } else {
      const {addCardToColMenu, horizon} = this.state;
      const collections = horizon('collections').findAll({userId: user.id}).fetch().subscribe(collections => {
        debug('User collections: ', collections);
        this.setState({
          collections,
          addCardToColMenu: !addCardToColMenu
        });
      });
    }
  }

  redirectToCard() {
    const {data, redirect, question} = this.props;
    redirect(`/details/${data.raw.id}`);
  }

  render() {
    const {className,
            authenticated,
            toggleLoginModal,
            children,
            data = [],
            bgImage,
            cardNumber,
            addCards,
            delteCardBtn,
            savedCollectionInfo,
            addCardToCollection,
            deleteCardFromCollection,
            switchCreateCollectionDialog
          } = this.props;
    const {addCardToColMenu, collections} = this.state;
    const {formatted, raw} = data;
    return (
      <div className={className}>
        <div className='js-cardAnchor'>
          {delteCardBtn && (
          <div className={classnames('mdl-card__menu', styles.deleteCardBtn)}>
            <IconButton tooltip='Delete card' touch={true} tooltipPosition='top-center' onClick={() => deleteCardFromCollection(savedCollectionInfo.id, raw.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
          )}
          {raw.image && (
          <div
            className={classnames('card--media showImageDetailClass showFallbackImageClass', {[styles.imgBackground]: !bgImage, [styles.image]: bgImage})}
            style={{backgroundImage: `url(${raw.image[0]})`}}>
          </div>
          )}
          <div onClick={::this.redirectToCard} className={classnames('card--inner', styles.background)}>
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
            {authenticated && (
              <IconMenu
              iconButtonElement={<FlatButton onTouchTap={::this.handleOpenMenu} label='Add to collection' />}
              onRequestChange={::this.handleItemChange}
              open={authenticated && null}
              >
              <MenuItem primaryText='Add to new collection' onClick={() => switchCreateCollectionDialog(raw.id)}/>
              <Divider />
              {collections.map((col, i) => {
                return <MenuItem key={i} onClick={() => ::this.findCardInCollection(col)} primaryText={col.title} />;
              })}
              </IconMenu>
            ) || (
              <nav className='mdl-navigation'>
                <LoginPopover cardAction={true}/>
              </nav>
            )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
