import React, {Component, Pagination} from 'react';
import {page} from '../page';
import {map, find, findIndex, filter} from 'lodash';
import Header from '../../components/Common/Header.js';
import AnswerCards from '../../components/Answer/Answer.js';
import AnswerWarning from '../../components/Answer/AnswerWarning.js';
import {API_REQUEST} from '../../actionTypes';
import exampleQuestions from '../../exampleQuestions';
import classnames from 'classnames';
import {MainTabs, SubTabs} from '../../tabbar.js';
import ReactPaginate from 'react-paginate';
import {loadMoreResults, filterResults, answerTheQuestion} from '../../actions';
import Footer from '../../components/Footer/Footer.js';
import SiteMap from '../../components/SiteMap/SiteMap.js';
const debug = require('debug')('app:answer');

@page('Answer', null, {loadMoreResults, answerTheQuestion})
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
      const mainTab = this.getTab(data.searchResults.results[0].typeHuman);
      const subTab = mainTab === 'Events' ? 'ALL' : null;
      this.setState({
        mainTab: mainTab,
        subTab: subTab,
        results: data.searchResults.results[0],
        resultsPage: 0,
        pageNum: Math.ceil(data.searchResults.results[0].totalResults / 12)
      });
    }
  }

  onMainTabSelect(tab, forceSelect = false) {
    if (!forceSelect && this.state.mainTab === tab) {
      return;
    }
    const {results} = this.props.data.searchResults;
    const index = findIndex(results, (result) => {
      return tab && result.typeHuman === tab.toLowerCase();
    });
    if (index > -1) {
      this.setState({
        mainTab: tab,
        subTab: tab === 'Events' ? 'ALL' : null,
        pageNum: Math.ceil(results[index].totalResults / 12),
        resultsPage: 0,
        results: results[index]
      });
    } else {
      if (tab === 'Most Relevant') {
        this.setState({
          mainTab: tab,
          subTab: tab === 'Events' ? 'ALL' : null,
          pageNum: Math.ceil(results[0].totalResults / 12),
          resultsPage: 0,
          results: results[0]
        });
      } else {
        this.setState({
          mainTab: tab,
          subTab: tab === 'Events' ? 'ALL' : null,
          pageNum: 0,
          resultsPage: 0,
          results: null
        });
      }
    }

    // if (tab === 'Events') {
    //   this.updateEvents();
    // }
    // this.loadNewResults(this.props.data, tab, SubTabs[0].name, this.props.loadMoreResults, 0);
  }

  onSubTabSelect(tab) {
    if (tab === 'ALL') {
      this.onMainTabSelect(this.state.mainTab, true);
    } else {
      this.setState({subTab: tab});
      this.filterByDate(this.props.params.question, tab, this.props.answerTheQuestion, this.props.loadNewResults);
    }
  }

  async filterByDate(question, tab, answerTheQuestion, loadNewResults) {
    const date = tab.toLowerCase();
    try {
      const searchResults = await answerTheQuestion(question + ' ' + date);
      const filterResults = filter(searchResults.results, (result) => {
        return result.typeHuman === 'events';
      });
      const newResults = filterResults.length > 0 ? filterResults[0] : null;
      this.setState({
        subTab: tab,
        results: newResults,
        resultsPage: 0,
        pageNum: newResults ? Math.ceil(newResults.totalResults / 12) : 0
      });
    } catch (err) {
      debug('Load new results error:', err);
    }
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

  getTab(humanType) {
    const i = findIndex(MainTabs, (tab) => {
      return tab.name.toLowerCase() === humanType;
    });

    if (i > 0) {
      return MainTabs[i].name;
    }
    return MainTabs[0].name;
  }

   async loadNewResults(data, mainTab, subTab, loadMoreResults, page) {
    const answer = this.getData(data, mainTab);
    debug('Load new results start:', 'page: ', page, 'answer: ', answer);
    try {
      let filterContext = Object.assign({}, answer.filterContext, {pageSize: 12});
      if (mainTab === 'Events') {
        const question = filterContext.question || filterContext.filter.name;
        const {filter, meta, page, pageSize, smiliarTo, sort, spatial, temporal, type, wantUnique} = filterContext;

        filterContext = Object.assign(filterContext, this.state.results.filterContext, {question: question + ' ' + subTab});
      }
      const results = await loadMoreResults(page, filterContext);
      const newResults = Object.assign({}, results, {answerNLP: this.state.results.answerNLP});
      this.setState({results: newResults, resultsPage: page});
    } catch (err) {
      debug('Load new results error:', err);
    }
  }

  handlePageClick = (data) => {
    this.loadNewResults(this.props.data, this.state.mainTab, this.state.subTab, this.props.loadMoreResults, data.selected);
  }

  render() {
    const {data, loaded, params} = this.props;
    const {mainTab, subTab, results} = this.state;
    const hasNLPAnswer = loaded && data.searchResults.results.length > 4;

    return (
        <div className={classnames('mdl-layout', 'mdl-layout--fixed-header')}>
          <Header params={params}/>
          {(loaded) && (
          <div className='tabbar'>
            <div className='entitybar'>
              {map(MainTabs, (tab, index) => {
                const sel = MainTabs[index].name;
                if (index !== 0 || hasNLPAnswer) {
                  return (
                    <a href={`#${tab.question}`} onClick={()=>this.onMainTabSelect(sel)} className={classnames({'selected': mainTab === sel})}> {tab.name.toUpperCase()} </a>
                  );
                }
              })}
            </div>
            {(mainTab === 'Events') && (
              <div className='datebar-bg'>
                <div className='datebar'>
                {map(SubTabs, (tab, index) => {
                  return (
                    <a href={`#${tab.question}`} onClick={()=>this.onSubTabSelect(tab.name)} className={classnames({'selected': subTab === tab.name})}> {tab.name.toUpperCase()} </a>
                  );
                })}
                </div>
              </div>
            )}
          </div>
          )}
          {(loaded && results) && (
            <AnswerCards params={params} answer={results}/>
          )}
          {(loaded && !results) && (
            <h3 className={classnames(styles.noResult)}>No Results</h3>
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
                 activeClassName={classnames('active')}
                 previousClassName={classnames('hide')}
                 nextClassName={classnames('hide')} />
            </div>
          )}
          {(loaded && data.searchResults.warningHuman) && (
            <AnswerWarning answer={data.searchResults.warningHuman}/>
          )}
          <SiteMap />
          <Footer />
        </div>
    );
  }
}
