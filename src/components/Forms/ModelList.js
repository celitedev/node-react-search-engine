import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import _ from 'lodash';
import Form from 'react-formal';
import { modelListSchema } from './editFormSchema';
import { Grid, Row, Col, Input, Panel, Button } from 'react-bootstrap';
import { connect } from 'redux-simple';
import { editWidget, hideAllEditWidgetForms, removeWidget } from '../../actions';

const debug = require('debug')('error: ModelListForm');

function modelListProps(state) {
  const { form } = state;
  const { widget } = state;
  const model = widget.widgets[form.id];
  return {form, widget, model};
}

function FormGroup({ children }) {
  return (
    <div className='form-groupe'>
      {children}
    </div>
  );
}

@connect(modelListProps, { editWidget, hideAllEditWidgetForms, removeWidget })
export default class LayoutTwig extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      model: {
        html: '',
        css: '',
        jsClient: '',
        jsServer: '',
        error: false
      },
      errors: {}
    };
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.widget) return;
    const widget = _.find(newProps.widget.widgets, {id: newProps.form.id});
    this.setState({
      model: widget
    });
  }

  onFormErrors(errors) {
    if (!_.isEqual(errors, this.state.errors)) {
      debug('form errors', errors);
      this.setState({
        errors
      });
    }
  }

  onFormChange(model) {
    if (!_.isEqual(model, this.state.model)) {
      debug('form change', model);
      this.setState({
        model
      });
    }
  }

  cancel () {
    this.props.removeWidget( this.props.form.id );
    this.props.hideAllEditWidgetForms();
  }

  saveWidget () {
    if (_.isEmpty(this.state.errors)) {
      this.props.editWidget( this.props.form.id, this.state.model );
      this.props.hideAllEditWidgetForms();
    }
  }

  render() {
    const { blog, widget } = this.props.form;
    const { errors, model } = this.state;

    if (!blog && !widget) {
      return null;
    }

    return (
      <Grid fluid>
        <Form
          className='form-horizontal'
          schema={modelListSchema}
          value={model}
          errors={errors}
          onChange={this.onFormChange.bind(this)}
          onError={this.onFormErrors.bind(this)}
          onSubmit={this.saveWidget.bind(this)}
        >
        <Row>
          <h2 className='widget-name'>modelList.widget</h2>
        </Row>
        <Row className={_.isEmpty(this.state.errors) ? 'showError' : ''}>
          <Col xs={12} md={6}>
            <Panel bsStyle='danger' className='error-container'>
              Errors found...
            </Panel>
          </Col>
        </Row>
        <Row>

            <Col xs={12} md={6}>
              <FormGroup>
                <label className='col-xs-2'>HTML</label>
                <Form.Field name='html' type='textarea' rows='8' className='col-xs-10' errorClass='form-error'/>
                <Form.Message for='html' className='form-error-message'/>
              </FormGroup>
              <FormGroup>
                <label className='col-xs-2'>CSS</label>
                <Form.Field name='css' type='textarea' rows='8' className='col-xs-10' errorClass='form-error'/>
                <Form.Message for='css' className='form-error-message'/>
              </FormGroup>
              <FormGroup>
                <label className='col-xs-2'>Javascript(server)</label>
                <Form.Field name='jsServer' type='textarea' rows='8' className='col-xs-10' errorClass='form-error'/>
                <Form.Message for='jsServer' className='form-error-message'/>
              </FormGroup>
              <FormGroup>
                <label className='col-xs-2'>Javascript(client)</label>
                <Form.Field name='jsClient' type='textarea' rows='8' className='col-xs-10' errorClass='form-error'/>
                <Form.Message for='jsClient' className='form-error-message'/>
              </FormGroup>
            </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} >
            <Button className='button-margin' onClick={this.cancel.bind(this)} >
              Delete
            </Button>
            <Form.Button type='submit' className='button-margin btn btn-primary' pullRight>
              Save
            </Form.Button>
          </Col>
        </Row>
        </Form>
      </Grid>
    );
  }
}
