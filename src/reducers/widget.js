import {
  ADD_WIDGET,
  EDIT_WIDGET,
  REMOVE_WIDGET
} from '../actionTypes';
import createStore from './createStore';

export default createStore({
  widgets: []
}, {

  [ADD_WIDGET]: (state, action) => ({
    widgets: [...state.widgets, {
      id: state.widgets.length === 0 ? 1 : state.widgets[state.widgets.length - 1].id + 1,
      name: action.name,
      html: '',
      css: '',
      jsClient: '',
      jsServer: ''
    }]
  }
  ),

  [EDIT_WIDGET]: (state, action) => ({
    widgets: state.widgets.map(t => {
      if (t.id !== action.id) {
        return t;
      }
      const params = action.params;
      return Object.assign({}, t, {
        html: params.html ? params.html : t.html,
        css: params.css ? params.css : t.css,
        jsClient: params.jsClient ? params.jsClient : t.jsClient,
        jsServer: params.jsServer ? params.jsServer : t.jsServer
      });
    })
  }),

  [REMOVE_WIDGET]: (state, action) => ({
    widgets: state.widgets.filter((item) => {
      return item.id !== action.id;
    })
  })

});
