import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import { switchPlaceholdersVisibility } from '../../actions';
import { connect } from 'redux-simple';

import 'material-design-icons';

function collectionPlaceholders(state) {
  const { showPlaceholders } = state.collection;
  return { showPlaceholders };
}

@connect(collectionPlaceholders, { switchPlaceholdersVisibility })
export default class NewCollectionHeader extends PureComponent {
  render() {
    const { collections, placeholders, showPlaceholders } = this.props;
    return (
      <div className='mdl-grid'>
        <div className={classnames('mdl-cell mdl-cell--12-col', styles.root)}>
          <nav className={classnames('mdl-navigation', styles.breadcrumbs)}>
            <a className='' href='' ref='name'>My Collections </a>
            <i className={classnames('material-icons', styles.materialIconSmall)}>navigate_next</i>
            <span className={styles.myColName}>My collection name</span>
            <span className={classnames('mdl-cell--hide-phone', styles.rightSide, placeholders ? styles.error : styles.accept)}>
              Collection needs a name, title, description and at least 2 cards
            </span>
          </nav>
          <div className={styles.floatLeft}>
            <h6>Settings</h6>
            <div>
              <button className='mdl-button mdl-js-button mdl-button--raised'>
                Share
              </button>
              <button className='mdl-button mdl-js-button mdl-button--raised'>
                Publish
              </button>
            </div>
          </div>
          <div className={styles.floatRight}>
            <h6>Placeholders</h6>
            <div className={styles.floatRight}>
              <label className='mdl-switch mdl-js-switch mdl-js-ripple-effect' >
                <input type='checkbox' id='placeholders' className='mdl-switch__input' onClick={switchPlaceholdersVisibility} value={ showPlaceholders } />
                <span className='mdl-switch__label'></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
