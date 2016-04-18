import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import { switchPlaceholdersVisibility, saveCollectionInfo } from '../../actions';
import { connect } from 'redux-simple';

import { Textfield } from 'react-mdl';
import 'material-design-icons';

function collection(state) {
  const { showPlaceholders, savedCollectionInfo } = state.collection;
  return { showPlaceholders, savedCollectionInfo };
}

@connect(collection, { switchPlaceholdersVisibility, saveCollectionInfo })
export default class NewCollectionHeader extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      name: props.savedCollectionInfo.name
    };
  }

  saveCollectionName(e) {
    this.setState({
      name: e.target.value
    });
    this.props.saveCollectionInfo({...this.props.savedCollectionInfo, name: e.target.value});
  }

  validateCollection(e) {
    const col = this.props.savedCollectionInfo;
    if (col.name && col.title) {
      this.props.switchPlaceholdersVisibility();
    } else {
      e.preventDefault();
    }
  }

  render() {
    const { savedCollectionInfo, showPlaceholders, switchPlaceholdersVisibility } = this.props;
    const { name } = this.state;
    const label = showPlaceholders ? 'Collection needs a name, title, description and at least 2 cards' : 'Collection is valid';
    return (
      <div className='mdl-grid'>
        <div className={classnames('mdl-cell mdl-cell--12-col', styles.root)}>
          <nav className={classnames('mdl-navigation', styles.breadcrumbs)}>
            <a className='' href='' ref='name'>My Collections </a>
            <i className={classnames('material-icons', styles.materialIconSmall)}>navigate_next</i>
            { showPlaceholders ?
              <Textfield label='My collection name' className={!savedCollectionInfo.name ? styles.myColNameEdit : styles.myColNameFilled} value={savedCollectionInfo.name} onChange={::this.saveCollectionName}/>
              : <span className={styles.myColName}>{name}</span>
            }
            <span className={classnames('mdl-cell--hide-phone', styles.rightSide, showPlaceholders ? styles.error : styles.accept)}>
              {label}
            </span>
          </nav>
          <div className={styles.floatLeft}>
            <h6>Settings</h6>
            <div>
              <button className='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect'>
                Share
              </button>
              <button className='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect'>
                Publish
              </button>
            </div>
          </div>
          <div className={styles.floatRight}>
            <h6>Placeholders</h6>
            <div className={styles.floatRight}>
              <label className='mdl-switch mdl-js-switch mdl-js-ripple-effect' >
                <input type='checkbox' id='placeholders' defaultChecked className='mdl-switch__input' value={showPlaceholders} onClick={::this.validateCollection} />
                <span className='mdl-switch__label'></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}