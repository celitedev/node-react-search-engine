import React from 'react';
import PureComponent from 'react-pure-render/component';
import KwhenSearch from '../../components/Index/KwhenSearch.js';

export default class Index extends PureComponent {

  render() {
    return (
      <div className={styles.background}>
        <KwhenSearch />
      </div>
    );
  }
}
