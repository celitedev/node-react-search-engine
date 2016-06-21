import React from 'react';
import PureComponent from 'react-pure-render/component';
import _ from 'lodash';
import classnames from 'classnames';
import {connect} from 'redux-simple';
import {deleteCardFromCollection, saveCollectionInfo} from '../../actions';
import MediumEditor from 'react-medium-editor';
import Card from '../Cards/Card';

function collection(state) {
  const {showPlaceholders, savedCollectionInfo, editCollection} = state.collection;
  return {showPlaceholders, savedCollectionInfo, editCollection};
}

@connect(collection, {deleteCardFromCollection, saveCollectionInfo})
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

  handleDesciptionChange(description, medium) {
    this.setState({
      description
    }, () => {
      this.saveCollection();
    });
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
          {(editCollection || description) && (
            <MediumEditor
            className={classnames(styles.cardDescription, ::this.checkInput())}
            tag='p'
            text={description}
            onChange={::this.handleDesciptionChange}
            options={{
                disableEditing: !editCollection,
                toolbar: {buttons: ['bold', 'italic', 'underline']},
                placeholder: {
                  text: 'Card description',
                  hideOnClick: true
                }}}
          />)}
        </div>
      </div>
    );
  }
}
