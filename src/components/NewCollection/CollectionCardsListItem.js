import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import _ from 'lodash';
import classnames from 'classnames';
import 'material-design-icons';
import Form from 'react-formal';
import { cardSchema } from './collectionSchemas';
import { connect } from 'redux-simple';
import { deleteCardFromCollection } from '../../actions';
function FormGroup({ children }) {
  return (
    <div className={classnames('mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col', styles.formInput)}>
      {children}
    </div>
  );
}
function collection(state) {
  const { showPlaceholders } = state.collection;
  return { showPlaceholders };
}

@connect(collection, { deleteCardFromCollection })
export default class CollectionCardsListItem extends PureComponent {
  constructor(props) {
    const { item } = props;
    super();
    this.state = {
      model: item,
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

  checkInput(modelName) {
    return _.isEmpty(this.state.model[modelName]) ? styles.formPlaceholder : '';
  }

  saveCard() {

  }

  render() {
    const { item, showPlaceholders, deleteCardFromCollection } = this.props;
    const { model, errors } = this.state;

    return (
      <div className={styles.root}>
        <div className={styles.collectionCardWide}>
          <div className={classnames('mdl-card mdl-shadow--2dp')} >
            <div className='mdl-card__title'>
              <h2 className='mdl-card__title-text'>{ item.title }</h2>
            </div>
            <div className='mdl-card__supporting-text'>
              { item.content }
            </div>
            <div className='mdl-card__menu'>
              <button className='mdl-button mdl-js-button mdl-button--raised'>
                Drag
              </button>
              <button className='mdl-button mdl-js-button mdl-button--raised' onClick={() => deleteCardFromCollection(item.collectionId, item.id)}>
                <i className='material-icons'>delete</i> Delete
              </button>
            </div>
          </div>
          {(() => {
            if (!showPlaceholders) {
              return item.description ? (
                <div
                  className={ classnames('mdl-card__supporting-text mdl-shadow--2dp', styles.cardDescription, styles.cardDescriptionPlaceholder, ::this.checkInput('description')) }>
                  <p>{item.description}</p>
                </div>
              ) : null;
            }
            return (
              <div className={ classnames('mdl-card__supporting-text mdl-shadow--2dp', styles.cardDescription, styles.cardDescriptionPlaceholder, ::this.checkInput('description')) }>
                <Form
                  className={classnames('mdl-cell mdl-cell--8-col', styles.formLayout)}
                  schema={cardSchema}
                  value={model}
                  errors={errors}
                  onChange={this.onFormChange.bind(this)}
                  onError={this.onFormErrors.bind(this)}
                  onSubmit={this.saveCard.bind(this)}
                >
                  <FormGroup>
                    <Form.Field name='description' type='textarea' id='description' onFocus={::this.checkInput}
                                className={classnames('mdl-textfield__input', styles.descriptionLabel)}
                                errorClass='form-error'/>
                    <label className={classnames('mdl-textfield__label', styles.descriptionLabel)} htmlFor='description'>
                      {model.description ? '' : 'Card description'}
                    </label>
                    <Form.Message for='description' className='form-error-message'/>
                  </FormGroup>
                </Form>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }
}
