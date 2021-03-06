import qs from 'qs';

import config from './config';
import fetch from './fetch';

const ONCE_CACHE = {};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  if (response.status === 204 || response.status === 202) {
    return response.text().then(res => res, () => null);
  }
  return response.json().then(res => res, () => null);
}

function combineUrl(path, query) {
  let url = `${config.publicPath}${path}`; // todo add base url  ${config.baseApiUrl}
  const queryString = qs.stringify(query);
  if (queryString) {
    url = `${url}?${queryString}`;
  }
  return url;
}

function readArrayBuffer(file) {
  return new Promise(resolve => {
    const reader = new FileReader;
    reader.onload = () => resolve(reader.result);
    reader.readAsArrayBuffer(file);
  });
}

async function request(method, path, data = null, query = null, session = null) {
  const url = combineUrl(path, query);
  const options = {
    method,
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  };
  if (typeof window !== 'undefined' && (data instanceof window.File || data instanceof window.Blob)) {
    options.headers = {
      ...options.headers,
      'Content-Type': data.type || 'application/json',
      'Content-Disposition': 'attachment; filename=upload'
    };
    options.body = await readArrayBuffer(data);
  } else {
    if (data) {
      options.body = JSON.stringify(data);
    }
  }

  if (session) {
    options.headers.Cookie = `sessionid=${session}`;
  }

  //noinspection JSUnresolvedFunction
  const result = await fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);

  return result;
}

async function get(path, query = null) {
  return await request('get', path, null, query);
}

async function post(path, data = null, query = null) {
  return await request('post', path, data, query);
}

async function put(path, data = null, query = null) {
  return await request('put', path, data, query);
}

async function patch(path, data = null, query = null) {
  return await request('patch', path, data, query);
}

async function once(path, query = null) {
  if (typeof window !== 'undefined') {
    const url = combineUrl(path, query);

    if (!ONCE_CACHE[url]) {
      ONCE_CACHE[url] = get(path, query);
    }

    return await ONCE_CACHE[url];
  }

  return await get(path, query);
}

export default { request, get, post, put, patch, once };
