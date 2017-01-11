import React, {Component} from 'react';
import {pure} from 'recompose';
import KwhenSearch from '../../components/Index/KwhenSearch.js';
import Footer from '../../components/Footer/Footer.js';
import Meta from '../../components/Common/Meta';


const Index = pure(() => (
  <div className='l-indexPage' style={{background: '#00cd75'}}>
    <Meta script={[{
      type: 'application/ld+json', innerHTML: `
        {
          '@context': 'http://schema.org',
          '@type': 'WebSite',
          'url': 'https://www.kwhen.com/',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://www.kwhen.com/answer/{search_term_string}',
            'query-input': 'required name=search_term_string'
            }
        }`}]}/>
    <KwhenSearch />
    <Footer className='fixed' />
  </div>
));

export default Index;
