import {
  REDIRECT,
  RESET_COLLECTION_INFO,
  SWITCH_PLACEHOLDER,
  SEARCH_CARDS,
  ADD_CARD_TO_COLLECTION,
  DELETE_CARD_FROM_COLLECTION,
  SWITCH_ADD_CARD_MODAL,
  SAVE_COLLECTION_INFO,
  API_REQUEST,
  LOGIN,
  LOGOUT,
  CREATE_COLLECTION_DIALOG,
  SHARE_CARD_MODAL
} from './actionTypes';

export function redirect(path, query = {}) {
  return {
    type: REDIRECT,
    path,
    query
  };
}

// Auth

export function toggleLoginModal() {
  return {
    type: LOGIN
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}

// Collections
export function switchCreateCollectionDialog(cardId) {
  return {
    type: CREATE_COLLECTION_DIALOG,
    cardId
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

export function getCardsSuggestions(query, type = '') {
  return {
    type: API_REQUEST,
    method: 'post',
    path: 'suggest',
    data: {
      query,
      type
    }
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

export function toggleShareModal() {
  return {
    type: SHARE_CARD_MODAL
  };
}

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
    path: 'question',
    data: {
      badRequestIs200: true,
      question,
      meta: {
        includeCardFormatting: true
      },
      type,
      wantUnique: false,
      filter
    }
  };
}
export function suggestCards(query, type = '') {
  return {
    type: API_REQUEST,
    method: 'post',
    path: 'suggestCards',
    data: {
      query,
      type
    }
  };
}

export function filterResults(type = 'PlaceWithOpeninghours', filter = {}, page = 0) {
  return {
    type: API_REQUEST,
    method: 'post',
    path: 'search',
    data: {
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
    }
  };
}

export function loadMoreResults(page, filterContext) {
  return {
    type: API_REQUEST,
    method: 'post',
    path: 'search',
    data: {
      ...filterContext,
      page
    }
  };
}

export function loadCards(ids) {
  return {
    type: API_REQUEST,
    method: 'post',
    path: 'entities/actions/getBatch',
    data: {
      ids
    }
  };
}
