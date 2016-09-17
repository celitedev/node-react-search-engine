import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import {connect} from 'redux-simple';
import _ from 'lodash';
import {MenuItem, FlatButton, IconMenu, Divider, FontIcon} from 'material-ui';
import {
  addCardToCollection,
  deleteCardFromCollection,
  toggleLoginModal,
  redirect,
  switchCreateCollectionDialog,
  toggleShareModal,
  toggleSnackbar
} from '../../actions';
import cookie from 'react-cookie';
import DeleteIcon from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import LoginPopover from '../Common/LoginPopover';
import Textfit from '../Common/Textfit';

const debug = require('debug')('app:card');

const SAVE_CARD_MSG = 'SAVE CARD';

function searchedCards(state) {
  const {savedCollectionInfo} = state.collection;
  const {authenticated, user} = state.auth;
  return {savedCollectionInfo, authenticated, user};
}

@connect(searchedCards, {
  addCardToCollection,
  deleteCardFromCollection,
  toggleLoginModal,
  redirect,
  switchCreateCollectionDialog,
  toggleShareModal,
  toggleSnackbar
})
export default class Card extends PureComponent {
  static contextTypes = {
    horizon: React.PropTypes.func
  };

  static defaultProps = {
    settings: {}
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      horizon: context.horizon,
      collections: [],
      showMenu: false
    };

