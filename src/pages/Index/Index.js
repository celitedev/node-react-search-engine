import React, {Component} from 'react';
import {pure} from 'recompose';
import KwhenSearch from '../../components/Index/KwhenSearch.js';
import Footer from '../../components/Footer/Footer.js';

const Index = pure(() => (
  <div className='l-indexPage' style={{background: '#00cd75'}}>
    <KwhenSearch />
    <Footer className='fixed' />
  </div>
));

export default Index;
