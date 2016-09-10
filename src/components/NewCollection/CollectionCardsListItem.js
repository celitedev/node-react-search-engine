import React from 'react';
import PureComponent from 'react-pure-render/component';
import _ from 'lodash';
import classnames from 'classnames';
import {connect} from 'redux-simple';
import {deleteCardFromCollection, saveCollectionInfo, toggleEditCardDescription} from '../../actions';
import MediumEditor from 'react-medium-editor';
import Card from '../Cards/Card';

function collection(state) {
  const {showPlaceholders, savedCollectionInfo, editCollection} = state.collection;
  return {showPlaceholders, savedCollectionInfo, editCollection};
}

@connect(collection, {deleteCardFromCollection, saveCollectionInfo, toggleEditCardDescription})
export default class CollectionCardsListItem extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      description: props.item.description
    };
  }

  checkInput() {
    return _.isEmpty(this.state.description) && this.props.showPlaceholders ?
      styles.formPlaceholder : '';
  }

  saveCollection() {
    const {description} = this.state;
    const {item, savedCollectionInfo} = this.props;
    const updatedCards = _.map(savedCollectionInfo.cards, (el) => {
      if (el.id === item.raw.id) {
        el.description = description;
      }
      return el;
    });
    this.props.saveCollectionInfo({...savedCollectionInfo, cards: updatedCards});
  }

  handleDescriptionChange(description, medium) {
    this.setState({
      description
    }, () => {
      this.saveCollection();
    });
  }

  handleOnFocus() {
    this.props.toggleEditCardDescription(true);
  }

  handleOnBlur() {
    this.props.toggleEditCardDescription(false);
  }

  render() {
    const {item, editCollection} = this.props;
    const {raw, formatted} = item;
    const {description} = this.state;
    const cardSettings = {
      identifiers1: formatted.identifiers1,
      identifiers2: formatted.identifiers2,
      headsup1: formatted.headsup1,
      headsup2: formatted.headsup2,
      databits1: formatted.databits1,
      databits2: (formatted.databits2 && formatted.databits2.length),
      whyshown: formatted.whyshown
    };
    return (
      <div key={raw.id} className={styles.root}>
        <div className={styles.collectionCardWide}>
          <Card className={classnames('card actionBarHidden m-card-imgRight', styles.cardStyle)} settings={cardSettings} data={item} addCards={false} delteCardBtn={editCollection}/>
          {(description || editCollection) && (
            editCollection ?
              <MediumEditor
              className={classnames(styles.cardDescription, ::this.checkInput())}
              tag='p'
              text={description}
              onChange={::this.handleDescriptionChange}
              onFocus={::this.handleOnFocus}
              onBlur={::this.handleOnBlur}
              options={{
                  disableEditing: !editCollection,
                  toolbar: {buttons: ['bold', 'italic', 'underline']},
                  placeholder: {
                    text: 'Optional: Why does this item belong to this collection? Why is it special to you?',
                    hideOnClick: true
                  }}}
            />
            : <p className={styles.cardDescription}>{description}</p>
          )}
        </div>
      </div>
    );
  }
}
