import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from 'react-mdl';
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
    return (
      <Dialog open={loginModal} onCancel={::this.handleCloseDialog} className={classnames('mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet', styles.dialog)}>
        <DialogTitle className={styles.dialogTitle}>Login with ...</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <Button ripple raised colored onClick={() => ::this.login('facebook')} className={styles.socialBtn}>Facebook</Button>
          <Button ripple raised onClick={() => ::this.login('twitter')} className={classnames(styles.socialBtn, styles.twitterBtn)}>Twitter</Button>
          <Button ripple raised accent onClick={() => ::this.login('google')} className={styles.socialBtn}>Google</Button>
          <Button ripple raised onClick={() => ::this.login('github')} className={classnames(styles.socialBtn, styles.githubBtn)}>GitHub</Button>
        </DialogContent>
        <DialogActions>
          <Button ripple onClick={::this.handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
