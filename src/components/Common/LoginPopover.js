import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import {logout, redirect} from '../../actions';
import {login, clearAuthToken} from '../../horizon';
import {Link} from 'react-router';
import cookie from 'react-cookie';

import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import {Menu, MenuItem, FlatButton} from 'material-ui';
import IconButton from 'material-ui/IconButton/IconButton';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';

const debug = require('debug')('app:LoginPopover');
const SAVE_CARD_MSG = 'Save card';

function getLoginPopover(state) {
  const {loginModal, authenticated} = state.auth;
  return {loginModal, authenticated};
}

@connect(getLoginPopover, {logout, redirect})
export default class LoginPopover extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false
    };
  }

  logout() {
    this.handleRequestClose();
    const {logout} = this.props;
    setTimeout(() => {
      logout();
      clearAuthToken();
    }, 100);
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  login(provider) {
    debug('Start login with', provider);
    this.handleRequestClose();
    if (this.props.cardId) {
      cookie.save('saveCardId', this.props.cardId, {path: '/'});
    } else {
      cookie.save('redirectUrl', location.pathname, {path: '/'});
    }
    login(provider);
  }

  openMyCollections() {
    const {redirect} = this.props;
    redirect('/mycollections');
  }

  render() {
    const {authenticated, cardAction, detailMessage} = this.props;
    const {open, anchorEl} = this.state;
    const tagIconUrl = require('../../images/tag.png');

    return (
      <div>
          {authenticated && (
            <IconButton onTouchTap={this.handleTouchTap}
                        className={styles.logedInBtn}>
              <AccountCircle color='white'/>
            </IconButton>
          ) || cardAction && (
            <IconButton onTouchTap={::this.handleTouchTap} className={styles.saveCardBtn}>
              <img src={tagIconUrl} className={styles.imgBtn} />
            </IconButton>
          ) || (
            <FlatButton
              onTouchTap={this.handleTouchTap}
              label='Sign in'
              icon={<AccountCircle color='white'/>}
              className={styles.loginBtn}
            />
          )}
            <Popover
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleRequestClose}
              animation={PopoverAnimationVertical}
            >
            {authenticated && (
              <Menu>
                <MenuItem onTouchTap={() => ::this.openMyCollections()}>My collections</MenuItem>
                <MenuItem onClick={() => ::this.logout()} primaryText='Logout' />
              </Menu>
            ) || (
              <div id='wrapper' className={styles.popoverMenu}>
                <div className={styles.login}>
                  Login
                  <button onClick={() => ::this.handleRequestClose()} type='button' className={styles.close}>×</button>
                </div>
                <div className={styles.clr}></div>
                {detailMessage && (
                  <div className={styles.options}>{detailMessage}</div>
                )}
                <div className={styles.option}>
                  <a onClick={() => ::this.login('facebook')} className={styles.facebook}>
                    Login with Facebook
                  </a>
                </div>
                <div className={styles.option}>
                  <a onClick={() => ::this.login('twitter')} className={classnames(styles.twitter)} >
                    Login with Twitter
                  </a>
                </div>
                <div className={styles.option}>
                  <a onClick={() => ::this.login('google')} className={styles.google} >
                    Login with Google+
                  </a>
                </div>
              </div>
            )}
            </Popover>
        </div>
    );
  }
}
