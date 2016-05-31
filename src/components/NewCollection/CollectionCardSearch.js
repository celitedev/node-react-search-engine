import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import {
  getCards,
  addCardToCollection,
  getCardsSuggestions,
  suggestCards,
  deleteCardFromCollection
} from '../../actions';
import {Button, Textfield} from 'react-mdl';
import 'material-design-icons';
import Autosuggest from 'react-autosuggest';
import CardsList from '../Cards/CardsList';
import {types} from '../../exampleQuestions';

if (!process.env.SERVER_RENDERING) {
  require('getmdl-select/getmdl-select.min');
}

const debug = require('debug')('app:cardsSearch');

function searchedCards(state) {
  const {savedCollectionInfo} = state.collection;
  return {savedCollectionInfo};
}

@connect(searchedCards, {
  getCards,
  addCardToCollection,
  deleteCardFromCollection,
  suggestCards,
  getCardsSuggestions
})
export default class CollectionCardSearch extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      filter: 'all',
      cards: [],
      cardTypes: ['place', 'creative', 'person', 'happening'],
      value: '',
      suggestions: [],
      noSuggestions: false
    };
  }

  changeFilter(filter) {
    this.setState({
      filter
    });
  }


  async loadCards() {
    const {filter, value} = this.state;
    const filterType = types[filter] || '';
    const {suggestCards} = this.props;
    const cards = await suggestCards(value, filterType.toLowerCase());
    const cardsValues = Object.keys(cards).map((key) => {
      return {
        ...cards[key]
      };
    });
    debug('Finished fetch cards', cardsValues);
    this.setState({cards: cardsValues});
  }

  handleSearch(e) {
    this.setState({
      value: e.target.value
    }, () => this.loadCards());
  }

  searchResults(e) {
    e.preventDefault();
    debug('Start to search cards:', this.state.value, this.state.filter);
    this.loadCards();
  }

  render() {
    const {className} = this.props;
    const {cards, cardTypes, filter, value, suggestions, noSuggestions} = this.state;
    const filterType = types[filter] || filter;
    debug('Filter Type', filterType);
    return (
      <div className={classnames(className, styles.root)}>
        <div id='cardsDialogStickyHeader'>
          <form onsubmit={::this.searchResults}>
            <div
              className={classnames('mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select', styles.selectBox)}>
              <input className={classnames('mdl-textfield__input', styles.filterInput)}
                     type='text'
                     id='filter'
                     value={filter}
                     readOnly
                     tabIndex='-1'
              />
              <label htmlFor='filter' className={styles.selectBoxLabel}>
                <i className='mdl-icon-toggle__label material-icons'>keyboard_arrow_down</i>
              </label>
              <ul htmlFor='filter' className='mdl-menu mdl-menu--bottom-left mdl-js-menu'>
                <li className='mdl-menu__item' value='all' onClick={() => this.changeFilter('all')}>All types</li>
                <li className='mdl-menu__item' value='happening' onClick={() => this.changeFilter('happening')}>
                  Happening
                </li>
                <li className='mdl-menu__item' value='place' onClick={() => this.changeFilter('places')}>Places</li>
                <li className='mdl-menu__item' value='creative' onClick={() => this.changeFilter('creative Work')}>Creative
                  work
                </li>
                <li className='mdl-menu__item' value='person' onClick={() => this.changeFilter('Person / Group')}>Person/Group
                </li>
              </ul>
            </div>
            <Textfield
                onChange={::this.handleSearch}
                label='Cards search...'
                className={styles.search}
            />
            <Button
              className={classnames('mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect', styles.extraFiltersBtn)}
              onClick={::this.searchResults}>
              Show Cards
            </Button>
            {noSuggestions && (
              <div className='no-suggestions'>
                No suggestions
              </div>
            )}
          </form>
        </div>
        <CardsList cardTypes={cardTypes} cards={cards} filter={filterType.toLowerCase()}/>
      </div>
    );
  }
}
