import createStore from './createStore';

import {
  SHARE_CARD_MODAL
} from '../actionTypes';

export default createStore({
  shareCardModal: false
}, {
  [SHARE_CARD_MODAL]: (state, action) => ({shareCardModal: !state.shareCardModal})
});
