import createStore, { RESET_STORE } from './createStore';
import _ from 'lodash';

import {
  CREATE_COLLECTION,
  UPDATE_COLLECTIION,
  DELETE_COLLECTION,
} from '../actionTypes';

export default createStore({
  createCollectionModal: false,
  updateCollectionModal: false,
  deleteCollectionModal: false,
  data: []
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
  }

});
