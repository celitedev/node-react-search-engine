import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import {page} from '../page';

import Header from '../../components/Common/Header.js';
import SearchResults from '../../components/Search/Search.js';
import {API_REQUEST} from '../../actionTypes';

@page('Search')
export default class Search extends PureComponent {
  static fetchData({dispatch, params}) {
    return {
      searchResults: dispatch({
        type: API_REQUEST,
        method: 'post',
        path: 'http://testing123.kwhen.com:3000/search',
        data: JSON.stringify({
          filter: {
            subtypes: 'restaurant'
          },
          sort: [
            {
              type: 'doc'
            }
          ],
          page: 0,
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
      <div className='mdl-layout mdl-js-layout'>
        <Header />
        <SearchResults answer={data.searchResults}/>
      </div>
    );
  }

}
