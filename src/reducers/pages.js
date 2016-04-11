import { makeTriplet } from '../actionTypes';
import createStore from '../reducers/createStore';

export function pageReducer(name) {
  const [START, SUCCESS, FAILURE] = makeTriplet(name);

  return createStore({
    loaded: false,
    loading: false,
    data: null,
    error: null
  }, {
    [START]: () => ({ loaded: false, loading: true, data: null, error: null }),
    [SUCCESS]: (state, action) => ({ loaded: true, loading: false, data: action.payload, error: null }),
    [FAILURE]: (state, action) => ({ loaded: false, loading: false, data: null, error: action.error })
  });
}

export const pageReducers = {};

export default pageReducers;
