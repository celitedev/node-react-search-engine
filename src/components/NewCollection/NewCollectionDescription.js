import React from 'react';
import PureComponent from 'react-pure-render/component';
import _ from 'lodash';
import classnames from 'classnames';
import Form from 'react-formal';
import Dropzone from 'react-dropzone';
import { saveCollectionInfo } from '../../actions';
import { connect } from 'redux-simple';

import { collectionSchema } from './collectionSchemas';

import 'material-design-icons';

function FormGroup({ children }) {
  return (
    <div className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', styles.formInput)}>
      {children}
    </div>
  );
}

function collection(state) {
  const { showPlaceholders, savedCollectionInfo } = state.collection;
  return { showPlaceholders, savedCollectionInfo };
}

@connect(collection, {saveCollectionInfo})
export default class NewCollectionDescription extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      model: props.savedCollectionInfo,
      errors: {},
      image: props.savedCollectionInfo.img || {}
    };
  }

  componentDidMount() {
    const colInfo = this.props.savedCollectionInfo;
    this.props.saveCollectionInfo(Object.assign(colInfo, {cards: this.props.savedCollectionInfo ? this.props.savedCollectionInfo.cards || [] : this.props.collection.collection[0].cards}));
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
    this.props.saveCollectionInfo({...this.props.savedCollectionInfo, ...model, cards: this.props.savedCollectionInfo.cards});
  }

  checkInput(modelName) {
    return _.isEmpty(this.state.model[modelName]) ? styles.formPlaceholder : '';
  }

  onDrop(file) {
    this.setState({
      image: file[0]
    });
    this.props.saveCollectionInfo({...this.props.savedCollectionInfo, img: file[0]});
  }

  saveCollection() {

  }

  render() {
    const { model, errors, image } = this.state;
    return (
      <div className={classnames('mdl-grid', styles.root)}>
        <Form
          className={classnames('mdl-cell mdl-cell--7-col', styles.formLayout)}
          schema={collectionSchema}
          value={model}
          errors={errors}
          onChange={this.onFormChange.bind(this)}
          onError={this.onFormErrors.bind(this)}
          onSubmit={this.saveCollection.bind(this)}
        >
          <FormGroup>
            <Form.Field name='title' type='text' id='title' className={classnames('mdl-textfield__input', styles.titleLabel, ::this.checkInput('title'))} errorClass='form-error'/>
            <label className={classnames('mdl-textfield__label', styles.titleLabel)} htmlFor='title'>{model.title ? '' : 'Colection title'}</label>
            <Form.Message for='title' className='form-error-message'/>
          </FormGroup>
          <FormGroup>
            <Form.Field name='subTitle' type='text' id='subTitle' className={classnames('mdl-textfield__input', styles.subTitleLabel, ::this.checkInput('subTitle'))} errorClass='form-error'/>
            <label className={classnames('mdl-textfield__label', styles.subTitleLabel)} htmlFor='subTitle'>{model.subTitle ? '' : 'Collection subtitle'}</label>
            <Form.Message for='subTitle' className='form-error-message'/>
          </FormGroup>
          <Dropzone onDrop={this.onDrop.bind(this)} className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', _.isEmpty(image) && ::this.checkInput() ? styles.imgDropZone : styles.hideDragZone )}>
            <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          <div className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', _.isEmpty(image) ? styles.hideDragZone : '')}>
            <img className={styles.colImage} src={image.preview}/>
          </div>
          <FormGroup>
            <Form.Field name='description' type='textarea' id='description' className={classnames('mdl-textfield__input', ::this.checkInput('description'))} errorClass='form-error'/>
            <label className={classnames('mdl-textfield__label', styles.descriptionLabel)} htmlFor='description'>{model.description ? '' : 'Collection description'}</label>
            <Form.Message for='description' className='form-error-message'/>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
