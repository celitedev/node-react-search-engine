export default store => next => action => {
  if (action.triplet) {
    const [init, success, failure] = action.triplet;
    store.dispatch(Object.assign({}, action.extra, { type: init }));
    return action.promise
      .then(payload => store.dispatch({ ...action.extra, payload, type: success }))
      .catch(error => store.dispatch({ ...action.extra, error, type: failure }));
  }

  return next(action);
};
