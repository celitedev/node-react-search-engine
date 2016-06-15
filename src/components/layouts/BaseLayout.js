import React from 'react';
import {pure} from 'recompose';

const BaseLayout = pure(({children}) => (
  <div>
    {children}
  </div>
));

export default BaseLayout;
