import _ from 'lodash';

import {
  ADD_WIDGET,
  REMOVE_WIDGET,
  EDIT_WIDGET,
  SWITCH_MODAL,
  SWITCH_FORM,
  HIDE_ALL_FORMS
} from './actionTypes';

export function addWidget(name) {
  return {
    type: ADD_WIDGET,
    name
  };
}

export function removeWidget(id) {
  return {
    type: REMOVE_WIDGET,
    id
  };
}

export function editWidget(id, params) {
  return {
    type: EDIT_WIDGET,
    id,
    params
  };
}

export function switchAddWidgetModal() {
  return {
    type: SWITCH_MODAL
  };
}

export function showEditWidgetForm(name, id) {
  return {
    type: SWITCH_FORM,
    name,
    id
  };
}

export function hideAllEditWidgetForms() {
  return {
    type: HIDE_ALL_FORMS
  };
}
