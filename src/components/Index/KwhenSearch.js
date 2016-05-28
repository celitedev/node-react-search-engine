import React from 'react';
import PureComponent from 'react-pure-render/component';
import ContentEditable from 'react-contenteditable';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import {redirect, toggleLoginModal, logout} from '../../actions';
import exampleQuestions from './../../exampleQuestions';
import {Button} from 'react-mdl';
import LoginModal from '../Common/LoginModal';
import {clearAuthToken} from '../../horizon';

const debug = require('debug')('app:collections:new');

function auth(state) {
  const {authenticated} = state.auth;
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
    const {toggleLoginModal, authenticated} = this.props;
    return (
      <div className={classnames('mdl-layout mdl-js-layout js-index no-js', styles.root)}>
        <main className='mdl-layout__content'>
          <div className='page-content question-page'>
            {authenticated && (
              <div>
                <Link to='mycollections'>
                  <Button raised accent ripple
                          className={styles.myCollectionsBtn}>
                    My Collections
                  </Button>
                </Link>
                <Button raised accent ripple className={styles.loginBtn}
                        onClick={() => ::this.logout()}>
                  Logout
                </Button>
              </div>
            ) || ( <Button raised accent ripple className={styles.loginBtn}
                           onClick={toggleLoginModal}>
                Login
              </Button>
            )
            }
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
