import React, {Component} from 'react';
import {page} from '../page';

import Header from '../../components/Common/Header.js';
import AnswerCards from '../../components/Answer/Answer.js';
import AnswerWarning from '../../components/Answer/AnswerWarning.js';
import {API_REQUEST} from '../../actionTypes';
import exampleQuestions from '../../exampleQuestions';

const debug = require('debug')('app:answer');

@page('Answer')
export default class Answer extends Component {
  static fetchData({dispatch, params}) {
    const question = params.question;
    const example = exampleQuestions.find((el) => {
      return el.question === question;
    });
    let searchParams;
    const refs = {expand: ['location.containedInPlace', 'location', 'workFeatured']};
    let meta = {
      includeCardFormatting: true
    };
    if (example) {
      meta = {...meta, refs};
      searchParams = {question, ...example.context, meta};
      debug('Example search', searchParams);
    } else {
      searchParams = {
        question: params.question,
        meta
      };
    }
    return {
      searchResults: dispatch({
        type: API_REQUEST,
        method: 'post',
        path: 'question',
        data: searchParams
      })
    };
  }
  render() {
    const {data, loaded, params} = this.props;
    return (
        <div className='mdl-layout'>
          <Header params={params}/>
          {(loaded && data.searchResults.results) && (
            <AnswerCards params={params} answer={data.searchResults}/>
          )}
          {(loaded && data.searchResults.warningHuman) && (
            <AnswerWarning answer={data.searchResults.warningHuman}/>
          )}
        </div>
    );
  }
}
