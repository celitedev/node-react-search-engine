import _ from 'lodash';

function makePath(path) {
  const chunks = [];
  let index = 0;
  for (const part of path) {
    if (_.isNumber(part)) {
      chunks.push(`[${part}]`);
    } else {
      if (index === 0) {
        chunks.push(part);
      } else {
        chunks.push(`.${part}`);
      }
    }
    index++;
  }
  return chunks.join('');
}

function unwrapErrorsRecur(errors, path, wrappedErrors) {
  Object.keys(wrappedErrors).forEach(key => {
    const val = wrappedErrors[key];
    if (_.isArray(val) && _.isObject(val[0])) {
      val.forEach((subval, index) => {
        unwrapErrorsRecur(errors, [...path, key, index], subval);
      });
    } else if (_.isArray(val) && _.isString(val[0])) {
      errors[makePath([...path, key])] = val;
    } else {
      throw new Error('unwrapping failed');
    }
  });
}

export default function unwrapErrors(wrappedErrors) {
  const errors = {};
  unwrapErrorsRecur(errors, [], wrappedErrors);
  return errors;
}
