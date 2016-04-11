import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';

import Header from '../Header';
import Footer from '../Footer';

function layoutProps(state) {
  return state;
}

@connect(layoutProps)
export default class AdvancedLayout extends PureComponent {

  static propTypes = {
    children: React.PropTypes.element
  };

  render() {
    const {children} = this.props;
    return (
      <div>
        <Header/>
        <div>
          {children}
        </div>
        <Footer/>
      </div>
    );
  }

}
