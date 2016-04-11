import _ from 'lodash';

export default function mergePromise(promises) {
  const keys = Object.keys(promises);
  return Promise.all(keys.map(k => promises[k])).then(results => _.zipObject(keys, results));
}
