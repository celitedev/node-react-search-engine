import createStore from './createStore';

import {
  SNACKBAR
} from '../actionTypes';

export default createStore({
  snackbar: false
}, {
  [SNACKBAR]: (state, action) => ({snackbar: !state.snackbar, msg: action.msg, error: action.err})
});
