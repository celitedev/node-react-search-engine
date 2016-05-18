import _ from 'lodash';

/**
 * update value in target under keyPath with given fn
 * @param {Object} target
 * @param {string[]} keyPath
 * @param {function()} fn
 * @returns {Object}
 */
export default function updateIn(target, keyPath, fn) {
  if (!keyPath.length) {
    return fn(target);
  }
  const [key, ...rest] = keyPath;
  const child = target ? target[key] : undefined;
  return {...target, [key]: updateIn(child, rest, fn)};
}

/**
 * add uniq item into target under keyPath
 * @param {Object} target
 * @param {string[]} keyPath
 * @param {*} item
 * @returns {Object}
 */
export function addIn(target, keyPath, item) {
  return updateIn(target, keyPath, val => _.union(val, [item]));
}

/**
 * remove uniq item from target under keyPath
 * @param {Object} target
 * @param {string[]} keyPath
 * @param {*} item
 * @returns {Object}
 */
export function removeIn(target, keyPath, item) {
  return updateIn(target, keyPath, val => _.without(val, item));
}

/**
 * increment value in target under keyPath
 * @param {Object} target
 * @param {string[]} keyPath
 * @returns {Object}
 */
export function incIn(target, keyPath) {
  return updateIn(target, keyPath, val => (val || 0) + 1);
}

/**
 * decrement value in target under keyPath
 * @param {Object} target
 * @param {string[]} keyPath
 * @returns {Object}
 */
export function decIn(target, keyPath) {
  return updateIn(target, keyPath, val => (val || 0) - 1);
}

/**
 * set value in target under keyPath to val
 * @param {Object} target
 * @param {string[]} keyPath
 * @param {*} val
 * @returns {Object}
 */
export function setIn(target, keyPath, val) {
  return updateIn(target, keyPath, () => val);
}

/**
 * unsets key in target under keyPath
 * @param {Object} target
 * @param {string[]} keyPath
 * @param {string} key
 * @returns {Object}
 */
export function unsetIn(target, keyPath, key) {
  return updateIn(target, keyPath, val => _.omit(val, key));
}

/**
 * merge value in target under keyPath with item
 * @param {Object} target
 * @param {string[]} keyPath
 * @param {Object} item
 * @returns {Object}
 */
export function mergeIn(target, keyPath, item) {
  return updateIn(target, keyPath, val => ({...val, ...item}));
}

const mappingFunctions = {
  $set: setIn,
  $dec: decIn,
  $inc: incIn,
  $remove: removeIn,
  $add: addIn,
  $unset: unsetIn,
  $merge: mergeIn,
  $update: updateIn
};

function collectUpdates(spec, keyPath = []) {
  return Object.keys(spec).reduce((updates, key) => {
    if (mappingFunctions[key]) {
      return [...updates, {keyPath, fn: mappingFunctions[key], value: spec[key]}];
    } else if (typeof spec[key] === 'object') {
      return [...updates, ...collectUpdates(spec[key], [...keyPath, key])];
    }
    throw new Error('invalid update spec');
  }, []);
}

export function update(target, spec) {
  return collectUpdates(spec).reduce(
    (result, updateSpec) => updateSpec.fn(result, updateSpec.keyPath, updateSpec.value),
    target
  );
}
