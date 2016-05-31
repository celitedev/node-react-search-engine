import React from 'react';
import PureComponent from 'react-pure-render/component';
import _ from 'lodash';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import {saveCollectionInfo} from '../../actions';
import {connect} from 'redux-simple';
import MediumEditor from 'react-medium-editor';
import ContentEditable from 'react-contenteditable';
import {Button} from 'react-mdl';
import 'material-design-icons';

const debug = require('debug')('app:collection');

function collection(state) {
  const {showPlaceholders, savedCollectionInfo} = state.collection;
  return {showPlaceholders, savedCollectionInfo};
}

@connect(collection, {saveCollectionInfo})
export default class NewCollectionDescription extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      savedCollectionInfo: props.savedCollectionInfo,
      stateTitle: '',
      stateSubTitle: ''
    };
  }

  checkInput(modelName) {
    return _.isEmpty(this.state.savedCollectionInfo[modelName]) ? styles.formPlaceholder : '';
  }

  onDrop(file) {
    const reader = new FileReader();
    debugger;
    reader.onload = ((theFile) => {
        return (e) => {
            debugger;
          };
      })(file[0]);

      // Read in the image file as a data URL.
      debug('IMG', reader.readAsDataURL(file[0]));
    this.setState({
      image: file[0]
    });
    this.props.saveCollectionInfo({...this.state.savedCollectionInfo, img: file[0]});
    debug('Image saved');
  }

  deleteImageFromCollection() {
    this.props.saveCollectionInfo({img: {}});
  }

  saveCollection() {
    const {savedCollectionInfo} = this.state;
    this.props.saveCollectionInfo({...savedCollectionInfo});
    debug('Collection saved: ', this.props.savedCollectionInfo);
  }

  handleChange(field) {
    return (value, medium) => {
      const fieldValue = _.isString(value) ? value : value.target.value;
      this.setState({
        savedCollectionInfo: {
          ...this.state.savedCollectionInfo,
          [field]: fieldValue
        }
      }, () => this.saveCollection());
    };
  }

  isEmptyField(fieldName) {
    return !(!this.props.showPlaceholders && !fieldName);
  }

  render() {
    const {title, subTitle, description} = this.state.savedCollectionInfo;
    const {stateTitle, stateSubTitle} = this.state;
    const {img} = this.props.savedCollectionInfo;
    const {showPlaceholders} = this.props;
    const image = img.preview;
    return (
      <div className={classnames('mdl-grid', styles.root)}>
        <div className={classnames('mdl-cell mdl-cell--7-col', styles.formLayout)}>
          {::this.isEmptyField(title) && (
            <div className={styles.contentEditable}>
              <ContentEditable
                className={classnames(styles.contentEditableTitle, styles.mediumEdit)}
                html={stateTitle || title} // innerHTML of the editable div ;
                placeholder='Collection title'
                disabled={false}  // use true to disable edition ;
                //onKeyPress={::this.handleDataChange('title')}
                onChange={::this.handleChange('title')}
              />
            </div>
          )}
          {::this.isEmptyField(subTitle) && (
            <div className={styles.contentEditable}>
            <ContentEditable
              className={classnames(styles.contentEditableSubTitle, styles.mediumEdit)}
              html={stateSubTitle || subTitle} // innerHTML of the editable div ;
              placeholder='Collection subtitle'
              disabled={false}  // use true to disable edition ;
              //onKeyPress={::this.handleDataChange('title')}
              onChange={::this.handleChange('subTitle')}
            />
            </div>
          )}
          {showPlaceholders && (
            <Dropzone onDrop={::this.onDrop}
                      className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', _.isEmpty(image) && ::this.checkInput() ? styles.imgDropZone : styles.hideDragZone )}>
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          )}
          <div
            className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', _.isEmpty(image) ? styles.hideDragZone : '')}>
            <Button className={styles.deleteImage} onClick={::this.deleteImageFromCollection}>
              <span>&times;</span>
            </Button>
            <img className={styles.colImage} src={image}/>
          </div>
          {::this.isEmptyField(description) && (
            <MediumEditor
              className={styles.mediumEdit}
              tag='p'
              text={description}
              onChange={::this.handleChange('description')}
              options={{
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
