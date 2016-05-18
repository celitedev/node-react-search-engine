import React from 'react';
import PureComponent from 'react-pure-render/component';
import _ from 'lodash';
import classnames from 'classnames';
import 'material-design-icons';
import {connect} from 'redux-simple';
import {deleteCardFromCollection} from '../../actions';
import MediumEditor from 'react-medium-editor';

function collection(state) {
  const {showPlaceholders} = state.collection;
  return {showPlaceholders};
}

@connect(collection, {deleteCardFromCollection})
export default class CollectionCardsListItem extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      description: props.item.description
    };
  }

  checkInput(modelName) {
    return _.isEmpty(this.state.description) && this.props.showPlaceholders ?
      styles.formPlaceholder : '';
  }

  handleDesciptionChange(description, medium) {
    this.setState({
      description
    });
  }

  render() {
    const {item, showPlaceholders, deleteCardFromCollection} = this.props;
    const {description} = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.collectionCardWide}>
          <div className={classnames('mdl-card mdl-shadow--2dp')}>
            <div className='mdl-card__title'>
              <h2 className='mdl-card__title-text'>{ item.title }</h2>
            </div>
            <div className='mdl-card__supporting-text'>
              {item.content}
            </div>
            <div className='mdl-card__menu'>
              <button className='mdl-button mdl-js-button mdl-button--raised'
                      onClick={() => deleteCardFromCollection(item.collectionId, item.id)}>
                <i className='material-icons'>delete</i>
              </button>
            </div>
          </div>
          <MediumEditor
            className={classnames(styles.mediumEdit, styles.cardDescription, styles.cardDescriptionPlaceholder, ::this.checkInput())}
            tag='p'
            text={description}
            onChange={::this.handleDesciptionChange}
            options={{
                toolbar: {buttons: ['bold', 'italic', 'underline']},
                placeholder: {
                  text: 'Card description',
                  hideOnClick: true
                }}}
          />
        </div>
      </div>
    );
  }
}
