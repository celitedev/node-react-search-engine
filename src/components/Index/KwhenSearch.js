import React from 'react';
import PureComponent from 'react-pure-render/component';
import ContentEditable from 'react-contenteditable';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import {redirect, toggleLoginModal, logout} from '../../actions';
import exampleQuestions from './../../exampleQuestions';
//import {Button, Menu, MenuItem, FABButton, Icon, Layout} from 'react-mdl';
import {IconMenu, MenuItem} from 'material-ui';
import IconButton from 'material-ui/IconButton/IconButton';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import LoginModal from '../Common/LoginModal';
import {clearAuthToken} from '../../horizon';

const debug = require('debug')('app:collections:new');

function auth(state) {
  const {authenticated, loginModal} = state.auth;
  return {authenticated};
}

@connect(auth, {redirect, toggleLoginModal, logout})
export default class IndexSearch extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      searchText: ''
    };
  }

  logout() {
    const {logout} = this.props;
    logout();
    clearAuthToken();
  }

  searchText(e) {
    if (e.which === 13) {
      this.props.redirect(`/answer/${e.target.textContent}`);
    }
    this.setState({
      searchText: e.target.textContent
    });
  }

  render() {
    const {searchText} = this.state;
    const {toggleLoginModal, authenticated, loginModal} = this.props;
    return (
      <div className={classnames('mdl-layout mdl-js-layout js-index no-js', styles.root)}>
        <main className='mdl-layout__content'>
          <div className='page-content question-page'>
          <nav className='mdl-navigation'>
            <IconMenu
              iconButtonElement={<IconButton><AccountCircle color='white'/></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              className={styles.accountDropdown}
            >
              {authenticated && (
                <div>
                  <Link to='/mycollections'><MenuItem>My collections</MenuItem></Link>
                  <MenuItem onClick={() => ::this.logout()} primaryText='Logout' />
                </div>
              ) || (
                <MenuItem onClick={toggleLoginModal} primaryText='Login'/>
              )}
            </IconMenu>
            </nav>
            <LoginModal />
            <div className='logo'></div>

            <div className='l-searchbox'>
              <div className='search-field'>
                <span className='searchIcon'>&nbsp;</span>
                <ContentEditable
                  className='placeholder'
                  html={searchText} // innerHTML of the editable div ;
                  placeholder='When...'
                  disabled={false}       // use true to disable edition ;
                  onKeyPress={::this.searchText}
                />
              </div>
            </div>

            <ul className='exampleQuestions'>
              {exampleQuestions.map((el, index) => (
                <li key={index}>
                  <Link to={`answer/${el.question}`} className={styles.exampleQuestions}>
                    {el.question}
                  </Link>
                </li>
              ))}
            </ul>

          </div>
        </main>
      </div>
    );
  }
}
