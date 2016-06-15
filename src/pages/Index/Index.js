import React, {Component} from 'react';
import {pure} from 'recompose';
import KwhenSearch from '../../components/Index/KwhenSearch.js';
import Footer from '../../components/Index/Footer.js';

const Index = pure(() => (
  <div>
    <KwhenSearch />
    <Footer />
  </div>
));

export default Index;
