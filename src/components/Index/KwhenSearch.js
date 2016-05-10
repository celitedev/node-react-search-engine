import React from 'react';
import PureComponent from 'react-pure-render/component';
import ContentEditable from 'react-contenteditable';
import {connect} from 'redux-simple';
import { Link } from 'react-router';
import _ from 'lodash';
import classnames from 'classnames';

import {redirect} from '../../actions';

import exampleQuestions from './exampleQuestions';

const debug = require('debug')('app:collections:new');
@connect(null, {redirect})
export default class IndexSearch extends PureComponent {
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
      <div className={classnames('mdl-layout mdl-js-layout js-index no-js', styles.root)}>
      <main className='mdl-layout__content'>
        <div className='page-content question-page'>
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
            { _.map(exampleQuestions, (el, index) =>
              <li key={index}>
                <Link to={`answer/question=${el.question}`} className={styles.exampleQuestions}>
                  {el.question}
                </Link>
              </li>
            )}
          </ul>

        </div>
      </main>
    </div>
    );
  }
}
