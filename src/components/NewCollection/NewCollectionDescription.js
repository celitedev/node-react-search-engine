import React from 'react';
import PureComponent from 'react-pure-render/component';
import {isObject, isEmpty, isString} from 'lodash';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import {saveCollectionInfo} from '../../actions';
import {connect} from 'redux-simple';
import MediumEditor from 'react-medium-editor';
import ContentEditable from 'react-contenteditable';
import {Button} from 'react-mdl';
import autobind from 'autobind-decorator';
import {TextField} from 'material-ui';


const debug = require('debug')('app:collection');

function collection(state) {
  const {showPlaceholders, savedCollectionInfo, editCollection} = state.collection;
  const {user} = state.auth;
  return {showPlaceholders, savedCollectionInfo, user, editCollection};
}

@connect(collection, {saveCollectionInfo})
export default class NewCollectionDescription extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      savedCollectionInfo: props.savedCollectionInfo
    };
  }

  @autobind
  checkInput(modelName) {
    return isEmpty(this.state.savedCollectionInfo[modelName]) ? styles.formPlaceholder : '';
  }

  @autobind
  onDrop(file) {
    const reader = new FileReader();
    const self = this;
    reader.onload = ((file) => {
      return (e) => {
        self.props.saveCollectionInfo({...self.state.savedCollectionInfo, img: reader.result});
        debug('Image saved');
      };
    })(file[0]);

    if (file[0]) {
      reader.readAsDataURL(file[0]);
    }
  }

  @autobind
  deleteImageFromCollection() {
    this.props.saveCollectionInfo({img: {}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.savedCollectionInfo !== this.props.savedCollectionInfo) {
      this.setState({
        savedCollectionInfo: nextProps.savedCollectionInfo
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.savedCollectionInfo !== this.props.savedCollectionInfo || nextProps.showPlaceholders !== this.props.showPlaceholders;
  }

  saveCollection() {
    const {savedCollectionInfo} = this.state;
    this.props.saveCollectionInfo({...savedCollectionInfo});
    debug('Collection saved: ', this.props.savedCollectionInfo);
  }

  @autobind
  handleChange(field) {
    return (value, medium) => {
      const fieldValue = isString(value) ? value : value.target.value;
      this.setState({
        savedCollectionInfo: {
          ...this.state.savedCollectionInfo,
          [field]: fieldValue
        }
      }, () => this.saveCollection());
    };
  }

  @autobind
  handleEnter(e) {
    if (e.which === 13) {
      e.preventDefault();
    }
  }

  @autobind
  isEmptyField(fieldName) {
    const {editCollection, showPlaceholders} = this.props;
    return fieldName || (showPlaceholders && editCollection);
  }

  render() {
    const {title, subTitle, description, img} = this.state.savedCollectionInfo;
    const {showPlaceholders, editCollection} = this.props;
    return (
      <div className={classnames('mdl-grid', styles.root)}>
        <div className={classnames('mdl-cell mdl-cell--7-col', styles.formLayout)}>
          {this.isEmptyField(title) && (
            <div className={styles.contentEditable}>
              <TextField
                className={styles.titleField}
                hintText='Collection title'
                onChange={this.handleChange('title')}
                onKeyPress={this.handleEnter}
                disabled={!editCollection}
                value={title || ''}
              />
            </div>
          )}
          {this.isEmptyField(subTitle) && (
            <div className={styles.contentEditable}>
              <TextField
                className={styles.semiTitleField}
                hintText='Collection subtitle'
                onKeyPress={this.handleEnter}
                onChange={this.handleChange('subTitle')}
                disabled={!editCollection}
                value={subTitle || ''}
              />
            </div>
          )}
          {(showPlaceholders && editCollection) && (
            <Dropzone onDrop={this.onDrop}
                      className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', isEmpty(img) && this.checkInput() ? styles.imgDropZone : styles.hideDragZone )}>
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          )}
          <div
            className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', isEmpty(img) ? styles.hideDragZone : '')}>
            {editCollection && (
              <Button className={styles.deleteImage} onClick={this.deleteImageFromCollection}>
                <span>&times;</span>
              </Button>
            )}
            <img className={styles.colImage} src={img}/>
          </div>
          {this.isEmptyField(description) && (
            <MediumEditor
              className={styles.mediumEdit}
              tag='p'
              text={description}
              onChange={this.handleChange('description')}
              options={{
                disableEditing: !editCollection,
                toolbar: {buttons: ['bold', 'italic', 'underline']},
                placeholder: {
                  text: 'Collection description',
                  hideOnClick: true
                }}
              }
            />
          )}
        </div>
      </div>
    );
  }
}
