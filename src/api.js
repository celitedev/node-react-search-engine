import qs from 'qs';

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
  let url = `${path}`;
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

function tmpGet(path, query = null, method, data) {
  return new Promise((resolve, reject) => {
    const url = combineUrl(path, query);
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        const data = JSON.parse(req.responseText);
        resolve(data);
      }
    };
    req.onerror = () => {
      reject(req);
    };
    req.open(method.toUpperCase(), url, false);
    req.send(data);
  });
}

async function request(method, path, data = null, query = null, session = null) {
  return await tmpGet(path, query, method, data);
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

export default {request, get, post, put, patch, once};
