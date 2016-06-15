import React from 'react';
import PureComponent from 'react-pure-render/component';
import {page} from '../page';
import Header from '../../components/Common/Header.js';
import DetailsContent from '../../components/Details/Details';
import {API_REQUEST} from '../../actionTypes';

@page('Details')
export default class Details extends PureComponent {
  static fetchData({dispatch, params}) {
    return {
      result: dispatch({
        type: API_REQUEST,
        method: 'get',
        path: `entities/${params.id}`
      })
    };
  }

  render() {
    const {data, loaded, params} = this.props;
    return (
      <div className='mdl-layout__container'>
        <div className='mdl-layout mdl-js-layout'>
          <Header params={params}/>
          {loaded && (
            <DetailsContent params={params} answer={data}/>
          ) || (
            <h3></h3>
          )}
        </div>
      </div>
    );
  }
}
