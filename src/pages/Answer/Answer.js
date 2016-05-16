import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import {page} from '../page';

import Header from '../../components/Common/Header.js';
import AnswerCards from '../../components/Answer/Answer.js';
import {API_REQUEST} from '../../actionTypes';

@page('Answer')
export default class Answer extends PureComponent {
  static fetchData({dispatch, params}) {
    return {
      searchResults: dispatch({
        type: API_REQUEST,
        method: 'post',
        path: 'http://testing123.kwhen.com:3000/question',
        data: JSON.stringify({
          badRequestIs200: true,
          filter: {
            subtypes: 'restaurant'
          },
          meta: {
            includeCardFormatting: true
          },
          type: 'PlaceWithOpeninghours',
          wantUnique: false,
        })
      })
    };
  }
  render() {
    const {data, loaded} = this.props;
    return (
      <div className='mdl-layout__container'>
      <div className='mdl-layout mdl-js-layout is-upgraded'>
        <Header />
        <AnswerCards answer={data.searchResults}/>
      </div>
      </div>
    );
  }

}
