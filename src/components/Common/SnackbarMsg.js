import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {Snackbar} from 'material-ui';
import {toggleSnackbar} from '../../actions';

const debug = require('debug')('app:Snackbar');

function getSnackbar(state) {
  const {snackbar, msg, error} = state.common;
  return {snackbar, msg, error};
}

@connect(getSnackbar, {toggleSnackbar})
export default class SnackbarMsg extends PureComponent {

  handleRequestClose() {
    const {toggleSnackbar} = this.props;
    toggleSnackbar();
    debug('Close share  dialog');
  }

  render() {
    const {msg, snackbar, error} = this.props;
    const message = msg || '';
    return (
      <Snackbar
        open={snackbar}
        message={message}
        autoHideDuration={5000}
        onRequestClose={::this.handleRequestClose}
        className={error ? styles.snackBarError : styles.snackBarSuccess}
      />
    );
  }
}
