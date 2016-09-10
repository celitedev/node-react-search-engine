import React, {Component} from 'react';
import { pure } from 'recompose';
import classnames from 'classnames';
import Paginator from 'react-pagify';
import segmentize from 'segmentize';

const debug = require('debug')('app: cardsSearch');

@pure
export default class Pagination extends Component {
  constructor(props, contex) {
    super(props);
  }

  render() {
    const {children, selectPage, data, page, perPage, className} = this.props;
    const pages = Math.ceil(data.length / Math.max(
        isNaN(perPage) ? 1 : perPage, 1)
    );

    return (
      <div>
        {children}
        <Paginator.Context className={classnames('pagify-pagination', styles.root, className)}
                           segments={segmentize({
                             page: page,
                             pages: pages,
                             beginPages: 1,
                             endPages: 1,
                             sidePages: 2
                           })} onSelect={selectPage} ellipsis={'…'}>
          <Paginator.Button
            className={page > 1 ? styles.previous : styles.disabled}
            page={page - 1}>
            Previous
          </Paginator.Button>
          <Paginator.Segment field='beginPages'/>
          <Paginator.Ellipsis
            className='ellipsis'
            previousField='beginPages'
            nextField='previousPages'>
            ***
          </Paginator.Ellipsis>
          <Paginator.Segment field='previousPages'/>
          <Paginator.Segment field='centerPage' className={styles.selected}/>
          <Paginator.Segment field='nextPages'/>
          <Paginator.Ellipsis
            className='ellipsis'
            previousField='nextPages'
            nextField='endPages'>
            ***
          </Paginator.Ellipsis>
          <Paginator.Segment field='endPages'/>
          <Paginator.Button
            className={page < pages ? styles.next : styles.disabled}
            page={page + 1}>
            Next
          </Paginator.Button>
        </Paginator.Context>
      </div>
    );
  }
}
