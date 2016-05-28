import React from 'react';
import PureComponent from 'react-pure-render/component';
import ContentEditable from 'react-contenteditable';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import {answerTheQuestion, redirect, toggleLoginModal, logout} from '../../actions';
import {Menu, MenuItem} from 'react-mdl';
import {clearAuthToken} from '../../horizon';
import LoginModal from '../Common/LoginModal';

const debug = require('debug')('app:searchRequest');

function auth(state) {
  const {authenticated} = state.auth;
  return {authenticated};
}

@connect(auth, {redirect, answerTheQuestion, toggleLoginModal, logout})
export default class Header extends PureComponent {

  constructor(props, context) {
    super(props, context);
    this.state = {
      searchText: props.params.question || ''
    };
  }

  async searchRequest(question) {
    const {answerTheQuestion} = this.props;
    try {
      await answerTheQuestion(question);
    } catch (err) {
      debug('searchRequest', err);
    }
  }


  logout() {
    const {logout} = this.props;
    logout();
    clearAuthToken();
  }

  searchText(e) {
    if (e.which === 13) {
      this.searchRequest(e.target.textContent);
      this.props.redirect(`/answer/${e.target.textContent}`);
    }
    this.setState({
      searchText: e.target.textContent
    });
  }

  render() {
    const {searchText} = this.state;
    const {authenticated, toggleLoginModal} = this.props;
    return (
      <header className='mdl-layout__header'>
        <div className='mdl-layout__header-row'>
          <Link to='/' className='header--logo' title='back to home'/>
          <Link to='/' className='header--logotext' title='back to home'/>
          <div className='search-field'>
            <span className='searchIcon'>&nbsp;</span>
            <ContentEditable
              className='placeholder'
              html={searchText} // innerHTML of the editable div ;
              placeholder='When...'
              disabled={false}  // use true to disable edition ;
              onKeyPress={::this.searchText}
            />
          </div>
          <nav className='mdl-navigation'>
            <a title='your profile' className='mdl-navigation__link profile--nav' id='demo-menu-lower-right' href='#'><i
              className='material-icons profile--icon'>account_circle</i></a>
            <Menu target='demo-menu-lower-right' align='right'>
              {authenticated && (
                <MenuItem onClick={() => ::this.logout()}>Logout</MenuItem>
              ) || (
                <MenuItem onClick={toggleLoginModal}>Login</MenuItem>
              )}
            </Menu>
          </nav>
        </div>
        <LoginModal />
      </header>
    );
  }
}
