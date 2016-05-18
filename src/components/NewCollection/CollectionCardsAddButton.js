import React from 'react';
import PureComponent from 'react-pure-render/component';
import 'material-design-icons';
import {connect} from 'redux-simple';
import {switchAddCardModal} from '../../actions';
import classnames from 'classnames';

function collection(state) {
  const {showPlaceholders} = state.collection;
  return {showPlaceholders};
}

@connect(collection, {switchAddCardModal})
export default class CollectionCardsAddButton extends PureComponent {
  render() {
    const {cards, switchAddCardModal, showPlaceholders} = this.props;
    const label = (cards && cards.length) ? 'Add Card' : 'Add your first Card';
    if (!showPlaceholders) return null;
    return (
      <div className={classnames('mdl-grid mdl-js-ripple-effect', styles.root)}>
        <button
          className={classnames('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect', styles.addCardBtn)}
          onClick={switchAddCardModal}>{ label }</button>
      </div>
    );
  }
}
