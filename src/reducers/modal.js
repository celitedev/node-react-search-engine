import {
  SWITCH_MODAL
} from '../actionTypes';
import createStore from './createStore';

export default createStore({
  flag: false
}, {
  [SWITCH_MODAL]: (state, action) => ({ flag: !state.flag })
});
