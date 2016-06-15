import React from 'react';
import {pure} from 'recompose';

const AdvancedLayout = pure(({children}) => (
  <div>
    {children}
  </div>
));

export default AdvancedLayout;
