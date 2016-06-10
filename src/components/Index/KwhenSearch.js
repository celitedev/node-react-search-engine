import React from 'react';
import PureComponent from 'react-pure-render/component';
import ContentEditable from 'react-contenteditable';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import {redirect, toggleLoginModal, logout} from '../../actions';
import exampleQuestions from './../../exampleQuestions';
import LoginModal from '../Common/ShareModal';
import {clearAuthToken, login} from '../../horizon';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import LogInIcon from 'material-ui/svg-icons/action/input';
import {IconMenu, Menu, MenuItem, FlatButton, Paper} from 'material-ui';
import IconButton from 'material-ui/IconButton/IconButton';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import LoginPopover from '../Common/LoginPopover';

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
      searchText: '',
    };
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
          <nav className={classnames('mdl-navigation', styles.signInBtn)}>
            <LoginPopover />
          </nav>
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
