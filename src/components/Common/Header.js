import React from 'react';
import PureComponent from 'react-pure-render/component';
import ContentEditable from 'react-contenteditable';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import {answerTheQuestion, redirect, toggleLoginModal, logout, answerRedirect} from '../../actions';
import {clearAuthToken, login} from '../../horizon';
import LoginPopover from '../Common/LoginPopover';
import NewCollectionModal from '../Common/NewCollectionModal';
import ShareModal from '../Common/ShareModal';
import SnackbarMsg from '../Common/SnackbarMsg';
import autobind from 'autobind-decorator';
import TextField from 'material-ui/TextField';


const debug = require('debug')('app:searchRequest');

function auth(state) {
  const {authenticated, loginModal} = state.auth;
  return {authenticated, loginModal};
}

@connect(auth, {redirect, answerTheQuestion, toggleLoginModal, logout, answerRedirect})
export default class Header extends PureComponent {

  constructor(props, context) {
    super(props, context);
    this.state = {
      searchText: props.params.question || '',
      open: false
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

  @autobind
  searchText(e) {
    if (e.which === 13) {
      e.preventDefault();
      const encodedSearchText = e.target.value.replace(/'/g, '');
      this.searchRequest(encodedSearchText);
      this.setState({
        searchText: encodedSearchText
      }, () => {
        const {answerRedirect} = this.props;
        const {searchText} = this.state;
        answerRedirect(`/answer/${searchText}`);
      });
    }
  }

  @autobind
  handleSearchChange(e) {
    this.setState({
      searchText: e.target.value
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  login(provider) {
    debug('Start login with', provider);
    this.handleRequestClose();
    login(provider);
  }

  render() {
    const {searchText} = this.state;
    return (
      <header className={classnames('mdl-layout__header')}>
        <div className={classnames('mdl-layout__header-row', styles.root)}>
          <Link to='/' className='header--logo' title='back to home'/>
          <Link to='/' className='header--logotext' title='back to home'/>
          <form className={classnames('search-fieldForm')} name='search_form' action='.'>
            <div className={classnames('search-field', styles.search_field)}>
              <span className='searchIcon'>&nbsp;</span>
              <TextField
                name='sitewide_search'
                type='search'
                className='placeholder'
                hintText='Search for happenings in NYC...'
                value={searchText}
                onChange={this.handleSearchChange}
                onKeyPress={this.searchText}
              />
            </div>
          </form>
          <nav className='mdl-navigation'>
            <LoginPopover />
          </nav>
        </div>
        <NewCollectionModal />
        <ShareModal />
        <SnackbarMsg />
      </header>
    );
  }
}
