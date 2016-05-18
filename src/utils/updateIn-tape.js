import test from 'tape';

import updateIn, {update} from './updateIn';

test('updateIn empty', t => {
  const original = {};
  t.deepEqual(
    updateIn(original, ['a', 'b', 'c'], () => 1),
    {a: {b: {c: 1}}}
  );
  t.deepEqual(original, {});
  t.end();
});

test('updateIn nested', t => {
  const nested = {a: 1};
  const original = {nested};
  t.deepEqual(
    updateIn(original, ['nested', 'a'], val => val + 1),
    {nested: {a: 2}}
  );
  t.deepEqual(
    original,
    {nested: {a: 1}}
  );
  t.end();
});

test('update', t => {
  t.deepEqual(
    update(
      {a: {b: {c: 1}}, foo: ['bar']},
      {a: {b: {c: {$inc: true}}}, foo: {$add: 'spam'}, $merge: {spam: 'eggs'}}
    ),
    {a: {b: {c: 2}}, foo: ['bar', 'spam'], spam: 'eggs'}
  );
  t.end();
});
