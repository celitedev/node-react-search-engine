import React, {PropTypes} from 'react';
import serialize from 'serialize-javascript';
import {find} from 'lodash';
import injectTapEventPlugin from 'react-tap-event-plugin';
import config from '../config.js';

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
    const {markup, chunks, state, head} = this.props;
    const hydrate = `window.reduxState = ${serialize(state)};`;
    const clientCssBundle = find(chunks.client, isCss);
    const commonCssBundle = find(chunks.common, isCss);
    const clientBundle = find(chunks.client, isJs);
    const commonBundle = find(chunks.common, isJs);
    const {containerId} = config.googleTagManager;
    const renderedHead = head.title.toString() + head.meta.toString() + head.link.toString();
    return (
      <html lang='en'>
      <head dangerouslySetInnerHTML={{__html: renderedHead}}/>
      <body>

      <script dangerouslySetInnerHTML={{__html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${containerId}');`
      }} />


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
