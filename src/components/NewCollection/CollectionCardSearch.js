import React, {Component} from 'react';
import {connect} from 'react-redux';
import { pure } from 'recompose';
import classnames from 'classnames';
import {
  getCards,
  addCardToCollection,
  getCardsSuggestions,
  suggestCards,
  deleteCardFromCollection
} from '../../actions';
import {Button, Textfield} from 'react-mdl';
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
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
@pure
export default class CollectionCardSearch extends Component {
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

  componentDidMount() {
    this.loadCards();
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
    const {cards, cardTypes, filter} = this.state;
    const filterType = types[filter] || filter;
    return (
      <div className={classnames(className, styles.root)}>
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
                <ArrowDownIcon className='mdl-icon-toggle__label material-icons'/>
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
          </form>
        <CardsList cardTypes={cardTypes} cards={cards} shareBtn={false} filter={filterType.toLowerCase()}/>
      </div>
    );
  }
}
