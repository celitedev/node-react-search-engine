/* eslint no-console: 0 */

import {
  REDIRECT,
  CREATE_COLLECTION,
  UPDATE_COLLECTIION,
  DELETE_COLLECTION,
  SWITCH_PLACEHOLDER,
  SEARCH_CARDS,
  ADD_CARD_TO_COLLECTION,
  DELETE_CARD_FROM_COLLECTION,
  SWITCH_ADD_CARD_MODAL,
  SAVE_COLLECTION_INFO,
  API_REQUEST
} from './actionTypes';

export function redirect (path, query = {}) {
  return {
    type: REDIRECT,
    path,
    query
  };
}
/**
 *Collection actions
 */
export function createCollection (collection) {
  return {
    type: CREATE_COLLECTION,
    collection
  };
}

export function updateCollection (id, collection) {
  return {
    type: UPDATE_COLLECTIION,
    id,
    collection
  };
}

export function deleteCollection (id) {
  return {
    type: DELETE_COLLECTION,
    id
  };
}

export function switchPlaceholdersVisibility () {
  return {
    type: SWITCH_PLACEHOLDER
  };
}

export function switchAddCardModal () {
  return {
    type: SWITCH_ADD_CARD_MODAL
  };
}

export function saveCollectionInfo (info) {
  return {
    type: SAVE_COLLECTION_INFO,
    info
  };
}

export function getCards (query = '', type = 'all') {
  return {
    type: API_REQUEST,
    method: 'get',
    path: '/cards/getcards',
    query: {query, type}
  };
}

export function getCardsSuggestions (input) {
  return {
    type: API_REQUEST,
    method: 'get',
    path: '/cards/suggestions',
    query: input
  };
}

export function saveCollection (collection) {
  return {
    type: API_REQUEST,
    method: 'post',
    path: '/collections/save',
    data: collection
  };
}

/**
 *Card actions
 */
export function searchCards (text) {
  return {
    type: SEARCH_CARDS,
    text
  };
}

export function addCardToCollection (collectionId, card) {
  return {
    type: ADD_CARD_TO_COLLECTION,
    collectionId,
    card
  };
}

export function deleteCardFromCollection (collectionId, cardId) {
  return {
    type: DELETE_CARD_FROM_COLLECTION,
    collectionId,
    cardId
  };
}
