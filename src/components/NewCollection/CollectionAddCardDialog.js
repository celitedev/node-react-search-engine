import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {switchAddCardModal, switchPlaceholdersVisibility} from '../../actions';
import classnames from 'classnames';

import {Dialog, FlatButton, RaisedButton} from 'material-ui';

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
    const actions = [
      <FlatButton
        label='Done'
        primary={true}
        onTouchTap={() => this.showModal()}
      />
    ];
    return (
      <div className={styles.dialog}>
        <Dialog
          title='Add cards'
          actions={actions}
          modal={false}
          open={addCardModal}
          onRequestClose={() => this.showModal()}
          autoScrollBodyContent={true}
          autoDetectWindowHeight={false}
          className={styles.dialog}
          titleClassName={styles.dialogTitle}
          bodyClassName={styles.dialogBody}
          actionsContainerClassName={styles.dialogActionsBar}
        >
          <CollectionCardSearch />
        </Dialog>
      </div>
    );
  }
}
