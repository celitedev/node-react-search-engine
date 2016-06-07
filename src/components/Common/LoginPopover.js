import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import {logout} from '../../actions';
import {login, clearAuthToken} from '../../horizon';
import {Link} from 'react-router';

import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import LogInIcon from 'material-ui/svg-icons/action/input';
import {IconMenu, Menu, MenuItem, FlatButton, Paper} from 'material-ui';
import IconButton from 'material-ui/IconButton/IconButton';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';

const debug = require('debug')('app:LoginPopover');

function getLoginPopover(state) {
  const {loginModal, authenticated} = state.auth;
  return {loginModal, authenticated};
}

@connect(getLoginPopover, {logout})
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
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  login(provider) {
    debug('Start login with', provider);
    this.handleRequestClose();
    login(provider);
  }

  render() {
    const {authenticated, cardAction} = this.props;

    return (
      <div>
          {authenticated && (
            <IconButton onTouchTap={this.handleTouchTap}
                        className={styles.logedInBtn}>
              <AccountCircle color='white'/>
            </IconButton>
          ) || cardAction && (
            <FlatButton onTouchTap={::this.handleTouchTap} label='Add to collection' />
          ) || (
            <FlatButton
              onTouchTap={this.handleTouchTap}
              label='Sign in'
              icon={<AccountCircle color='white'/>}
              className={styles.loginBtn}
            />
          )}
            <Popover
              open={this.state.open}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleRequestClose}
              animation={PopoverAnimationVertical}
            >
            {authenticated && (
              <Menu>
                <Link to='/mycollections'><MenuItem>My collections</MenuItem></Link>
                <MenuItem onClick={() => ::this.logout()} primaryText='Logout' />
              </Menu>
            ) || (
              <div className={styles.popoverMenu}>
                <FlatButton backgroundColor='cornflowerblue' label='Facebook' onClick={() => ::this.login('facebook')} className={styles.socialBtn} />
                <FlatButton backgroundColor='darkturquoise' label='Twitter' onClick={() => ::this.login('twitter')} className={classnames(styles.socialBtn)} />
                <FlatButton backgroundColor='indianred' label='Google' onClick={() => ::this.login('google')} className={styles.socialBtn} />
              </div>
            )}
            </Popover>
        </div>
    );
  }
}
