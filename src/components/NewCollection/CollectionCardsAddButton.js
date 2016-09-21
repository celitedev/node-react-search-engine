import React from 'react';
import PureComponent from 'react-pure-render/component';
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
    const {cards} = this.props;
    const label = (cards && cards.length) ? 'Add Card' : 'Add First Card';
    return (
      <div className={classnames('mdl-grid mdl-js-ripple-effect', styles.root)}>
        <button
          className={classnames('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-cell--7-col', cards && cards.length ? styles.addCardBtn : styles.addFirstCard)}
          onClick={() => this.showModal()}>
          { label }
          { cards && !cards.length && <div className={styles.addFirstCard}>It feels pretty useless without one</div>}
        </button>
      </div>
    );
  }
}
