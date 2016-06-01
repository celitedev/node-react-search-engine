import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
//import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from 'react-mdl';
import {Dialog, RaisedButton, FlatButton} from 'material-ui';
import {toggleLoginModal} from '../../actions';
import {login} from '../../horizon';

const debug = require('debug')('app:loginModal');

function getLoginModal(state) {
  const {loginModal} = state.auth;
  return {loginModal};
}

@connect(getLoginModal, {toggleLoginModal})
export default class LoginModal extends PureComponent {
  constructor(props, context) {
    super(props, context);
  }
  handleCloseDialog() {
    const {toggleLoginModal} = this.props;
    toggleLoginModal();
    debug('Close login  dialog');
  }

  login(provider) {
    debug('Start login with', provider);
    login(provider);
  }

  render() {
    const {loginModal} = this.props;
    const actions = [
      <FlatButton
        label='Cancel'
        primary={true}
        onTouchTap={::this.handleCloseDialog}
      />
    ];

    return (
      <Dialog
          titleClassName={styles.dialogTitle}
          title='Login with...'
          modal={false}
          actions={actions}
          open={loginModal}
          onRequestClose={::this.handleCloseDialog}
        >
        <FlatButton backgroundColor='cornflowerblue' label='Facebook' onClick={() => ::this.login('facebook')} className={styles.socialBtn} />
        <FlatButton backgroundColor='darkturquoise' label='Twitter' onClick={() => ::this.login('twitter')} className={classnames(styles.socialBtn)} />
        <FlatButton backgroundColor='indianred' label='Google' onClick={() => ::this.login('google')} className={styles.socialBtn} />
      </Dialog>
    );
  }
}
