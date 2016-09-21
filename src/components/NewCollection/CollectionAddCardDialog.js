import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {switchAddCardModal, switchPlaceholdersVisibility} from '../../actions';

import {Dialog, RaisedButton} from 'material-ui';

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
      <RaisedButton
        label='Done'
        labelColor='#1c7ae5'
        backgroundColor='#fff'
        labelStyle={{'fontWeight': '600'}}
        onTouchTap={() => this.showModal()}
        className={styles.doneBtn}
      />
    ];
    return (
      <div className={styles.dialog}>
        <Dialog
          title={<div><h3>Add Card</h3><span>Add one or multiple cards by searching below</span></div>}
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
