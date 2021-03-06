import React, {Component} from 'react';
import Helmet from 'react-helmet';
import config from '../../config';

const env = (process.env.NODE_ENV || 'production').toLowerCase();

export default class Meta extends Component {

  render() {
    const fullUrl = config.fullUrl[env] || 'https://www.kwhen.com';
    const title = this.props.title || 'Kwhen. Knows When';
    const description = this.props.description || 'Find, share, and do all the best things in New York City. From sights to see, restaurants to try, events, music, books & more. Make plans right now or save ideas for later. All in one place!';
    const image = this.props.image || require('../../images/kwhen_logo.png');
    const scripts = this.props.script || [{
        type: 'application/ld+json', innerHTML: `
        {
          "@context": "http://schema.org",
          "@type": "WebSite",
          "url": "https://www.kwhen.com/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.kwhen.com/answer/{search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }`}];
    return (
      <Helmet title={title}
              meta={[
                {'charSet': 'utf-8'},
                {'name': 'viewport', 'content': 'width=device-width, initial-scale=1'},
                {'httpEquiv': 'x-ua-compatible', 'content': 'ie=edge'},
                {'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'},
                {'name': 'msapplication-TileColor', 'content': '#ffffff'},
                {'name': 'theme-color', 'content': '#ffffff'},
                {'name': 'description', 'content': description},
                {'property': 'og:title', 'content': title},
                {'property': 'og:description', 'content': description},
                {'property': 'og:image', 'content': fullUrl + image}
              ]}
              link={[
                {'rel': 'shortcut icon', 'type': 'image/x-icon', 'href': require('../../images/favicon.png') }
              ]}
              script={scripts}
      />
    );
  }
}
