import React from 'react';
import PureComponent from 'react-pure-render/component';
import _ from 'lodash';
import classnames from 'classnames';
import Form from 'react-formal';

import { collectionDescriptionSchema } from './descriptioSchema';

import 'material-design-icons';

function FormGroup({ children }) {
  return (
    <div className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', styles.formPlaceholder)}>
      {children}
    </div>
  );
}

export default class NewCollectionDescription extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      model: {},
      errors: {}
    };
  }

  onFormErrors(errors) {
    if (!_.isEqual(errors, this.state.errors)) {
      this.setState({
        errors
      });
    }
  }

  onFormChange(model) {
    if (!_.isEqual(model, this.state.model)) {
      this.setState({
        model
      });
    }
  }

  saveCollection() {

  }

  render() {
    const { placeholders } = this.props;
    const { model, errors } = this.state;
    return (
      <div className={classnames('mdl-grid', styles.root)}>
        <Form
          className={classnames('mdl-cell mdl-cell--8-col', styles.formLayout)}
          schema={collectionDescriptionSchema}
          value={model}
          errors={errors}
          onChange={this.onFormChange.bind(this)}
          onError={this.onFormErrors.bind(this)}
          onSubmit={this.saveCollection.bind(this)}
        >
          <FormGroup>
            <Form.Field name='title' type='text' id='title' className='mdl-textfield__input' errorClass='form-error'/>
            <label className='mdl-textfield__label' htmlFor='title'>Colection title</label>
            <Form.Message for='title' className='form-error-message'/>
          </FormGroup>
          <FormGroup>
            <Form.Field name='subTitle' type='text' id='subTitle' className='mdl-textfield__input' errorClass='form-error'/>
            <label className='mdl-textfield__label' htmlFor='subTitle'>Collection subtitle</label>
            <Form.Message for='subTitle' className='form-error-message'/>
          </FormGroup>
          <FormGroup>
            <Form.Field name='collectionImg' type='text' id='collectionImg' className='mdl-textfield__input' errorClass='form-error'/>
            <label className='mdl-textfield__label' htmlFor='collectionImg'>Image</label>
            <Form.Message for='collectionImg' className='form-error-message'/>
          </FormGroup>
          <FormGroup>
            <Form.Field name='description' type='text' id='description' className='mdl-textfield__input' errorClass='form-error'/>
            <label className='mdl-textfield__label' htmlFor='description'>Collection description</label>
            <Form.Message for='description' className='form-error-message'/>
          </FormGroup>

          <Form.Button type='submit' className='button-margin btn btn-primary' pullRight>
            Save
          </Form.Button>
        </Form>
      </div>
    );
  }
}
