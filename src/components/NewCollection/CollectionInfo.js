import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import { connect } from 'redux-simple';

import { Grid, Cell } from 'react-mdl';
import 'material-design-icons';

function collectionPlaceholders(state) {
  const { savedCollectionInfo } = state.collection;
  return { savedCollectionInfo };
}

@connect(collectionPlaceholders)
export default class CollectionInfo extends PureComponent {
  render() {
    const { savedCollectionInfo } = this.props;
    return (
      <Grid className={styles.root}>
        <Cell col={7} className={styles.info}>
          <h3>{savedCollectionInfo.title}</h3>
        </Cell>
        <Cell col={7} className={styles.info}>
          <h5>{savedCollectionInfo.subTitle}</h5>
        </Cell>
        {savedCollectionInfo.img ?
          <Cell col={7} className={styles.info}>
            <div className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col')}>
              <img className={styles.colImage} src={savedCollectionInfo.img.preview}/>
            </div>
          </Cell>
        : null}
        <Cell col={7} className={styles.info}>
          <p>{savedCollectionInfo.description}</p>
        </Cell>
      </Grid>
    );
  }
}
