import { take, put, fork, call } from 'redux-saga/effects';

import delay from '../utils/delay';
import { TOAST_ADD, TOAST_REMOVE } from '../actionTypes';

function* removeToast(id) {
  yield call(delay, 5000);
  yield put({
    type: TOAST_REMOVE,
    id
  });
}

function* toast() {
  while (true) {
    const { id } = yield take(TOAST_ADD);
    yield fork(removeToast, id);
  }
}

export default [toast];
