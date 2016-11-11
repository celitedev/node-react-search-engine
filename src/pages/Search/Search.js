import React from 'react';
import PureComponent from 'react-pure-render/component';
import {page} from '../page';
import Header from '../../components/Common/Header.js';
import SearchResults from '../../components/Search/Search.js';
import {API_REQUEST} from '../../actionTypes';
import classnames from 'classnames';


@page('Search')
export default class Search extends PureComponent {
  static fetchData({dispatch, params, query}) {
    const q = JSON.parse(query.filter);
    const {filter, meta, page, pageSize, similarTo, sort, spatial, type, temporal, wantUnique} = q;
    const {question} = params;
    return {
      searchResults: dispatch({
        type: API_REQUEST,
        method: 'post',
        path: 'search',
        data: {
          filter, pageSize, similarTo, spatial, sort,
          page, meta, type, temporal, wantUnique, question
        }
      })
    };
  }

  onBack() {
    this.props.history.goBack();
  }

  render() {
    const {data, loaded, params} = this.props;
    return (
      <div className={classnames('mdl-layout', 'mdl-layout--fixed-header')}>
        <Header params={params}/>
        {loaded
          && (<SearchResults params={params} answer={data.searchResults} goBack={()=>{this.onBack();}}/>)
          || (<h3></h3>)
        }
      </div>
    );
  }

}
