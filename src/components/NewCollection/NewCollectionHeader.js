import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import {switchPlaceholdersVisibility, saveCollectionInfo, saveCollection, redirect, resetCollectionInfo} from '../../actions';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import MediumEditor from 'react-medium-editor';
import 'material-design-icons';

const debug = require('debug')('app:collections:new');

function collection(state) {
  const {user} = state.auth;
  const {showPlaceholders, savedCollectionInfo} = state.collection;
  return {showPlaceholders, savedCollectionInfo, user};
}

@connect(collection, {switchPlaceholdersVisibility, saveCollectionInfo, saveCollection, redirect, resetCollectionInfo})
export default class NewCollectionHeader extends PureComponent {
  static contextTypes = {
    horizon: React.PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      name: props.savedCollectionInfo.name,
      horizon: context.horizon
    };

    debug('constructor', props, context, this.state);
  }

  saveCollectionName(name) {
    this.setState({
      name: name
    });
    this.props.saveCollectionInfo({...this.props.savedCollectionInfo, name});
  }

  validateCollection() {
    const col = this.props.savedCollectionInfo;
    return !(col.name && col.title && col.description && col.cards.length > 1);
  }

  saveCollection() {
    debug('saveCollection start', this.props.savedCollectionInfo);
    if (!this.validateCollection()) {
      const {horizon} = this.state;
      const {savedCollectionInfo, user} = this.props;
      debug('Collection valid');
      const collections = horizon('collections');
      collections.upsert({
        ...savedCollectionInfo, userId: user.id
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

  render() {
    const {savedCollectionInfo, showPlaceholders, switchPlaceholdersVisibility, resetCollectionInfo} = this.props;
    const {name} = this.state;
    const label = this.validateCollection() ? 'Collection needs a name, title, description and at least 2 cards' : 'Collection is valid';
    return (
      <div className='mdl-grid'>
        <div className={classnames('mdl-cell mdl-cell--12-col', styles.root)}>
          <nav className={classnames('mdl-navigation', styles.breadcrumbs)}>
            <Link to='/mycollections' onClick={resetCollectionInfo}>
              My Collections
            </Link>
            <i className={classnames('material-icons', styles.materialIconSmall)}>navigate_next</i>
            {savedCollectionInfo && (
              <MediumEditor
                className={styles.mediumEdit}
                tag='p'
                text={name}
                onChange={::this.saveCollectionName}
                options={{
                  toolbar: {buttons: ['bold', 'italic', 'underline']},
                  placeholder: {
                    text: 'Collection name',
                    hideOnClick: true
                  }}}
              />
            ) || (
              <span className={styles.myColName}>{name}</span>
            )}
            <span
              className={classnames('mdl-cell--hide-phone', styles.rightSide, this.validateCollection() ? styles.error : styles.accept)}>
              {label}
            </span>
          </nav>
          <div className={styles.floatLeft}>
            <h6>Settings</h6>
            <div>
              <button className='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect'>
                Share
              </button>
              <button className='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect'
                      disabled={this.validateCollection()} onClick={::this.saveCollection}>
                Publish
              </button>
            </div>
          </div>
          <div className={styles.floatRight}>
            <h6>Placeholders</h6>
            <div className={styles.floatRight}>
              <label className='mdl-switch mdl-js-switch'>
                <input type='checkbox' id='placeholders' defaultChecked className='mdl-switch__input'
                       value={showPlaceholders} onClick={switchPlaceholdersVisibility}/>
                <span className='mdl-switch__label'></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
