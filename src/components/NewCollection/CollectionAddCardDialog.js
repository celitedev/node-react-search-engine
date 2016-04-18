import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import { connect } from 'redux-simple';
import { switchAddCardModal } from '../../actions';
import classnames from 'classnames';

import {Dialog, DialogTitle, Button, DialogActions, DialogContent} from 'react-mdl';
import 'material-design-icons';

import CollectionCardSearch from './CollectionCardSearch';

function modal(state) {
  const { addCardModal } = state.collection;
  return { addCardModal };
}

@connect(modal, { switchAddCardModal })
export default class CollectionAddCardDialog extends PureComponent {

  render() {
    const { addCardModal, switchAddCardModal } = this.props;
    return (
      <Dialog open={addCardModal} className={styles.root}>
        <DialogTitle className={styles.title}>
          Add card
        </DialogTitle>
        <DialogContent className={styles.dilogContainer}>
          <CollectionCardSearch />
        </DialogContent>
        <DialogActions >
          <Button className={classnames('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect')} onClick={switchAddCardModal}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
