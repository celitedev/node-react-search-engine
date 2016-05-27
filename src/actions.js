import {
  REDIRECT,
  RESET_COLLECTION_INFO,
  SWITCH_PLACEHOLDER,
  SEARCH_CARDS,
  ADD_CARD_TO_COLLECTION,
  DELETE_CARD_FROM_COLLECTION,
  SWITCH_ADD_CARD_MODAL,
  SAVE_COLLECTION_INFO,
  API_REQUEST
} from './actionTypes';

export function redirect(path, query = {}) {
  return {
    type: REDIRECT,
    path,
    query
  };
}

// Collections

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

export function resetCollectionInfo() {
  return {
    type: RESET_COLLECTION_INFO
  };
}

export function getCards(query = '', type = 'all') {
  return {
    type: API_REQUEST,
    method: 'get',
    path: '/cards/getcards',
    query: {query, type}
  };
}

export function getCardsSuggestions(input) {
  return {
    type: API_REQUEST,
    method: 'get',
    path: '/cards/suggestions',
    query: input
  };
}

export function saveCollection(collection) {
  return {
    type: API_REQUEST,
    method: 'post',
    path: '/collections/save',
    data: collection
  };
}

// Cards

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
  return {
    type: DELETE_CARD_FROM_COLLECTION,
    collectionId,
    cardId
  };
}

// API

export function answerTheQuestion(question, type = '', filter = {} ) {
  return {
    type: API_REQUEST,
    method: 'post',
    path: 'http://testing123.kwhen.com:3000/question',
    data: JSON.stringify({
      badRequestIs200: true,
      question,
      meta: {
        includeCardFormatting: true
      },
      type,
      wantUnique: false,
      filter
    })
  };
}

export function filterResults(type = 'PlaceWithOpeninghours', filter = {}, page = 0) {
  return {
    type: API_REQUEST,
    method: 'post',
    path: 'http://testing123.kwhen.com:3000/search',
    data: JSON.stringify({
      meta: {
        includeCardFormatting: true
      },
      sort: [
        {
          type: 'doc'
        }
      ],
      page,
      type,
      wantUnique: false,
      filter
    })
  };
}

export function loadMoreResults(page, filter, type = 'PlaceWithOpeninghours') {
  return {
    type: API_REQUEST,
    method: 'post',
    path: 'http://testing123.kwhen.com:3000/search',
    data: JSON.stringify({
      filter,
      sort: [
        {
          type: 'doc'
        }
      ],
      page,
      meta: {
        includeCardFormatting: true
      },
      type,
      wantUnique: false
    })
  };
}
