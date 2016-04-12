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
  },

  [ADD_CARD_TO_COLLECTION]: (state, action) => {
    let updatedCollection = _.map(state.data.collections, col => {
      if (col.id === action.collectionId) {
        let newCardsList = col;
        newCardsList.cards.concat(action.card);
        return newCardsList;
      }
      return col
    });
    return {data: [...updatedCollection]};
  },

  [DELETE_CARD_FROM_COLLECTION]: (state, action) => {
    let updatedCollection = _.map(state.data.collections, col => {
      if (col.id === action.collectionId) {
        let newCardsList = _.filter(col.cards, card => {
          return card.id !== action.cardId;
        });
        return newCardsList;
      }
      return col
    });
    return {data: [...updatedCollection]};
  }

});
