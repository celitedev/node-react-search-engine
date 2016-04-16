const fetch = process.env.SERVER_RENDERING ? require('node-fetch') : require('whatwg-fetch') && window.fetch;

export default fetch;
