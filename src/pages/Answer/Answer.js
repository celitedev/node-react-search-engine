import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';

import {page} from '../page';

import Header from '../../components/Common/Header.js';
import Answer from '../../components/Answer/Answer.js';
import {API_REQUEST} from '../../actionTypes';

@page('Index')
export default class Index extends PureComponent {
  static fetchData({dispatch}) {
    return {
      collections: dispatch({
        type: API_REQUEST,
        method: 'get',
        path: '/collections/all'
      })
    };
  }

  render() {
    const {data, loaded} = this.props;
    return (
      <div className={classnames(styles.background)}>
        <Header />
        <Answer />
      </div>
    );
  }

}
