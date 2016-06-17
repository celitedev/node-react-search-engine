import createStore from './createStore';

import {
  SHARE_CARD_MODAL
} from '../actionTypes';

export default createStore({
  shareCardModal: false,
  collection: false,
  itemName: null,
  id: null
}, {
  [SHARE_CARD_MODAL]: (state, action) => ({shareCardModal: !state.shareCardModal, collection: action.col, id: action.id, itemName: action.itemName})
});
