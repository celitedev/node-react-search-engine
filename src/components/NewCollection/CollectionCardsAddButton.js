import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import classnames from 'classnames';
import 'material-design-icons';

export default class CollectionCardsAddButton extends PureComponent {

  render() {
    const { cards } = this.props;
    const label = (cards && cards.length) ? 'Add Card' : 'Add your first Card';
    return (
      <div className='mdl-grid'>
        <button className='mdl-button mdl-js-button mdl-button--raised'>{ label }</button>
      </div>
    );
  }
}
