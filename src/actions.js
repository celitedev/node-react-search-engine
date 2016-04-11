import _ from 'lodash';

import {
  CREATE_COLLECTION,
  UPDATE_COLLECTIION,
  DELETE_COLLECTION,
  CREATE_COLLECTION_MODAL,
  UPDATE_COLLECTION_MODAL,
  DELETE_COLLECTION_MODAL,
  ADD_CARDS
} from './actionTypes';

export function createCollection(name) {
  return {
    type: CREATE_COLLECTION,
    name
  }
}

export function updateCollection(id, name) {
  return {
    type: UPDATE_COLLECTIION,
    id,
    name
  }
}

export function deleteCollection(id) {
  return {
    type: DELETE_COLLECTION,
    name
  }
}

export function addCards(id) {
  return {
    type: DELETE_COLLECTION,
    name
  }
}

export function createCollectionModalShow() {
  return {
    type: CREATE_COLLECTION_MODAL_SHOW
  }
}

export function updateCollectionModalSHow() {
  return {
    type: UPDATE_COLLECTION_MODAL_SHOW
  }
}

export function deleteCollectionModalShow() {
  return {
    type: DELETE_COLLECTION_MODAL_SHOW
  }
}

export function createCollectionModalHide() {
  return {
    type: CREATE_COLLECTION_MODAL_HIDE
  }
}

export function updateCollectionModalHide() {
  return {
    type: UPDATE_COLLECTION_MODAL_HIDE
  }
}

export function deleteCollectionModalHide() {
  return {
    type: DELETE_COLLECTION_MODAL_HIDE
  }
}
