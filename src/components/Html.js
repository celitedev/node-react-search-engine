import React, {PropTypes} from 'react';
import serialize from 'serialize-javascript';
import _ from 'lodash';
import injectTapEventPlugin from 'react-tap-event-plugin';

import config from '../config';

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
    const clientCssBundle = _.find(chunks.client, isCss);
    const commonCssBundle = _.find(chunks.common, isCss);
    const clientBundle = _.find(chunks.client, isJs);
    const commonBundle = _.find(chunks.common, isJs);
    return (
      <html lang='en'>
      <head>
        <meta charSet='utf-8'/>
        <meta name='viewport' content='width=device-width, initial-scale=1'/>
        <meta httpEquiv='x-ua-compatible' content='ie=edge'/>

        <title>{state && state.meta.title}</title>
        <meta name='description' content={state && state.meta.description}/>
        <meta property='og:image' content={state && state.meta.ogImage}/>
        <meta property='twitter:image' content={state && state.meta.twitterImage}/>
        <link rel='manifest' href={`${config.django.staticUrl}manifest.json`}/>
        <meta name='msapplication-TileColor' content='#ffffff'/>
        <meta name='theme-color' content='#ffffff'/>
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
