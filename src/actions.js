import _ from 'lodash';

import {
  CREATE_COLLECTION,
  UPDATE_COLLECTIION,
  DELETE_COLLECTION,
  SWITCH_PLACEHOLDER,
  CREATE_COLLECTION_MODAL,
  UPDATE_COLLECTION_MODAL,
  DELETE_COLLECTION_MODAL,
  SEARCH_CARDS,
  ADD_CARD_TO_COLLECTION,
  DELETE_CARD_FROM_COLLECTION,
  ADD_CARDS,
  SWITCH_ADD_CARD_MODAL,
  SAVE_COLLECTION_INFO,
  API_REQUEST
} from './actionTypes';


/**
 *Collection actions
 */
export function createCollection(collection) {
  return {
    type: CREATE_COLLECTION,
    collection
  };
}

export function updateCollection(id, collection) {
  return {
    type: UPDATE_COLLECTIION,
    id,
    collection
  };
}

export function deleteCollection(id) {
  return {
    type: DELETE_COLLECTION,
    id
  };
}

export function switchPlaceholdersVisibility() {
  return {
    type: SWITCH_PLACEHOLDER
  };
}

export function switchAddCardModal() {
  return {
    type: SWITCH_ADD_CARD_MODAL
  };
}

export function saveCollectionInfo(info) {
  return {
    type: SAVE_COLLECTION_INFO,
    info
  };
}

export function getCards() {
  return {
    type: API_REQUEST,
    method: 'get',
    path: '/cards'
  };
}

//export function createCollectionModalShow() {
//  return {
//    type: CREATE_COLLECTION_MODAL_SHOW
//  };
//}
//
//export function updateCollectionModalSHow() {
//  return {
//    type: UPDATE_COLLECTION_MODAL_SHOW
//  };
//}
//
//export function deleteCollectionModalShow() {
//  return {
//    type: DELETE_COLLECTION_MODAL_SHOW
//  };
//}
//
//export function createCollectionModalHide() {
//  return {
//    type: CREATE_COLLECTION_MODAL_HIDE
//  };
//}
//
//export function updateCollectionModalHide() {
//  return {
//    type: UPDATE_COLLECTION_MODAL_HIDE
//  };
//}
//
//export function deleteCollectionModalHide() {
//  return {
//    type: DELETE_COLLECTION_MODAL_HIDE
//  };
//}

/**
 *Card actions
 */
export function searchCards(text) {
  return {
    type: SEARCH_CARDS,
    text
  };
}

export function addCardToCollection(collectionId, card) {
  return {
    type: ADD_CARD_TO_COLLECTION,
    collectionId,
    card
  };
}

export function deleteCardFromCollection(collectionId, cardId) {
  console.log('Delete card', collectionId, cardId);
  return {
    type: DELETE_CARD_FROM_COLLECTION,
    collectionId,
    cardId
  };
}
