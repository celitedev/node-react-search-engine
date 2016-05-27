import React from 'react';
import PureComponent from 'react-pure-render/component';
import _ from 'lodash';
import classnames from 'classnames';
import 'material-design-icons';
import {connect} from 'redux-simple';
import {deleteCardFromCollection, saveCollectionInfo} from '../../actions';
import MediumEditor from 'react-medium-editor';
import Card from '../Cards/Card';

function collection(state) {
  const {showPlaceholders, savedCollectionInfo} = state.collection;
  return {showPlaceholders, savedCollectionInfo};
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
    });
    this.saveCollection();
  }

  render() {
    const {item} = this.props;
    const {raw} = item;
    const {description} = this.state;
    return (
      <div key={raw.id} className={styles.root}>
        <div className={styles.collectionCardWide}>
          <Card className={classnames('card actionBarHidden m-card-imgRight', styles.cardStyle)} data={item} addCards={true} delteCardBtn={true} hideActionButns={true}/>
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
