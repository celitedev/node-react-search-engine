import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import {switchPlaceholdersVisibility, saveCollectionInfo, saveCollection, redirect, resetCollectionInfo, toggleShareModal} from '../../actions';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import ArrowRightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import {RaisedButton, Toggle} from 'material-ui';
import {isEqual} from 'lodash';

const debug = require('debug')('app:collections:new');

function collection(state) {
  const {user} = state.auth;
  const {showPlaceholders, savedCollectionInfo} = state.collection;
  return {showPlaceholders, savedCollectionInfo, user};
}

@connect(collection, {switchPlaceholdersVisibility, saveCollectionInfo, saveCollection, redirect, resetCollectionInfo, toggleShareModal})
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

  saveCollection() {
    debug('saveCollection start', this.props.savedCollectionInfo);
    if (!this.validateCollection()) {
      const {horizon} = this.state;
      const {savedCollectionInfo, user} = this.props;
      debug('Collection valid');
      const collections = horizon('collections');
      const cards = savedCollectionInfo.cards.map((card) => {
        const {id, description} = card;
        return {id, description};
      });
      collections.upsert({
        ...savedCollectionInfo, cards, userId: user.id
      }).subscribe(collection => {
        debug('Collection updeted');
        this.props.redirect('/mycollections');
      },
      (err) => debug('Collection update error', err),
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

  render() {
    const {savedCollectionInfo, showPlaceholders, switchPlaceholdersVisibility, resetCollectionInfo} = this.props;
    const {collectionInfoChanged} = this.state;
    const {title} = savedCollectionInfo;
    const label = this.validateCollection() ? 'Collection needs title, and at least 1 card' : 'Collection is valid';
    return (
      <div className='mdl-grid'>
        <div className={classnames('mdl-cell mdl-cell--12-col', styles.root)}>
          <nav className={classnames('mdl-navigation', styles.breadcrumbs)}>
            <Link to='/mycollections' onClick={resetCollectionInfo}>
              My Collections
            </Link>
            <ArrowRightIcon />
            <span className={styles.myColName}>{title}</span>
            <span
              className={classnames('mdl-cell--hide-phone', styles.rightSide, this.validateCollection())}>
              {label}
            </span>
          </nav>
          <div className={styles.floatLeft}>
            <h6>Settings</h6>
            <div>
              <RaisedButton
                label='Share'
                onClick={() => ::this.toggleShareModal()}
              />
              <RaisedButton
                className={styles.saveCollection}
                label='Save'
                labelColor={collectionInfoChanged ? '#fff' : '#000'}
                backgroundColor={collectionInfoChanged ? '#00cd75' : '#fff' }
                disabled={this.validateCollection()}
                onClick={::this.saveCollection}
              />
            </div>
          </div>
          <div className={styles.floatRight}>
            <h6>Placeholders</h6>
            <div className={styles.floatRight}>
              <Toggle
                defaultToggled={showPlaceholders}
                onToggle={switchPlaceholdersVisibility}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
