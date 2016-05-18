import React from 'react';
import PureComponent from 'react-pure-render/component';
import {page} from '../page';

import Header from '../../components/Common/Header.js';
import AnswerCards from '../../components/Answer/Answer.js';
import {API_REQUEST} from '../../actionTypes';

@page('Answer')
export default class Answer extends PureComponent {
  static fetchData({dispatch, params}) {
    //Question: how this API works? (subtypes vs question)
    if (params.question.length < 10) {
      return {
        searchResults: dispatch({
          type: API_REQUEST,
          method: 'post',
          path: 'http://testing123.kwhen.com:3000/question',
          data: JSON.stringify({
            badRequestIs200: true,
            question: params.question,
            meta: {
              includeCardFormatting: true
            }
          })
        })
      };
    }
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
    const {data, loaded, params} = this.props;
    return (
      <div className='mdl-layout__container'>
        <div className='mdl-layout mdl-js-layout is-upgraded'>
          <Header params={params}/>
          {loaded && (
            <AnswerCards params={params} answer={data.searchResults}/>
          ) || (
            <h3>Loading...</h3>
          )}
        </div>
      </div>
    );
  }

}
