import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import _ from 'lodash';
import {getCards, addCardToCollection, getCardsSuggestions, deleteCardFromCollection} from '../../actions';
import {Button} from 'react-mdl';
import 'material-design-icons';
import Autosuggest from 'react-autosuggest';
import CardsList from '../Cards/CardsList';

if (!process.env.SERVER_RENDERING) {
  require('getmdl-select/getmdl-select.min');
}

const debug = require('debug')('app:cardsSearch');

function searchedCards(state) {
  const { savedCollectionInfo } = state.collection;
  return {savedCollectionInfo};
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.title}</span>
  );
}

function renderSectionTitle(section) {
  return (
    <strong>{section.title}</strong>
  );
}


@connect(searchedCards, {getCards, addCardToCollection, deleteCardFromCollection, getCardsSuggestions})
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

  componentDidMount() {
    this.loadCards();
  }

  async makeSuggestionRequest(value) {
    const { getCardsSuggestions } = this.props;
    try {
      debug('Start cards search:', this.props);
      const cardsSuggestions = await getCardsSuggestions({value});
      debug('Finished cards search', cardsSuggestions);
      return cardsSuggestions;
    } catch (err) {
      debug('Error with search card query:', err);
    }
  }
  async getSuggestions(value) {
    await this.makeSuggestionRequest(value);
    return this.makeSuggestionRequest(value);
  }

  getSuggestionValue(suggestion) {
    return suggestion.title;
  }

  getSectionSuggestions(section) {
    return section.cards;
  }

  async onSuggestionsUpdateRequested({ value }) {
    const suggestions = await this.getSuggestions(value);
    debug('got suggestions', suggestions);
    const isInputBlank = value.trim() === '';
    const noSuggestions = !isInputBlank && suggestions.length === 0;

    this.setState({
      suggestions,
      noSuggestions
    });
  }

  changeFilter(filter) {
    this.setState({
      filter
    });
  }


  async loadCards() {
    const {getCards} = this.props;
    const cards = await getCards(this.state.value, this.state.filter);
    debug('Finished fetch cards', cards);
    this.setState({cards});
  }

  searchCreteriaChange(event, { newValue, method }) {
    this.setState({
      value: newValue
    });
  }

  searchResults(e) {
    e.preventDefault();
    debug('Start to search cards:', this.state.value, this.state.filter);
    this.loadCards();
  }

  render() {
    const {className} = this.props;
    const {cards, cardTypes, filter, value, suggestions, noSuggestions} = this.state;
    const searchFieldProps = {
      placeholder: 'Seach cards',
      value,
      onChange: this.searchCreteriaChange.bind(this)
    };
    return (
      <div className={classnames(className, styles.root)}>
        <div id='cardsDialogStickyHeader'>
          <form onsubmit={::this.searchResults}>
            <div className={classnames('mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select', styles.selectBox)}>
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
                  <li className='mdl-menu__item' value='happening' onClick={() => this.changeFilter('happening')}>Happening</li>
                  <li className='mdl-menu__item' value='place' onClick={() => this.changeFilter('place')}>Place</li>
                  <li className='mdl-menu__item' value='creative' onClick={() => this.changeFilter('creative')}>Creative work</li>
                  <li className='mdl-menu__item' value='person' onClick={() => this.changeFilter('person')}>Person/Group</li>
                </ul>
            </div>
            <Autosuggest multiSection={true}
                         suggestions={suggestions}
                         onSuggestionsUpdateRequested={::this.onSuggestionsUpdateRequested}
                         getSuggestionValue={::this.getSuggestionValue}
                         renderSuggestion={renderSuggestion}
                         renderSectionTitle={renderSectionTitle}
                         getSectionSuggestions={::this.getSectionSuggestions}
                         inputProps={searchFieldProps} />
            <Button
              className={classnames('mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect', styles.extraFiltersBtn)}
              onClick={::this.searchResults}>
              Show Cards
            </Button>
            {
              noSuggestions &&
              <div className='no-suggestions'>
                No suggestions
              </div>
            }
          </form>
        </div>
        <CardsList cardTypes={cardTypes} cards={cards} filter={filter}/>
      </div>
    );
  }
}
