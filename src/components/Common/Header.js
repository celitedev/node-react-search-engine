import React from 'react';
import PureComponent from 'react-pure-render/component';
import ContentEditable from 'react-contenteditable';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import {answerTheQuestion, redirect, toggleLoginModal, logout} from '../../actions';
import {clearAuthToken, login} from '../../horizon';
import LoginPopover from '../Common/LoginPopover';
import NewCollectionModal from '../Common/NewCollectionModal';
import ShareModal from '../Common/ShareModal';
import SnackbarMsg from '../Common/SnackbarMsg';
import autobind from 'autobind-decorator';

const debug = require('debug')('app:searchRequest');

function auth(state) {
  const {authenticated, loginModal} = state.auth;
  return {authenticated, loginModal};
}

@connect(auth, {redirect, answerTheQuestion, toggleLoginModal, logout})
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
      this.searchRequest(e.target.textContent);
      this.setState({
        searchText: e.target.textContent
      }, () => {
        const {redirect} = this.props;
        const {searchText} = this.state;
        redirect(`/answer/${searchText}`);
      });
    }
  }

  @autobind
  handleSearchChange(e) {
    this.setState({
      searchText: e.target.value
    });
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
      <header className={classnames('mdl-layout__header', styles.headerFixed)}>
        <div className={classnames('mdl-layout__header-row', styles.root)}>
          <Link to='/' className='header--logo' title='back to home'/>
          <Link to='/' className='header--logotext' title='back to home'/>
          <div className='search-field'>
            <span className='searchIcon'>&nbsp;</span>
            <ContentEditable
              className='placeholder'
              html={searchText} // innerHTML of the editable div ;
              placeholder='When...'
              disabled={false}  // use true to disable edition ;
              onChange={this.handleSearchChange}
              onKeyPress={this.searchText}
            />
          </div>
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
