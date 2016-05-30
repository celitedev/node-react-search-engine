import React from 'react';
import PureComponent from 'react-pure-render/component';
import 'material-design-icons';
import {connect} from 'redux-simple';
import {switchAddCardModal, switchPlaceholdersVisibility} from '../../actions';
import classnames from 'classnames';

function collection(state) {
  const {showPlaceholders} = state.collection;
  return {showPlaceholders};
}

@connect(collection, {switchAddCardModal, switchPlaceholdersVisibility})
export default class CollectionCardsAddButton extends PureComponent {

  showModal() {
    const {switchAddCardModal, switchPlaceholdersVisibility} = this.props;
    switchPlaceholdersVisibility();
    switchAddCardModal();
  }
  render() {
    const {cards, switchAddCardModal, showPlaceholders} = this.props;
    const label = (cards && cards.length) ? 'Add Card' : 'Add your first Card';
    if (!showPlaceholders) return null;
    return (
      <div className={classnames('mdl-grid mdl-js-ripple-effect', styles.root)}>
        <button
          className={classnames('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect', styles.addCardBtn)}
          onClick={() => this.showModal()}>{ label }</button>
      </div>
    );
  }
}
