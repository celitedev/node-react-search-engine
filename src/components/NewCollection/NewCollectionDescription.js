import React from 'react';
import PureComponent from 'react-pure-render/component';
import _ from 'lodash';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import { saveCollectionInfo } from '../../actions';
import { connect } from 'redux-simple';
import MediumEditor from 'react-medium-editor';
import {Button} from 'react-mdl';
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
        title: props.savedCollectionInfo.title || '',
        subTitle: props.savedCollectionInfo.subTitle || '',
        description: props.savedCollectionInfo.description || ''
      },
      model: props.savedCollectionInfo,
      image: props.savedCollectionInfo.img
    };
  }

  componentDidMount() {
    const collection = this.props.savedCollectionInfo;
    this.props.saveCollectionInfo({cards: collection ? collection.cards : this.props.collection.collection[0].cards});
  }

  checkInput(modelName) {
    return _.isEmpty(this.state.model[modelName]) ? styles.formPlaceholder : '';
  }

  onDrop(file) {
    this.setState({
      image: file[0]
    });
    this.props.saveCollectionInfo({img: file[0]});
  }

  deleteImageFromCollection() {
    this.props.saveCollectionInfo({img: {}});
  }

  saveCollection() {
    this.props.saveCollectionInfo({...this.state.info});
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

  isEmptyField(fieldName) {
    return !(!this.props.showPlaceholders && !fieldName);
  }

  render() {
    const {info} = this.state;
    const {showPlaceholders, savedCollectionInfo} = this.props;
    const image = savedCollectionInfo.img.preview;
    return (
      <div className={classnames('mdl-grid', styles.root)}>
        <div className={classnames('mdl-cell mdl-cell--7-col', styles.formLayout)}>
          {::this.isEmptyField(info.title) ?
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
            : null
          }
          {::this.isEmptyField(info.subTitle) ?
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
            : null
          }
          {showPlaceholders ?
            <Dropzone onDrop={this.onDrop.bind(this)}
                      className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', _.isEmpty(image) && ::this.checkInput() ? styles.imgDropZone : styles.hideDragZone )}>
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
            : null
          }
          <div className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', _.isEmpty(image) ? styles.hideDragZone : '')}>
            <Button className={styles.deleteImage} onClick={::this.deleteImageFromCollection} >
              <span>&times;</span>
            </Button>
            <img className={styles.colImage} src={image}/>
          </div>
          {::this.isEmptyField(info.description) ?
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
            : null
          }
        </div>
      </div>
    );
  }
}
