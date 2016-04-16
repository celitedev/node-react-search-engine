import test from 'tape';

import mergePromise from './mergePromise';

test('mergePromise', t => {
  t.plan(2);

  mergePromise({
    foo: Promise.resolve('bar'),
    spam: Promise.resolve('eggs')
  }).then(res => {
    t.deepEqual(res, { foo: 'bar', spam: 'eggs' });
  }).catch(() => {
    t.fail();
  });

  mergePromise({
    foo: Promise.resolve('bar'),
    spam: Promise.reject('eggs')
  }).then(res => {
    res.fail();
  }).catch(err => {
    t.equal(err, 'eggs');
  });
});
