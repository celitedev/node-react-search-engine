import createStore from './createStore';
import _ from 'lodash';
import {
  CREATE_COLLECTION_DIALOG,
  UPDATE_COLLECTIION,
  DELETE_COLLECTION,
  SWITCH_PLACEHOLDER,
  SWITCH_ADD_CARD_MODAL,
  SAVE_COLLECTION_INFO,
  ADD_CARD_TO_COLLECTION,
  DELETE_CARD_FROM_COLLECTION,
  RESET_COLLECTION_INFO
} from '../actionTypes';

export default createStore({
  showPlaceholders: true,
  addCardModal: false,
  createCollectionModal: false,
  cardId: null,
  updateCollectionModal: false,
  deleteCollectionModal: false,
  savedCollectionInfo: {
    cards: [],
    img: {}
  }
}, {

  [CREATE_COLLECTION_DIALOG]: (state, action) => {
    return {createCollectionModal: !state.createCollectionModal, cardId: action.cardId};
  },

  [SAVE_COLLECTION_INFO]: (state, action) => {
    return {savedCollectionInfo: {...state.savedCollectionInfo, ...action.info}};
  },

  [RESET_COLLECTION_INFO]: () => {
    return {
      savedCollectionInfo: {
        cards: [],
        img: {},
        description: '',
        title: '',
        subTitle: '',
        name: ''
      }
    };
  },

  [SWITCH_PLACEHOLDER]: (state, action) => {
    return {showPlaceholders: !state.showPlaceholders};
  },
  [SWITCH_ADD_CARD_MODAL]: (state) => {
    return {addCardModal: !state.addCardModal};
  },
  [ADD_CARD_TO_COLLECTION]: (state, action) => {
    const updatedCollection = [Object.assign({}, action.card, {id: action.card.raw.id}), ...state.savedCollectionInfo.cards];
    return {savedCollectionInfo: Object.assign({}, state.savedCollectionInfo, {cards: updatedCollection})};
  },

  [DELETE_CARD_FROM_COLLECTION]: (state, action) => {
    const collection = state.savedCollectionInfo;
    return {savedCollectionInfo: Object.assign({}, state.savedCollectionInfo, {cards: _.filter(collection.cards, (item) => item.id !== action.cardId)})};
  }

});
