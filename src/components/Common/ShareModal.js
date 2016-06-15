import React, {Component} from 'react';
import {pure, compose} from 'recompose';
import autobind from 'autobind-decorator';
import {connect} from 'redux-simple';
import {Dialog, FlatButton, TextField} from 'material-ui';
import {toggleShareModal, share, toggleSnackbar} from '../../actions';

const debug = require('debug')('app:loginModal');

function getLoginModal(state) {
  const {shareCardModal, collection, id} = state.card;
  return {shareCardModal, collection, id};
}

const encance = compose(
  connect(getLoginModal, {toggleShareModal, share, toggleSnackbar}),
  pure
);

@encance
export default class ShareModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      from: '',
      to: '',
      msg: '',
      fromNameValid: true,
      toValid: true
    };
  }

  async shareData(data) {
    const {share, toggleSnackbar} = this.props;
    try {
      const shareResponse = await share(data);
      if (shareResponse.rejected) {
        toggleSnackbar('Error');
      } else {
        toggleSnackbar('Kwhen told your friends!');
      }
    } catch (err) {
      const errors = await err.response.json();
      toggleSnackbar(`Error: field '${errors[0].param.toUpperCase()}' ${errors[0].msg}`, true);
      debug('Share error: ', errors);
    }
  }

  @autobind
  handleCloseDialog() {
    const {toggleShareModal} = this.props;
    this.setState({
      fromName: '',
      to: '',
      msg: '',
      fromNameValid: true,
      toValid: true
    }, () => toggleShareModal());
    debug('Close share  dialog');
  }

  validate() {
    const {fromName, to} = this.state;
    if (!fromName) {
      this.setState({
        'fromNameValid': false
      });
      return false;
    } else if (!to) {
      this.setState({
        'toValid': false
      });
      return false;
    }
    return true;
  }

  @autobind
  submit() {
    if (!this.validate()) return;
    const {fromName, to, msg} = this.state;
    const {collection, id} = this.props;
    this.shareData({fromName, to, msg, type: collection ? 'collection' : 'card', shareType: 'email', id});
    this.handleCloseDialog();
  }

  @autobind
  handleChange(e, target) {
    this.setState({
      [target]: e.target.value,
      [target + 'Valid']: e.target.value ? true : false
    });
  }

  render() {
    const {shareCardModal, collection} = this.props;
    const {fromNameValid, toValid} = this.state;
    const actions = [
      <FlatButton
        label='Share'
        secondary={true}
        onTouchTap={this.submit}
        type='submit'
      />,
      <FlatButton
        label='Cancel'
        primary={true}
        onTouchTap={this.handleCloseDialog}
      />
    ];

    return (
      <Dialog
          titleClassName={styles.dialogTitle}
          title={collection ? 'Share collection' : 'Share card'}
          modal={false}
          actions={actions}
          open={shareCardModal}
          onRequestClose={this.handleCloseDialog}
        >
        <TextField
          floatingLabelText='Your name'
          errorText={!fromNameValid && 'This value is required'}
          fullWidth={true}
          onChange={(e) => this.handleChange(e, 'fromName')}
          type='email'
        />
        <TextField
          floatingLabelText='Email to send to (use ";" to separate multiple emails)'
          errorText={!toValid && 'This value is required'}
          fullWidth={true}
          onChange={(e) => this.handleChange(e, 'to')}
          type='email'
        />
        <TextField
          fullWidth={true}
          floatingLabelText='Body of email (optional)'
          onChange={(e) => this.handleChange(e, 'msg')}
          multiLine={true}
        />
      </Dialog>
    );
  }
}
