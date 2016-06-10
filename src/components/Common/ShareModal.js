import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {Dialog, FlatButton, TextField} from 'material-ui';
import {toggleShareModal} from '../../actions';

const debug = require('debug')('app:loginModal');

function getLoginModal(state) {
  const {shareCardModal} = state.card;
  return {shareCardModal};
}

@connect(getLoginModal, {toggleShareModal})
export default class ShareModal extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      from: '',
      to: '',
      msg: '',
      fromValid: false,
      toValid: false
    };
  }
  handleCloseDialog() {
    const {toggleShareModal} = this.props;
    this.setState({
      from: '',
      to: '',
      msg: '',
      fromValid: false,
      toValid: false
    }, () => toggleShareModal());
    debug('Close share  dialog');
  }

  handleChange(e, target) {
    this.setState({
      [target]: e.target.value,
      [target + 'Valid']: e.target.value ? true : false
    });
  }

  render() {
    const {shareCardModal} = this.props;
    const {fromValid, toValid} = this.state;
    const actions = [
      <FlatButton
        label='Share'
        secondary={true}
        disabled={!(toValid && fromValid)}
        onTouchTap={::this.handleCloseDialog}
        type='submit'
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
          title='Share card'
          modal={false}
          actions={actions}
          open={shareCardModal}
          onRequestClose={::this.handleCloseDialog}
        >
        <TextField
          floatingLabelText='From'
          errorText={!fromValid && 'This value is required'}
          fullWidth={true}
          onChange={(e) => ::this.handleChange(e, 'from')}
          type='email'
        />
        <TextField
          floatingLabelText='To'
          errorText={!toValid && 'This value is required'}
          fullWidth={true}
          onChange={(e) => ::this.handleChange(e, 'to')}
          type='email'
        />
        <TextField
          fullWidth={true}
          floatingLabelText='Message'
          onChange={(e) => ::this.handleChange(e, 'msg')}
          multiLine={true}
        />
      </Dialog>
    );
  }
}
