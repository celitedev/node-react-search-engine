import createStore, { RESET_STORE } from './createStore';
import _ from 'lodash';

import {
  CREATE_COLLECTION,
  UPDATE_COLLECTIION,
  DELETE_COLLECTION,
  SWITCH_PLACEHOLDER,
  SWITCH_ADD_CARD_MODAL,
  SAVE_COLLECTION_INFO,
  ADD_CARD_TO_COLLECTION,
  DELETE_CARD_FROM_COLLECTION
} from '../actionTypes';

export default createStore({
  showPlaceholders: true,
  addCardModal: false,
  createCollectionModal: false,
  updateCollectionModal: false,
  deleteCollectionModal: false,
  data: [],
  savedCollectionInfo: {}
}, {

  [CREATE_COLLECTION]: (state, action) => {
    return {data: [...state.data.collections, action.collection]};
  },

  [UPDATE_COLLECTIION]: (state, action) => {
    const updatedCollection = _.map(state.data.collections, col => {
      if (col.id === action.id) {
        return action.collection;
      }
      return col;
    });
    return {data: [...updatedCollection]};
  },

  [DELETE_COLLECTION]: (state, action) => {
    const updatedCollection = _.filter(state.data.collections, col => {
      return col.id !== action.id;
    });
    return {data: [...updatedCollection]};
  },
  [SAVE_COLLECTION_INFO]: (state, action) => {
    return {savedCollectionInfo: action.info};
  },

  [SWITCH_PLACEHOLDER]: (state, action) => {
    return {showPlaceholders: !state.showPlaceholders};
  },
  [SWITCH_ADD_CARD_MODAL]: (state) => {
    return {addCardModal: !state.addCardModal};
  },
  [ADD_CARD_TO_COLLECTION]: (state, action) => {
    const updatedCollection = [ ...state.savedCollectionInfo.collection.cards, Object.assign({}, action.card, { collectionId: action.collectionId })];
    return {savedCollectionInfo: { collection: Object.assign({}, ...state.savedCollectionInfo.collection, {cards: updatedCollection}) } };
  },

  [DELETE_CARD_FROM_COLLECTION]: (state, action) => {
    const collection = state.savedCollectionInfo.collection;
    return { savedCollectionInfo: Object.assign({}, state.savedCollectionInfo, { collection: Object.assign({}, ...collection, { cards: _.filter(collection.cards, (item) => item.id !== action.cardId ) }) } ) };
  }

});
