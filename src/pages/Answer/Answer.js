import React, {Component} from 'react';
import {page} from '../page';
import {map} from 'lodash';
import Header from '../../components/Common/Header.js';
import AnswerCards from '../../components/Answer/Answer.js';
import AnswerWarning from '../../components/Answer/AnswerWarning.js';
import {API_REQUEST} from '../../actionTypes';
import exampleQuestions from '../../exampleQuestions';
import classnames from 'classnames';
import {MainTabs, SubTabs} from '../../tabbar.js';

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

  constructor(props, context) {
    super(props, context);

    this.state = {
      mainTab: 0,
      subTab: 0
    };
  }

  onMainTabSelect(index) {
    this.setState({mainTab: index});
  }

  onSubTabSelect(index) {
    this.setState({subTab: index});
  }

  getSelectedStyle(index) {
    if (this.state.mainTab === index) return styles.selected;
    return null;
  }

  render() {
    const {data, loaded, params} = this.props;
    const {mainTab, subTab} = this.state;
    return (
        <div className={classnames('mdl-layout', 'mdl-layout--fixed-header')}>
          <Header params={params}/>
          <div className='tabbar'>
            <div className='entitybar'>
              {map(MainTabs, (tab, index) => {
                return (
                  <a href={`#${tab.question}`} onClick={()=>this.onMainTabSelect(index)} className={classnames({'selected': mainTab === index})}> {tab.name.toUpperCase()} </a>
                );
              })}
            </div>
            <div className='datebar'>
            {map(SubTabs, (tab, index) => {
              return (
                <a href={`#${tab.question}`} onClick={()=>this.onSubTabSelect(index)} className={classnames({'selected': subTab === index})}> {tab.name.toUpperCase()} </a>
              );
            })}
            </div>
          </div>
          {(loaded && data.searchResults.results) && (
            <AnswerCards params={params} answer={data.searchResults} mainTab={this.state.mainTab} subTab = {this.state.subTab}/>
          )}
          {(loaded && data.searchResults.warningHuman) && (
            <AnswerWarning answer={data.searchResults.warningHuman}/>
          )}
        </div>
    );
  }
}
