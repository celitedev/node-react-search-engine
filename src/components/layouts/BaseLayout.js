import classnames from 'classnames';
import {connect} from 'redux-simple';
import PureComponent from 'react-pure-render/component';
import React from 'react';

// import ModalsContainer from '../ModalsContainer';

function baseLayoutProps(state) {
  return state;
}

@connect(baseLayoutProps)
export default class BaseLayout extends PureComponent {
  render() {
    const {children, loading, authenticated} = this.props;

    return (
      <div>
        {children}
        {/*<ModalsContainer />*/}

      </div>
    );
  }
}
