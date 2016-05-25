import React from 'react';
import PureComponent from 'react-pure-render/component';
import {page} from '../page';
import Header from '../../components/Common/Header.js';
import SearchResults from '../../components/Search/Search.js';
import {API_REQUEST} from '../../actionTypes';

@page('Search')
export default class Search extends PureComponent {
  static fetchData({dispatch, params, query}) {
    const q = JSON.parse(query.filter);
    const {filter, meta, page, pageSize, similarTo, sort, spatial, type, wantUnique} = q;
    const {question} = params;
    return {
      searchResults: dispatch({
        type: API_REQUEST,
        method: 'post',
        path: 'http://testing123.kwhen.com:3000/search',
        data: JSON.stringify({
          filter, pageSize, similarTo, spatial, sort,
          page, meta, type, wantUnique, question
        })
      })
    };
  }

  render() {
    const {data, loaded, params} = this.props;
    return (
      <div className='mdl-layout mdl-js-layout'>
        <Header params={params}/>
        {loaded
          ? <SearchResults params={params} answer={data.searchResults}/>
          : <h3>Loading...</h3>
        }
      </div>
    );
  }

}
