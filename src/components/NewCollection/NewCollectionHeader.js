import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import {switchPlaceholdersVisibility,
  saveCollectionInfo,
  saveCollection,
  redirect,
  resetCollectionInfo,
  toggleEditCollection,
  toggleShareModal,
  toggleSnackbar} from '../../actions';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import ArrowRightIcon from 'material-ui/svg-icons/navigation/chevron-right';
import {RaisedButton, Toggle} from 'material-ui';
import {isEqual} from 'lodash';

const debug = require('debug')('app:collections:new');

function collection(state) {
  const {user} = state.auth;
  const {showPlaceholders, savedCollectionInfo, editCollection} = state.collection;
  return {showPlaceholders, savedCollectionInfo, editCollection, user};
}

@connect(collection, {switchPlaceholdersVisibility, saveCollectionInfo, saveCollection, redirect, resetCollectionInfo, toggleShareModal, toggleEditCollection, toggleSnackbar})
export default class NewCollectionHeader extends PureComponent {
  static contextTypes = {
    horizon: React.PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      title: props.savedCollectionInfo.title,
      horizon: context.horizon
    };

    debug('constructor', props, context, this.state);
  }

  validateCollection() {
    const col = this.props.savedCollectionInfo;
    return !(col.title && col.cards.length);
  }

  checkValidation() {
    return this.validateCollection() ? styles.invalidCollection : '';
  }

  saveCollection() {
    debug('saveCollection start', this.props.savedCollectionInfo);
    if (!this.validateCollection()) {
      const {horizon} = this.state;
      const {savedCollectionInfo, user, toggleSnackbar} = this.props;
      debug('Collection valid');
      const collections = horizon('collections');
      const cards = savedCollectionInfo.cards.map((card) => {
        const {id, description} = card;
        return {id, description};
      });
      collections.upsert({
        ...savedCollectionInfo, cards, userId: user.id
      }).subscribe(collection => {
        if (!this.props.savedCollectionInfo.id) {
          this.props.savedCollectionInfo.id = collection.id;
        }
        this.setState({collectionInfoChanged: false});
        debug('Collection updated');
        toggleSnackbar('Collection successfully updated');
      },
      (err) => {
        debug('Collection update error', err);
        toggleSnackbar('Collection update error', err);
      },
      () => {
        debug('Collection update finished', collection);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.savedCollectionInfo, this.props.savedCollectionInfo)) {
      this.setState({collectionInfoChanged: true});
    }
  }

  toggleShareModal() {
    const {toggleShareModal, savedCollectionInfo} = this.props;
    toggleShareModal(true, savedCollectionInfo.id, savedCollectionInfo.title);
  }

  togglePlaceholdersVisibility() {
    const {showPlaceholders, switchPlaceholdersVisibility, toggleEditCollection, editCollection} = this.props;

    toggleEditCollection(!editCollection);
    switchPlaceholdersVisibility();
  }

  render() {
    const {savedCollectionInfo, showPlaceholders, switchPlaceholdersVisibility, resetCollectionInfo, editCollection} = this.props;
    const {collectionInfoChanged} = this.state;
    const {title} = savedCollectionInfo;
    const label = this.validateCollection() ? 'Collection needs title, and at least 1 card' : 'Collection is valid';
    return (
      <div>
        <div className={styles.header} >
          <div className={styles.buttonsGroup}>
            <RaisedButton
              className={styles.saveCollection}
              labelStyle={{'fontSize': '12px', 'fontWeight': 'bold'}}
              label='Save Collection'
              labelColor={collectionInfoChanged ? '#fff' : '#1c7ae5'}
              backgroundColor={collectionInfoChanged ? '#00cd75' : '#fff' }
              disabled={this.validateCollection()}
              onClick={::this.saveCollection}
            />
            <RaisedButton
              className={styles.shareCollection}
              label='Share Collection'
              labelColor='#1c7ae5'
              labelStyle={{'fontSize': '12px', 'fontWeight': 'bold'}}
              onClick={() => ::this.toggleShareModal()}
            />
          </div>
          <div className={styles.toggleGroup}>
            <Toggle
              label='View Mode'
              labelStyle={{'color': '#ffffff', 'fontSize': '22px', 'fontWeight': '600', 'marginTop': '7px'}}
              style={{'color': '#ffffff'}}
              defaultToggled={editCollection ? false : true}
              trackStyle={{'height': '30px', 'width': '70px'}}
              thumbStyle={{'height': '36px', 'width': '36px'}}
              inputStyle={{'width': '190px'}}
              onToggle={() => ::this.togglePlaceholdersVisibility()}
            />
          </div>
        </div>
        <div className='mdl-grid'>
          <div className={classnames('mdl-cell mdl-cell--12-col', styles.root)}>
            <nav className={classnames('mdl-navigation', styles.breadcrumbs)}>
              <Link onlyActiveOnIndex={false} to='/mycollections' onClick={resetCollectionInfo}>
                My Collections
              </Link>
              <ArrowRightIcon className={styles.navArrow} />
              <span className={styles.myColName}>{title}</span>
              <span
                className={classnames('mdl-cell--hide-phone', styles.rightSide, this.checkValidation())}>
                {label}
              </span>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}
