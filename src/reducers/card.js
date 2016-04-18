import createStore, { RESET_STORE } from './createStore';

import {
  SEARCH_CARDS,
  ADD_CARD_TO_COLLECTION,
  DELETE_CARD_FROM_COLLECTION,
} from '../actionTypes';

export default createStore({
  data: []
}, {

  //TODO
  [SEARCH_CARDS]: (state, action) => {
    return {data: [...state.data.collections]};
  }

});
