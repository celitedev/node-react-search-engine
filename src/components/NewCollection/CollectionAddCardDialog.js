import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {switchAddCardModal, switchPlaceholdersVisibility} from '../../actions';
import classnames from 'classnames';

import {Dialog, Button, DialogContent} from 'react-mdl';
import 'material-design-icons';

import CollectionCardSearch from './CollectionCardSearch';

function modal(state) {
  const {addCardModal} = state.collection;
  return {addCardModal};
}

@connect(modal, {switchAddCardModal, switchPlaceholdersVisibility})
export default class CollectionAddCardDialog extends PureComponent {

  showModal() {
    const {switchAddCardModal, switchPlaceholdersVisibility} = this.props;
    switchAddCardModal();
    switchPlaceholdersVisibility();
  }

  render() {
    const {addCardModal, switchAddCardModal} = this.props;
    return (
      <div className={styles.dialog}>
        <Dialog id='cardsDialogModal' open={addCardModal} className={styles.dialogBody}>
          <DialogContent className={styles.dialogTitle}>
            <h5>Add cards</h5>
            <Button className={styles.dialogClose} onClick={() => this.showModal()}>
              <span>&times;</span>
            </Button>
          </DialogContent>
          <DialogContent className={styles.dialogContent}>
            <CollectionCardSearch />
          </DialogContent>
          <DialogContent className={styles.dialogFooter}>

            <Button className={classnames('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect')}
                    onClick={() => this.showModal()}>
              Done
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
