import React, {PropTypes} from 'react';
import serialize from 'serialize-javascript';
import {find} from 'lodash';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
function isJs(item) {
  return /\.js$/.test(item.publicPath);
}

function isCss(item) {
  return /\.css$/.test(item.publicPath);
}

export default class Html extends React.Component {

  static propTypes = {
    markup: PropTypes.string.isRequired,
    chunks: PropTypes.shape({
      client: PropTypes.arrayOf(PropTypes.shape({
        publicPath: PropTypes.string
      })),
      common: PropTypes.arrayOf(PropTypes.shape({
        publicPath: PropTypes.string
      }))
    }),
    state: PropTypes.object
  };

  render() {
    const {markup, chunks, state} = this.props;
    const hydrate = `window.reduxState = ${serialize(state)};`;
    const clientCssBundle = find(chunks.client, isCss);
    const commonCssBundle = find(chunks.common, isCss);
    const clientBundle = find(chunks.client, isJs);
    const commonBundle = find(chunks.common, isJs);
    return (
      <html lang='en'>
      <head>
        <meta charSet='utf-8'/>
        <meta name='viewport' content='width=device-width, initial-scale=1'/>
        <meta httpEquiv='x-ua-compatible' content='ie=edge'/>

        <title>kwhen</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'/>
        <meta name='msapplication-TileColor' content='#ffffff'/>
        <meta name='theme-color' content='#ffffff'/>
        <script crossOrigin='anonymous' dangerouslySetInnerHTML={{__html: `
          !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.0.1"; //eslint-disable-line no-use-before-define
          analytics.load("sQZAVxCPmZBY6wTWFqM6vlArgT6O5Drm");
          analytics.page();
          }}();
        `}} />
      </head>
      <body>
      {commonCssBundle && <link rel='stylesheet' href={commonCssBundle.publicPath}/>}
      {clientCssBundle && <link rel='stylesheet' href={clientCssBundle.publicPath}/>}

      <div id='react-app' dangerouslySetInnerHTML={{__html: markup}}/>
      <script dangerouslySetInnerHTML={{__html: hydrate}}/>
      <script crossOrigin='anonymous' src={commonBundle.publicPath}/>
      <script crossOrigin='anonymous' src={clientBundle.publicPath}/>
      </body>
      </html>
    );
  }

}
