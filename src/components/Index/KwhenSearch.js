import React, {Component} from 'react';
import {pure, compose, withState, withHandlers} from 'recompose';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import {redirect} from '../../actions';
import exampleQuestions from './../../exampleQuestions';
import LoginPopover from '../Common/LoginPopover';
import TextField from 'material-ui/TextField';
import Tiles from '../Tiles/Tiles.js';
import cookie from 'react-cookie';

const debug = require('debug')('app:collections:new');

function auth(state) {
  const {authenticated} = state.auth;
  return {authenticated};
}

const enchance = compose(
  connect(auth, {redirect}),
  withState('search', 'updateSearch', ''),
  withHandlers({
      changeSearch: props => event => {
        props.updateSearch(event.target.value);
      },
      submit: props => event => {
        if (event.which === 13) {
          event.preventDefault();
          props.redirect(`/answer/${event.target.value}`);
        }
      }
  }),
  pure
);

@enchance
export default class IndexSearch extends Component {
  componentWillMount() {
    const redirectUrl = cookie.load('redirectUrl');

    if (redirectUrl) {
      this.props.redirect(redirectUrl);
      cookie.remove('redirectUrl', {path: '/'});
    }
    const cardId = cookie.load('saveCardId');
    if (cardId) {
      this.props.redirect(`/details/${cardId}`);
    }
  }

  render() {
    const {search, changeSearch, submit} = this.props;
    return (
      <div className={classnames('js-index', styles.root)}>
        <main>
          <div className='question-page'>
          <nav className={styles.signInBtn}>
            <LoginPopover />
          </nav>
            <div className='logo'></div>
            <div className='l-searchbox'>
              <form name='search_form' action='.'>
                <div className='search-field'>
                  <span className='searchIcon'>&nbsp;</span>

                    <TextField
                      name='sitewide_search'
                      type='search'
                      hintText='Search for happenings in NYC...'
                      disabled={false}
                      onChange={changeSearch}
                      onKeyPress={submit}
                    />
                </div>
              </form>
            </div>

            <div className='quicklaunch'>
              <div className='quicklaunch--title'>Try searching for things like:</div>
              <Tiles items={exampleQuestions}/>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
