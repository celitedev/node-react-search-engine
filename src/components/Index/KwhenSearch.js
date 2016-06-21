import React, {Component} from 'react';
import {pure, compose, withState, withHandlers} from 'recompose';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import ContentEditable from 'react-contenteditable';
import classnames from 'classnames';
import {redirect} from '../../actions';
import exampleQuestions from './../../exampleQuestions';
import LoginPopover from '../Common/LoginPopover';
import TextField from 'material-ui/TextField';

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
          props.redirect(`/answer/${event.target.textContent}`);
        }
      }
  }),
  pure
);

@enchance
export default class IndexSearch extends Component {
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
              <div className='search-field'>
                <span className='searchIcon'>&nbsp;</span>
                <TextField
                  hintText='When...'
                  disabled={false}
                  onChange={changeSearch}
                  onKeyPress={submit}
                />
              </div>
            </div>

            <div className='quicklaunch'>
              <div className='quicklaunch--title'>Try searching for things like:</div>
              <ul>
                {exampleQuestions.map((el, index) => (
                  <li key={index} className='quicklaunch--item'>
                    <Link to={`answer/${el.question}`}>{el.question}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
