import React from 'react';
import PureComponent from 'react-pure-render/component';
import ContentEditable from 'react-contenteditable';
import {connect} from 'redux-simple';
import { Link } from 'react-router';
import _ from 'lodash';
import classnames from 'classnames';

import {redirect} from '../../actions';

@connect(null, {redirect})
export default class Answer extends PureComponent {
  constructor(props, context) {
    super();
  }

  render() {
    return (
      <main className='mdl-layout__content'>
        <div className='page-content'>
          <div className='l-answerPage'>
              <div id='js-carouselContainer'>
                Answer here
              </div>
          </div>
        </div>
      </main>
    );
  }
}
