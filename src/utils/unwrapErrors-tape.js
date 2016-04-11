import test from 'tape';

import unwrapErrors from './unwrapErrors';

test('unwrapErrors', t => {
  t.deepEqual(
    unwrapErrors({ foo: [{ bar: ['err'] }, { spam: ['eggs'] }] }),
    { 'foo[0].bar': ['err'], 'foo[1].spam': ['eggs'] }
  );
  t.end();
});
