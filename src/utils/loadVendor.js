const debug = require('debug')('tutor:vendor');

const loadedScripts = {};

class LoadError extends Error {
}

export function loadScript(url) {
  if (!loadedScripts[url]) {
    return new Promise((resolve, reject) => {
      debug('load script', url);
      const script = document.createElement('script');
      script.setAttribute('src', url);
      script.setAttribute('async', 'async');
      script.addEventListener('load', () => {
        debug('script loaded', url);
        resolve({ url });
      });
      script.addEventListener('error', () => {
        debug('script failure', url);
        reject(new LoadError(url));
      });
      document.body.appendChild(script);
    });
  }
  return loadedScripts[url];
}

const loadedStyles = {};

export function loadStyle(url) {
  if (!loadedStyles[url]) {
    return new Promise((resolve, reject) => {
      debug('load style', url);
      const style = document.createElement('link');
      style.setAttribute('rel', 'stylesheet');
      style.setAttribute('href', url);
      style.addEventListener('load', () => {
        debug('style loaded', url);
        resolve({ url });
      });
      style.addEventListener('error', () => {
        debug('style failure', url);
        reject(new LoadError(url));
      });
      document.head.appendChild(style);
    });
  }
  return loadedStyles[url];
}
