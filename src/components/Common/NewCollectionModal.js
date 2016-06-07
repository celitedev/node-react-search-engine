import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {Dialog, RaisedButton, FlatButton, TextField} from 'material-ui';
import {toggleLoginModal, switchCreateCollectionDialog} from '../../actions';
import {login} from '../../horizon';

const debug = require('debug')('app:loginModal');

function createCollectionnModal(state) {
  const {createCollectionModal, cardId} = state.collection;
  const {user} = state.auth;
  return {createCollectionModal, cardId, user};
}

@connect(createCollectionnModal, {switchCreateCollectionDialog})
export default class NewCollectionModal extends PureComponent {
  static contextTypes = {
    horizon: React.PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      title: '',
      valid: false,
      horizon: context.horizon
    };
  }
  handleCloseDialog() {
    const {switchCreateCollectionDialog} = this.props;
    switchCreateCollectionDialog();
    debug('Close createCollection dialog');
  }

  handleChange(e) {
    this.setState({
      title: e.target.value,
      valid: e.target.value ? true : false
    });
  }

  createCollection() {
    const {horizon, title} = this.state;
    const {cardId, user} = this.props;
    const collections = horizon('collections');
    collections.store({
      title, cards: [{id: cardId}], userId: user.id
    }).subscribe(collection => {
      debug('Collection created');
    },
    (err) => debug('Collection create error', err),
    () => {
      debug('Collection create finished');
      this.handleCloseDialog();
    });
  }

  render() {
    const {createCollectionModal} = this.props;
    const {valid} = this.state;
    const actions = [
      <FlatButton
        label='Submit'
        disabled={!valid}
        secondary={true}
        onTouchTap={::this.createCollection}
      />,
      <FlatButton
        label='Cancel'
        primary={true}
        onTouchTap={::this.handleCloseDialog}
      />
    ];

    return (
      <Dialog
          titleClassName={styles.dialogTitle}
          title='New collection'
          modal={false}
          actions={actions}
          open={createCollectionModal}
          onRequestClose={::this.handleCloseDialog}
        >
        <TextField
          hintText='New collection title'
          errorText={!valid && 'This value is required'}
          fullWidth={true}
          onChange={::this.handleChange}
        />
      </Dialog>
    );
  }
}