    this.showCollectionsMenu = this.showCollectionsMenu.bind(this);
  }

  findCardById(id) {
    return _.find(this.props.savedCollectionInfo.cards, (card) => {
      return card.id === id;
    });
  }

  handleItemChange(open, reason) {
    this.setState({showMenu: open});
    debug(SAVE_CARD_MSG, open, reason);
  }

  findCardInCollection(collection) {
    const {data, toggleSnackbar} = this.props;
    const isCardInCollection = _.find(collection.cards, {id: data.raw.id});
    if (!isCardInCollection) {
      this.addCardToCollection(collection);
    } else {
      toggleSnackbar('Card already in collection');
      debug('Card already in collection');
    }
  }

  addCardToCollection(collection) {
    const {horizon} = this.state;
    const {user, data, toggleSnackbar} = this.props;
    const collections = horizon('collections');
    collections.upsert({
      ...collection, cards: [...collection.cards, {...data, id: data.raw.id}], userId: user.id
    }).subscribe(collection => {
        toggleSnackbar('Card saved to collection!');
        debug('Collection updated');
      },
      (err) => debug('Collection update error', err),
      () => {
        debug('Collection update finished');
      });
  }

  handleOpenMenu() {
    const {authenticated, toggleLoginModal, user} = this.props;
    if (!authenticated) {
      toggleLoginModal();
    } else {
      this.toggleCollectionsMenu();
    }
  }

  toggleCollectionsMenu() {
    const {user} = this.props;
    if (this.state.showMenu) {
      this.setState({showMenu: false});
    } else {
      this.loadCollections(user, this.showCollectionsMenu);
    }
  }

  loadCollections(user, callback) {
    const {horizon} = this.state;
    const collections = horizon('collections').findAll({userId: user.id}).fetch().subscribe(collections => {
      debug('User collections: ', collections);
      callback(collections);
    });
  }

  showCollectionsMenu(collections) {
    this.setState({
      collections,
      showMenu: true
    });
  }

  redirectToCard() {
    const {data, redirect, noLink} = this.props;
    if (!noLink) {
      redirect(`/details/${data.raw.id}`);
    }
  }

  toggleShareModal(card) {
    const {id, name} = card;
    const {toggleShareModal} = this.props;
    toggleShareModal(false, id, name);
  }

  cookieCardId() {
    debug('cookie card id:', cookie.load('saveCardId'));
    return cookie.load('saveCardId');
  }

  clearCookie() {
    cookie.remove('saveCardId', { path: '/' });
    debug('cookie card id:', cookie.load('saveCardId'));
  }

  handleCookie() {
    const {authenticated, data, user} = this.props;
    if (authenticated && this.cookieCardId() === data.raw.id) {
      this.loadCollections(user, this.showCollectionsMenu);
      this.clearCookie();
    }
  }

  //with internal redirects, authentication state is already known
  componentDidMount() {
    debug('at Did Mount:', this.props);
    this.handleCookie();
  }

  //if the user lands on this page due to a true redirect, authentication state is unknown until after the component is already mounted, then the component updates based on that information
  componentDidUpdate() {
    debug('at Did Update:', this.props);
    this.handleCookie();
  }

  render() {
    debug('at render:', this.props);
    const {
      type,
      className,
      authenticated,
      children,
      settings,
      data,
      bgImage,
      cardNumber,
      addCards,
      delteCardBtn,
      savedCollectionInfo,
      addCardToCollection,
      deleteCardFromCollection,
      switchCreateCollectionDialog,
      shareBtn
    } = this.props;
    const {collections} = this.state;
    const {formatted, raw} = data;
    const geo = settings.geo;
    const thumbnailUrl = require('../../images/cardthumbnail.png');
    const shareIconUrl = require('../../images/share.png');

    if (!data) {
      return null;
    }

    return (
      <div className={className}>
        <div className='js-cardAnchor'>
          {delteCardBtn && (
            <div className={classnames('mdl-card__menu', styles.deleteCardBtn)}>
              <IconButton tooltip='Delete card' touch={true} tooltipPosition='top-center'
                          onClick={() => deleteCardFromCollection(savedCollectionInfo.id, raw.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          )}
          {raw.image && !geo && (
            <div
              className={classnames('card--media showImageDetailClass showFallbackImageClass 1', {[styles.imgBackground]: !bgImage, [styles.image]: bgImage})}
              style={{backgroundImage: `url(${raw.image[0]})`}}>
            </div>
          )}
          {!raw.image && !geo && (
            <div
              className={classnames('card--media 2', styles.placeholder)}
              style={{'backgroundImage': `url(${thumbnailUrl})`}}>
            </div>
          )}
          <div onClick={::this.redirectToCard} className={classnames('card--inner', styles.background)}>
            <div className={classnames('card--contents', styles.cardContent)}>
              <div className={classnames('card--category', styles.formatedNumber, (settings.type === 'detail-card') && styles.kwhenGreen)}>
                {(cardNumber && raw.geo) && (
                  <span className={classnames('card--number')}>{cardNumber}</span>
                )}
                {formatted.category}
              </div>
              <div className={classnames('card--identifier', styles.cardIdentifier)}>
                <div className={styles.cardIdentifierWrapper}>
                  {(settings.identifiers1 && formatted.identifiers1) && (
                    <Textfit max={24} min={14} normalHeight={32} component='h2'>
                      {formatted.identifiers1}
                    </Textfit>
                  )}
                </div>
              </div>
              <div style={{'display': 'flex'}}>
                {((formatted.headsup1 || formatted.headsup2) || (settings.headsup1 || settings.headsup2)) && (
                  <div className='card--headsup headsupAccentBackgroundClass' style={{flex: 1}}>
                    {(formatted.headsup1 || settings.headsup1) && (
                      <div className='accent'>{formatted.headsup1}</div>
                    )}
                    {(formatted.headsup2 || settings.headsup2) && (
                      <div>{_.isArray(formatted.headsup2) ? formatted.headsup2.join(', ') : formatted.headsup2}</div>
                    )}
                  </div>
                )}

                {settings.type === 'detail-card' && settings.identifiers2 && formatted.identifiers2 && (
                  <div className='card--identifier--subtitle' style={{flex: 1}}>
                    {_.isArray(formatted.identifiers2) ? formatted.identifiers2.join(', ') : formatted.identifiers2}
                  </div>
                )}
              </div>

              {(settings.databits1 || settings.databits2) && (
                <div className='card--databits'>
                  {(formatted.databits1 || settings.databits1) && (
                    <div>{formatted.databits1}</div>
                  )}
                  {(formatted.databits2 || settings.databits2) && (
                    <ul className={styles.dataBits}>
                      {_.map(formatted.databits2, (databit, index) => (
                        <li key={index}>{databit}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) || null}
              {(formatted.whyshown || settings.whyshown) && (
                <div className='card--whyshown'>
                  <div>{formatted.whyshown}</div>
                </div>
              )}
            </div>
            {children}
          </div>
        </div>
        <div className={classnames('card--actions', styles.cardActions)}>
          {shareBtn && (
            <IconButton onTouchTap={() => ::this.toggleShareModal(raw)} name='shareCardBtn'
                        className={styles.saveCardBtn}>
              <img src={shareIconUrl} className={styles.imgBtn} />
            </IconButton>
          )}
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
            <div>
              {authenticated && (
                <IconMenu
                  iconButtonElement={
                    <IconButton onTouchTap={::this.handleOpenMenu} name='addCardBtn'
                                className={styles.saveCardBtn}>
                      {SAVE_CARD_MSG}
                    </IconButton>
                  }
                  onRequestChange={::this.handleItemChange}
                  open={this.state.showMenu}
                >
                  <MenuItem primaryText='Add to new collection' onClick={() => switchCreateCollectionDialog(raw.id)}/>
                  <Divider />
                  {collections.map((col, i) => {
                    return <MenuItem key={i} onClick={() => ::this.findCardInCollection(col)} primaryText={col.title}/>;
                  })}
                </IconMenu>
              ) || (
                <LoginPopover cardAction={true} cardId={raw.id} detailMessage='Sign in to save this card.'/>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
