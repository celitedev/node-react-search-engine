import React from 'react';
import PureComponent from 'react-pure-render/component';
import ContentEditable from 'react-contenteditable';
import {connect} from 'redux-simple';
import { Link } from 'react-router';
import _ from 'lodash';
import classnames from 'classnames';

import {redirect} from '../../actions';

@connect(null, {redirect})
export default class Header extends PureComponent {
  constructor(props, context) {
    super();
    this.state = {
      searchText: ''
    };
  }

  searchText(e) {
    if (e.which === 13) {
      this.props.redirect(`/answer/question=${e.target.textContent}`);
    }
    this.setState({
      searchText: e.target.textContent
    });
  }

  render() {
    const {searchText} = this.state;
    return (
      <header className='mdl-layout__header'>

      <div className='mdl-layout__header-row'>
        <a href='/' className='header--logo' title='back to home'></a>
        <a href='/' className='header--logotext' title='back to home'></a>
        <div className='search-field'>
          <span className='searchIcon'>&nbsp;</span>
          <div contentEditable='true' placeholder='When...'></div>
        </div>
        <nav className='mdl-navigation'>
          <a title='your profile' className='mdl-navigation__link profile--nav' href='#'><i className='material-icons profile--icon'>account_circle</i></a>
        </nav>
      </div>
    </header>
    );
  }
}
