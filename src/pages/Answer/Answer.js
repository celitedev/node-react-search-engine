import React, {Component, Pagination} from 'react';
import {page} from '../page';
import {map, find, findIndex} from 'lodash';
import Header from '../../components/Common/Header.js';
import AnswerCards from '../../components/Answer/Answer.js';
import AnswerWarning from '../../components/Answer/AnswerWarning.js';
import {API_REQUEST} from '../../actionTypes';
import exampleQuestions from '../../exampleQuestions';
import classnames from 'classnames';
import {MainTabs, SubTabs} from '../../tabbar.js';
import ReactPaginate from 'react-paginate';
import {loadMoreResults, filterResults} from '../../actions';
import Footer from '../../components/Footer/Footer.js';
const debug = require('debug')('app:answer');

@page('Answer', null, {loadMoreResults})
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
      pageSize = 12;
      searchParams = {question, ...example.context, meta, pageSize};
      debug('Example search', searchParams);
    } else {
      searchParams = {
        question: params.question,
        meta
      };
    }

    console.log('**searchParam **', searchParams);
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
      mainTab: null,
      subTab: null,
      pageNum: 0,
      resultsPage: 0,
      results: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const {loaded, data} = nextProps;
    if (loaded && data.searchResults && data.searchResults.results.length > 0) {
      this.setState({
        results: data.searchResults.results[0],
        resultsPage: 0,
        pageNum: Math.ceil(data.searchResults.results[0].totalResults / 12)
      });
    }
  }

  onMainTabSelect(tab) {
    if (this.state.mainTab === tab) {
      return;
    }
    const {results} = this.props.data.searchResults;
    const index = findIndex(results, (result) => {
      return tab && result.typeHuman === tab.toLowerCase();
    });
    if (index > -1) {
      this.setState({
        mainTab: tab,
        pageNum: Math.ceil(results[index].totalResults / 12),
        resultsPage: 0,
        results: results[index]
      });
    } else {
      this.setState({mainTab: tab, pageNum: 0, resultsPage: 0});
    }
  }

  onSubTabSelect(tab) {
    this.setState({subTab: tab});
  }

  getSelectedStyle(tab) {
    if (this.state.mainTab === tab) return styles.selected;
    return null;
  }

  getData(data, tab) {
    if (data && data.searchResults && data.searchResults.results) {
      const index = findIndex(data.searchResults.results, (result) => {
        return tab && result.typeHuman === tab.toLowerCase();
      });
      return index > -1 ? data.searchResults.results[index] : data.searchResults.results[0];
    }
    return null;
  }

   async loadNewResults(data, loadMoreResults, page) {
    const answer = this.getData(data, this.state.mainTab);
    debug('Load new results start:', 'page: ', page, 'answer: ', answer);
    try {
      const filter = Object.assign({}, answer.filterContext, {pageSize: 12});
      const results = await loadMoreResults(page, filter);
      const newResults = Object.assign({}, results, {answerNLP: this.state.results.answerNLP});
      this.setState({results: newResults, resultsPage: page});
    } catch (err) {
      debug('Load new results error:', err);
    }
  }

  handlePageClick = (data) => {
     this.loadNewResults(this.props.data, this.props.loadMoreResults, data.selected);
  }

  render() {
    const {data, loaded, params} = this.props;
    const {mainTab, subTab, results} = this.state;

    console.log('**selected', this.state.resultsPage);
    return (
        <div className={classnames('mdl-layout', 'mdl-layout--fixed-header')}>
          <Header params={params}/>
          <div className='tabbar'>
            <div className='entitybar'>
              {map(MainTabs, (tab, index) => {
                const sel = MainTabs[index].name;
                return (
                  <a href={`#${tab.question}`} onClick={()=>this.onMainTabSelect(sel)} className={classnames({'selected': mainTab === sel})}> {tab.name.toUpperCase()} </a>
                );
              })}
            </div>
            {(mainTab === 'Events') && (
              <div className='datebar'>
              {map(SubTabs, (tab, index) => {
                return (
                  <a href={`#${tab.question}`} onClick={()=>this.onSubTabSelect(index)} className={classnames({'selected': subTab === index})}> {tab.name.toUpperCase()} </a>
                );
              })}
              </div>
            )}
          </div>
          {(loaded && results) && (
            <AnswerCards params={params} answer={results}/>
          )}
          {(loaded && results) && (this.state.pageNum > 0) && (
            <div className={styles.paginationSection}>
              <ReactPaginate
                 previousLabel={'<'}
                 nextLabel={'>'}
                 breakLabel={''}
                 pageNum={this.state.pageNum}
                 initialSelected={this.state.resultsPage}
                 forceSelected={this.state.resultsPage}
                 marginPagesDisplayed={0}
                 pageRangeDisplayed={10}
                 clickCallback={this.handlePageClick}
                 containerClassName={classnames('pagination')}
                 subContainerClassName={classnames('pages', 'pagination')}
                 activeClassName={classnames('active')} />
            </div>
          )}
          {(loaded && data.searchResults.warningHuman) && (
            <AnswerWarning answer={data.searchResults.warningHuman}/>
          )}
          <Footer />
        </div>
    );
  }
}
