/* eslint no-alert: 0 */

import React from 'react';
import {Link as RouterLink} from 'react-router';
import storeShape from 'redux-simple/lib/storeShape';

export default class Link extends React.Component {

  static contextTypes = {
    store: storeShape.isRequired
  };

  onClick(e) {
    if (this.context.store.getState().navigation.confirm) {
      if (!confirm("Don't go yet! Your changes aren't saved.\n\nAre you sure want to leave this page?")) {
        e.preventDefault();
      }
    }
  }

  render() {
    return <RouterLink onClick={::this.onClick} {...this.props} />;
  }

}
