import React from 'react';
import PureComponent from 'react-pure-render/component';
import {page} from '../page';
import Header from '../../components/Common/Header.js';
import DetailsContent from '../../components/Details/Details';
import {API_REQUEST} from '../../actionTypes';
import classnames from 'classnames';
import Meta from '../../components/Common/Meta';


@page('Details')
export default class Details extends PureComponent {
  static fetchData({dispatch, params}) {
    return {
      result: dispatch({
        type: API_REQUEST,
        method: 'get',
        path: `entities/${params.id}`
      }),
      suggestions: dispatch({
        type: API_REQUEST,
        method: 'post',
        path: 'suggestions',
        data: {
          data: {
            id: params.id
          }
        }
      })
    };
  }

  //TODO JIM: Add detail item title to url for SEO and sharing pre-rendering
  render() {
    const {data, loaded, params} = this.props;
    let meta = '';
    if (data && data.result && data.result.raw) {
      const title = `${data.result.raw.name} | Kwhen.com`;
      meta = <Meta title={title} />;
    }
    return (
      <div className={classnames('mdl-layout', 'mdl-layout--fixed-header')}>
        {meta}
        <Header params={params}/>
        {loaded && (
          <DetailsContent params={params} answer={data}/>
        ) || (
          <h3></h3>
        )}
      </div>
    );
  }
}
