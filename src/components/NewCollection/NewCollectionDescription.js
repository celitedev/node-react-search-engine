import React from 'react';
import PureComponent from 'react-pure-render/component';
import _ from 'lodash';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import { saveCollectionInfo } from '../../actions';
import { connect } from 'redux-simple';

import MediumEditor from 'react-medium-editor';
import 'material-design-icons';

function collection(state) {
  const { showPlaceholders, savedCollectionInfo } = state.collection;
  return { showPlaceholders, savedCollectionInfo };
}

@connect(collection, {saveCollectionInfo})
export default class NewCollectionDescription extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      info: {
        title: props.savedCollectionInfo.title,
        subTitle: props.savedCollectionInfo.subTitle,
        description: props.savedCollectionInfo.description
      },
      model: props.savedCollectionInfo,
      image: props.savedCollectionInfo.img || {}
    };
  }

  componentDidMount() {
    const colInfo = this.props.savedCollectionInfo;
    this.props.saveCollectionInfo(Object.assign(colInfo, {cards: this.props.savedCollectionInfo ? this.props.savedCollectionInfo.cards || [] : this.props.collection.collection[0].cards}));
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
    this.props.saveCollectionInfo({...this.props.savedCollectionInfo, ...this.state.info, cards: this.props.savedCollectionInfo.cards});
  }

  handleTitleChange(title, medium) {
    this.setState({info: {
      ...this.state.info,
      title
    }});
    this.saveCollection();
  }

  handleSubTitleChange(subTitle, medium) {
    this.setState({info: {
      ...this.state.info,
      subTitle
    }});
    this.saveCollection();
  }

  handleDesciptionChange(description, medium) {
    this.setState({info: {
      ...this.state.info,
      description
    }});
    this.saveCollection();
  }

  render() {
    const {image, info} = this.state;
    return (
      <div className={classnames('mdl-grid', styles.root)}>
        <div className={classnames('mdl-cell mdl-cell--7-col', styles.formLayout)}>
          <MediumEditor
            className={styles.mediumEdit}
            tag='h4'
            text={info.title}
            onChange={::this.handleTitleChange}
            options={{
              toolbar: {buttons: ['bold', 'italic', 'underline']},
              placeholder: {
                text: 'Collection title',
                hideOnClick: true
              }}}
          />
          <MediumEditor
            className={styles.mediumEdit}
            tag='h6'
            text={info.subTitle}
            onChange={::this.handleSubTitleChange}
            options={{
              toolbar: {buttons: ['bold', 'italic', 'underline']},
              placeholder: {
                text: 'Subtitle',
                hideOnClick: true
              }}}
          />
          <Dropzone onDrop={this.onDrop.bind(this)} className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', _.isEmpty(image) && ::this.checkInput() ? styles.imgDropZone : styles.hideDragZone )}>
            <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          <div className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', _.isEmpty(image) ? styles.hideDragZone : '')}>
            <img className={styles.colImage} src={image.preview}/>
          </div>
          <MediumEditor
            className={styles.mediumEdit}
            tag='p'
            text={info.description}
            onChange={::this.handleDesciptionChange}
            options={{
              toolbar: {buttons: ['bold', 'italic', 'underline']},
              placeholder: {
                text: 'Description',
                hideOnClick: true
              }}}
          />
        </div>
      </div>
    );
  }
}
