import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

export default (
  <Route path='/' component={require('./components/layouts/BaseLayout')}>
    <Route component={require('./components/layouts/AdvancedLayout')}>
      <IndexRoute component={require('./pages/Index/Index')}/>
    </Route>
    <Route path='/collections/new' component={require('./components/layouts/AdvancedLayout')}>
      <IndexRoute component={require('./pages/NewCollection/NewCollection')}/>
    </Route>
    <Route component={require('./components/layouts/AdvancedLayout')}>
      <Route path='*' component={require('./pages/NotFound')}/>
    </Route>
  </Route>
);
