import {FETCHER_START, FETCHER_SUCCESS, FETCHER_FAILURE} from '../actionTypes';

const DEFAULT_STATE = {
  loading: false,
  error: null,
  pending: 0,
  state: null
};

export default function fetcher(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case FETCHER_START:
      return {...state, loading: true, pending: state.pending + 1};
    case FETCHER_FAILURE:
      return {...state, loading: state.pending > 1, pending: state.pending - 1, error: action.error};
    case FETCHER_SUCCESS:
      return {...state, state: action.state, loading: state.pending > 1, pending: state.pending - 1};
    default:
      return state;
  }
}
