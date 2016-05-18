import {update} from '../utils/updateIn';

export const RESET_STORE = Symbol('RESET_STORE');

export default function createStore(defaultState, handlers, finalizer = x => x) {
  return (state = defaultState, action = {}) => {
    if (action.type) {
      const handler = handlers[action.type];
      if (handler) {
        const result = handler(state, action);
        if (result === RESET_STORE) {
          return defaultState;
        }
        if (result === null && typeof result === 'object') {
          return state;
        }
        return finalizer({...state, ...result});
      }
    }
    return state;
  };
}

export const createUpdateStore = (defaultState, handlers) => (state = defaultState, action = {}) => {
  const handler = handlers[action.type];
  if (handler) {
    const spec = handler(action);
    if (spec === RESET_STORE) {
      return defaultState;
    }
    return update(state, spec);
  }
  return state;
};
