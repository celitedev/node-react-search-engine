import test from 'tape';

import wrapAsync from './wrapAsync';

test('wrapAsync', t => {
  t.plan(5);

  let step = 0;

  const states = [
    {loading: true, error: null},
    {loading: false},
    {loading: true, error: null},
    {error: 'fail'},
    {loading: false}
  ];

  class ComponentMock {

    setState(state) {
      t.deepEqual(state, states[step]);
      step++;
    }

    action() {
      return Promise.resolve('success');
    }

    failingAction() {
      return Promise.reject('fail');
    }

    async run() {
      await this::wrapAsync(this.action());
      await this::wrapAsync(this.failingAction());
    }

  }

  const mock = new ComponentMock();
  mock.run();
});
