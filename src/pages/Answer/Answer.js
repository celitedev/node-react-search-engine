import React, {Component, Pagination} from 'react';
import {page} from '../page';
import {map, find, findIndex, filter, isEqual} from 'lodash';
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
import Meta from '../../components/Common/Meta';


const debug = require('debug')('app:answer');

let isFirstLoad;

@page('Answer', null, {loadMoreResults, answerTheQuestion})
export default class Answer extends Component {
  defaultTypes() {
    return ['events', 'places', 'creative works', 'performers'];
  }

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
    if (params.splat) {
      const tabs = params.splat.split('/');
      if (tabs[0] === 'Events' && tabs[1] && tabs[1].toLowerCase() !== 'all') {
        searchParams.question = searchParams.question + ' ' + tabs[1];
      }
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
    isFirstLoad = true;
  }

  componentWillReceiveProps(nextProps) {
    const {loaded, data, history, location, params} = nextProps;
    if (location.state) {
      if (location.action === 'REPLACE' || !isEqual(this.state, location.state)) {
        this.setState(location.state);
      }
    } else if (!location.state && params.splat) {
      if (loaded && data.searchResults && data.searchResults.results && data.searchResults.results.length > 0 && isFirstLoad) {
        const tabs = params.splat.split('/');
        const mainTab = tabs[0];
        const subTab = mainTab === 'Events' ? tabs[1] : null;
        //decrease page number once since we add one again in buildPath function
        const page = location.search.indexOf('?page=') === 0 ? parseInt(location.search.substr(6), 10) - 1 : 0;
        let index = 0;
        if (mainTab !== 'Most Relevant') {
          index = findIndex(data.searchResults.results, (result) => {
            return result.typeHuman === mainTab.toLowerCase();
          });
        }
        const results = index >= 0 ? data.searchResults.results[index] : null;
        const totalPageNum = results !== null ? Math.ceil(results.totalResults / 12) : 0;
        const state = {
          mainTab: mainTab,
          subTab: subTab,
          resultsPage: page,
          results: results,
          pageNum: totalPageNum
        };
        isFirstLoad = false;
        history.replaceState(state, this._buildPath(params.question, mainTab, subTab, page));
      }
    } else {
      if (loaded && data.searchResults && data.searchResults.results && data.searchResults.results.length > 0 && isFirstLoad) {
        const mainTab = this.getTab(data.searchResults.results[0].typeHuman);
        const subTab = mainTab === 'Events' ? 'all' : null;
        const state = {
          mainTab: mainTab,
          subTab: subTab,
          results: data.searchResults.results[0],
          resultsPage: 0,
          pageNum: Math.ceil(data.searchResults.results[0].totalResults / 12)
        };
        isFirstLoad = false;
        history.replaceState(state, this._buildPath(params.question, mainTab, subTab));
      }
    }
  }

  onMainTabSelect(tab, forceSelect = false) {
    let state;
    const {history, location, params} = this.props;

    if (!forceSelect && this.state.mainTab === tab) {
      return;
    }
    const {results} = this.props.data.searchResults;
    const index = findIndex(results, (result) => {
      return tab && result.typeHuman === tab.toLowerCase();
    });
    if (index > -1) {
      state = {
        mainTab: tab,
        subTab: tab === 'Events' ? 'all' : null,
        pageNum: Math.ceil(results[index].totalResults / 12),
        resultsPage: 0,
        results: results[index]
      };
    } else {
      if (tab === 'Most Relevant') {
        state = {
          mainTab: tab,
          subTab: tab === 'Events' ? 'all' : null,
          pageNum: Math.ceil(results[0].totalResults / 12),
          resultsPage: 0,
          results: results[0]
        };
      } else {
        state = {
          mainTab: tab,
          subTab: tab === 'Events' ? 'all' : null,
          pageNum: 0,
          resultsPage: 0,
          results: null
        };
      }
    }
    history.pushState(state, this._buildPath(params.question, state.mainTab, state.subTab));
  }

  onSubTabSelect(tab) {
    if (tab === 'ALL' || tab === 'all') {
      this.onMainTabSelect(this.state.mainTab, true);
    } else {
      this.setState({subTab: tab});
      const results = this.props.data.searchResults.results;
      if (results && results.length > 0) {
        const question = results[results.length - 1].filterContext.filter.name.text;
        this.filterByDate(this.props.params.question, question, tab, this.props.answerTheQuestion, this.props.loadNewResults, this.props.history, this._buildPath);
      } else {
        this.filterByDate(this.props.params.question, this.props.params.question, tab, this.props.answerTheQuestion, this.props.loadNewResults, this.props.history, this._buildPath);
      }
    }
  }

