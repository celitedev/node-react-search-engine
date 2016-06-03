import React from 'react';
import PureComponent from 'react-pure-render/component';
import ContentEditable from 'react-contenteditable';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import {answerTheQuestion, redirect, toggleLoginModal, logout} from '../../actions';
import {IconMenu, MenuItem} from 'material-ui';
import IconButton from 'material-ui/IconButton/IconButton';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import {clearAuthToken} from '../../horizon';
import LoginModal from '../Common/LoginModal';
import NewCollectionModal from '../Common/NewCollectionModal';

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
          <IconMenu
            iconButtonElement={<IconButton><AccountCircle color='white'/></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
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
        </div>
        <NewCollectionModal />
        <LoginModal />
      </header>
    );
  }
}
