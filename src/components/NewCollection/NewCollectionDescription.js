import React from 'react';
import PureComponent from 'react-pure-render/component';
import {isObject, isEmpty, isString} from 'lodash';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import {saveCollectionInfo} from '../../actions';
import {connect} from 'redux-simple';
import MediumEditor from 'react-medium-editor';
import {Button} from 'react-mdl';
import autobind from 'autobind-decorator';
import {TextField} from 'material-ui';

const debug = require('debug')('app:collection');
const MAX_IMAGE_SIZE = 1048576;

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
  onDrop(files) {
    const reader = new FileReader();
    const self = this;
    reader.onload = ((file) => {
      return (e) => {
        let imgSrc;

        if (files[0].size > MAX_IMAGE_SIZE) {
          imgSrc = this.getProcessedImage(e);
        } else {
          imgSrc = reader.result;
        }

        self.props.saveCollectionInfo({...self.state.savedCollectionInfo, img: imgSrc});
        debug('Image saved');
      };
    })(files[0]);

    if (files[0]) {
      reader.readAsDataURL(files[0]);
    }
  }

  getProcessedImage(e) {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 745;
    const MAX_HEIGHT = 600;

    img.src = e.target.result;

    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL('image/png');
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
    const {editCollection} = this.props;
    return fieldName || (editCollection);
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
                className={title ? styles.titleField : styles.titlePlaceholder}
                hintText='Let us think of a snazzy title shall we?'
                onChange={this.handleChange('title')}
                onKeyPress={this.handleEnter}
                disabled={!editCollection}
                multiLine={true}
                inputStyle={{'color': '#666666', 'fontSize': '28px', 'fontWeight': '500', 'textAlign': 'center'}}
                textareaStyle={{'color': '#666666', 'fontSize': '28px', 'fontWeight': '500', 'textAlign': 'center'}}
                underlineShow={false}
                value={title || ''}
              />
            </div>
          )}
          {this.isEmptyField(subTitle) && (
            <div className={styles.contentEditable}>
              <TextField
                className={subTitle ? styles.semiTitleField : styles.subTitlePlaceholder}
                hintText='This text is supposed to drag the user in.
                Use your imagination. Use anecdotes.
                Do not be boring like this placeholder text. (which is optional btw)'
                onKeyPress={this.handleEnter}
                onChange={this.handleChange('subTitle')}
                disabled={!editCollection}
                value={subTitle || ''}
                multiLine={true}
                underlineShow={false}
                inputStyle={{'color': '#158655', 'fontSize': '18px', 'fontStyle': 'italic', 'fontWeight': '500', 'textAlign': 'center'}}
                textareaStyle={{'color': '#158655', 'fontSize': '18px', 'fontStyle': 'italic', 'fontWeight': '500', 'textAlign': 'center'}}
              />
            </div>
          )}
          {(showPlaceholders && editCollection) && (
            <Dropzone
              onDrop={this.onDrop} accept='image/*'
              className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', isEmpty(img) && this.checkInput() ? styles.imgDropZone : styles.hideDragZone)}>
              <div className={styles.dragZoneTitle}>Drop a nice image here.</div>
              <div className={styles.dragZoneText}>You know you want to</div>
            </Dropzone>
          )}
          <div
            className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', isEmpty(img) ? styles.hideDragZone : '')}>
              <Button className={styles.deleteImage} onClick={this.deleteImageFromCollection}>
                <span>&times;</span>
              </Button>
            <img className={styles.colImage} src={img}/>
          </div>
          {this.isEmptyField(description) && (
            editCollection ?
              <MediumEditor
                className={description ? styles.mediumEdit : styles.editZone}
                tag='p'
                text={description}
                onChange={this.handleChange('description')}
                options={{
                  toolbar: {buttons: ['bold', 'italic', 'underline']},
                  placeholder: {
                    text: 'BODY: (Optional) Use the body field to give a bit more, well, body to your story.' +
                    'Use paragraphs to nicely structure your info. You can use bold, italic and underline ' +
                    'for more emphasis. Use them sparingly though. Simply use the well known shortcuts ' +
                    'to do so or select some text for an instant menu that helps you out.',
                    hideOnClick: true
                  }}
                }
              />
            : <p className={styles.mediumEdit}>{description}</p>
          )}
        </div>
      </div>
    );
  }
}