  async filterByDate(oldQuestion, newQuestion, tab, answerTheQuestion, loadNewResults, history, _buildPath) {
    const date = tab.toLowerCase();
    try {
      const searchResults = await answerTheQuestion(newQuestion.replace(/\s+$/, '') + ' ' + date);
      const filterResults = filter(searchResults.results, (result) => {
        return result.typeHuman === 'events';
      });
      const newResults = filterResults.length > 0 ? filterResults[0] : null;
      const state = Object.assign({}, this.state, {
        subTab: tab,
        results: newResults,
        resultsPage: 0,
        pageNum: newResults ? Math.ceil(newResults.totalResults / 12) : 0
      });
      history.pushState(state, _buildPath(oldQuestion, state.mainTab, state.subTab));
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
      return tab.name.toLowerCase() === humanType.toLowerCase() || tab.question.toLowerCase() === humanType.toLowerCase();
    });

    if (i > 0) {
      return MainTabs[i].name;
    }
    return MainTabs[0].name;
  }

  _buildPath(question, mainTab, subTab = null, page = 0) {
    // return '/answer/' + question + ((mainTab !== 'Most Relevant') ? ('/' + mainTab + ( subTab !== null ? '/' + subTab : '')) : ''));
    return '/answer/' + question + ('/' + mainTab + ( subTab !== null ? '/' + subTab : '') + (page !== 0 ? '?page=' + (1 + page) : ''));
  }

   async loadNewResults(data, mainTab, subTab, loadMoreResults, page) {
    const answer = this.getData(data, mainTab);
    const {history, location, params} = this.props;
    debug('Load new results start:', 'page: ', page, 'answer: ', answer);
    try {
      let filterContext = Object.assign({}, answer.filterContext, {pageSize: 12});
      if (mainTab === 'Events') {
        const question = filterContext.question || filterContext.filter.name.text;
        filterContext = Object.assign(filterContext, this.state.results.filterContext, {question: question.replace(/\s+$/, '') + ' ' + subTab});
      }
      const results = await loadMoreResults(page, filterContext);
      const newResults = Object.assign({}, this.state.results, results, {answerNLP: this.state.results.answerNLP});
      const state = Object.assign({}, this.state, {results: newResults, resultsPage: page});
      this.refs.mainLayout.scrollTop = 0;
      if (!isEqual( this.state.results.results, state.results.results)) {
        history.pushState(state, this._buildPath(params.question, state.mainTab, state.subTab, state.resultsPage));
      }
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
    const hasResults = loaded && data.searchResults && data.searchResults.results;
    const resultTypes = hasResults ? _.map(data.searchResults.results, (result) => {return result.typeHuman;}) : [];
    const hasNLPAnswer = hasResults && _.difference(resultTypes, this.defaultTypes()).length > 0;
    const title = hasResults ? `${this.state.results.answerNLP.replace(/<(?:.|\s)*?>/g, '').replace('&nbsp;', ' ').trim()} | Kwhen.com` : `${params.question} | Kwhen.com`;
    return (
        <div className={classnames('mdl-layout', 'mdl-layout--fixed-header')}>
          <Meta title={title}/>;
          <Header params={params}/>
          {(loaded) && (
          <div className='tabbar'>
            <div className='entitybar'>
              {map(MainTabs, (tab, index) => {
                const sel = tab.name;
                if ((index === 0 && hasNLPAnswer) || resultTypes.includes(tab.name.toLowerCase())) {
                  return (
                    <a onClick={()=>this.onMainTabSelect(sel)} className={classnames({'selected': mainTab.toLowerCase() === sel.toLowerCase()})}> {tab.name.toUpperCase()} </a>
                  );
                }
              })}
            </div>
            <div className='datebar-bg'>
            {(mainTab === 'Events') && (
                <div className='datebar'>
                  {map(SubTabs, (tab, index) => {
                  return (
                    <a onClick={()=>this.onSubTabSelect(tab.name.toLowerCase())} className={classnames({'selected': subTab === tab.name.toLowerCase()})}> {tab.name.toUpperCase()} </a>
                  );
                })}
                </div>
            )}
            </div>
          </div>
          )}
          <div ref='mainLayout' className='main-layout'>
            {(loaded && results) && (!data.searchResults.warningHuman) && (
              <AnswerCards params={params} answer={results}/>
            )}
            {(loaded && results) && (this.state.pageNum > 1) && (!data.searchResults.warningHuman) && (
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
            {(loaded && !results && !data.searchResults.warningHuman) && (
              <h3 className={classnames(styles.noResult)}>No Results</h3>
            )}
            <SiteMap />
            <Footer />
          </div>
        </div>
    );
  }
}
