import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

export default (
  <Route path='/' component={require('./components/layouts/BaseLayout')}>
    <Route path='/playground' component={require('./pages/Playground/Playground')}/>
    <Route component={require('./components/layouts/AdvancedLayout')}>
      <IndexRoute component={require('./pages/Index/Index')}/>
    </Route>
    <Route path='/answer/:question' component={require('./components/layouts/AdvancedLayout')}>
      <IndexRoute component={require('./pages/Answer/Answer')}/>
    </Route>
    <Route path='/details/:id' component={require('./components/layouts/AdvancedLayout')}>
      <IndexRoute component={require('./pages/Details/Details')}/>
    </Route>
    <Route path='/search' component={require('./components/layouts/AdvancedLayout')}>
      <IndexRoute component={require('./pages/Search/Search')}/>
    </Route>
    <Route path='/mycollections' component={require('./components/layouts/AdvancedLayout')}>
      <IndexRoute component={require('./pages/MyCollections/MyCollections')}/>
    </Route>
    <Route path='/collections/new' component={require('./components/layouts/AdvancedLayout')}>
      <IndexRoute component={require('./pages/NewCollection/NewCollection')}/>
    </Route>
    <Route path='/collections/:collectionId' component={require('./components/layouts/AdvancedLayout')}>
      <IndexRoute component={require('./pages/NewCollection/NewCollection')}/>
    </Route>
    <Route component={require('./components/layouts/AdvancedLayout')}>
      <Route path='*' component={require('./pages/NotFound')}/>
    </Route>
  </Route>
);
