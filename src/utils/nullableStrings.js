import _ from 'lodash';

export default function nullableStrings(val) {
  if (_.isArray(val)) {
    return val.map(nullableStrings);
  }
  if (_.isObject(val)) {
    return _.mapValues(val, nullableStrings);
  }
  if (_.isString(val) && _.isEmpty(val)) {
    return null;
  }
  return val;
}
