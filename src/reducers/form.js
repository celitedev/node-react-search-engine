import {
  SWITCH_FORM,
  HIDE_ALL_FORMS
} from '../actionTypes';
import createStore from './createStore';

export default createStore({
  id: null,
  layout: false,
  widget: false,
  blog: false
}, {

  [SWITCH_FORM]: (state, action) => ({
    id: action.id,
    layout: (action.name === 'layout.twig'),
    widget: (action.name === 'widget.js'),
    blog: (action.name === 'blog.model')
  }),

  [HIDE_ALL_FORMS]: () => ({layout: false, widget: false, blog: false})

});
