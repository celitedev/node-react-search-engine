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
      savedCollectionInfo: props.savedCollectionInfo
    };
  }

  checkInput(modelName) {
    return _.isEmpty(this.state.savedCollectionInfo[modelName]) ? styles.formPlaceholder : '';
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
    this.props.saveCollectionInfo({...this.state.savedCollectionInfo});
  }

  handleChange(field) {
    return (value, medium) => {
      this.setState({savedCollectionInfo: {
        ...this.state.savedCollectionInfo,
        [field]: value
      }});
      this.saveCollection();
    };
  }

  isEmptyField(fieldName) {
    return !(!this.props.showPlaceholders && !fieldName);
  }

  render() {
    const {title, subTitle, description, img} = this.state.savedCollectionInfo;
    const {showPlaceholders, savedCollectionInfo} = this.props;
    const image = img[0] ? img[0].preview : '';
    return (
      <div className={classnames('mdl-grid', styles.root)}>
        <div className={classnames('mdl-cell mdl-cell--7-col', styles.formLayout)}>
          {::this.isEmptyField(title) ?
            <div>
            <MediumEditor
              className={styles.mediumEdit}
              tag='h4'
              text={title}
              onChange={::this.handleChange('title')}
              options={{
                toolbar: {buttons: ['bold', 'italic', 'underline']},
                placeholder: {
                  text: 'Collection title',
                  hideOnClick: true
                }}
              }
            />
            </div>
            : null
          }
          {::this.isEmptyField(subTitle) ?
          <MediumEditor
            className={styles.mediumEdit}
            tag='h6'
            text={subTitle}
            onChange={::this.handleChange('subTitle')}
            options={{
              toolbar: {buttons: ['bold', 'italic', 'underline']},
              placeholder: {
                text: 'Collection subtitle',
                hideOnClick: true
              }}
            }
          />
            : null
          }
          {showPlaceholders ?
            <Dropzone onDrop={::this.handleChange('img')}
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
          {::this.isEmptyField(description) ?
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
            : null
          }
        </div>
      </div>
    );
  }
}
