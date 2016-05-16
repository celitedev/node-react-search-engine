import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
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
        path: `http://testing123.kwhen.com:3000/entities/${params.id}`
      })
    };
  }
  render() {
    const {data, loaded} = this.props;
    return (
      <div className='mdl-layout__container'>
      <div className='mdl-layout mdl-js-layout'>
        <Header />
        <DetailsContent answer={data}/>
      </div>
      </div>
    );
  }

}
