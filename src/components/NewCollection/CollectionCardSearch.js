import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import {
  getCards,
  addCardToCollection,
  getCardsSuggestions,
  answerTheQuestion,
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

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.text}</span>
  );
}

function renderSectionTitle(section) {
  return (
    <strong>{section.title}</strong>
  );
}


@connect(searchedCards, {
  getCards,
  addCardToCollection,
  deleteCardFromCollection,
  answerTheQuestion,
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

  async makeSuggestionRequest(value) {
    const {getCardsSuggestions} = this.props;
    try {
      debug('Start suggestions search:', value);
      const cardsSuggestions = await getCardsSuggestions(value);
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

  async onSuggestionsUpdateRequested({value}) {
    const suggestions = await this.getSuggestions(value);
    debug('got suggestions', suggestions);
    suggestionsValues = Object.keys(suggestions).map((key) => {
      return {
        title: key || '',
        cards: suggestions[key]
      };
    });
    const isInputBlank = value.trim() === '';
    const noSuggestions = !isInputBlank && suggestionsValues.length === 0;

    this.setState({
      suggestions: suggestionsValues,
      noSuggestions
    });
  }

  changeFilter(filter) {
    this.setState({
      filter
    });
  }


  async loadCards() {
    const {filter, value} = this.state;
    const {answerTheQuestion} = this.props;
    const cards = await answerTheQuestion(value, filter);
    debug('Finished fetch cards', cards);
    this.setState({cards: cards.results});
  }

  onSuggestionSelected(event, {suggestion, suggestionValue, sectionIndex, method}) {
    debug('onSuggestionSelected', suggestion, suggestionValue, method);
    this.setState({
      value: suggestion.text
    });
  }

  shouldRenderSuggestions(e) {
    return (e && e.trim().length) ? true : false;
  }

  searchCreteriaChange(event, {newValue, method}) {
    debug('search change', newValue, method);
    if (method === 'type') {
      this.setState({
        value: newValue
      });
    }
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
    const searchFieldProps = {
      placeholder: 'Seach cards',
      value,
      onChange: ::this.searchCreteriaChange
    };
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
                onChange={() => {}}
                label='Text...'
                style={{width: '200px'}}
            />
            <Autosuggest multiSection={true}
                         focusInputOnSuggestionClick={false}
                         suggestions={suggestions}
                         shouldRenderSuggestions={::this.shouldRenderSuggestions}
                         onSuggestionsUpdateRequested={::this.onSuggestionsUpdateRequested}
                         getSuggestionValue={::this.getSuggestionValue}
                         renderSuggestion={renderSuggestion}
                         renderSectionTitle={renderSectionTitle}
                         getSectionSuggestions={::this.getSectionSuggestions}
                         onSuggestionSelected={::this.onSuggestionSelected}
                         inputProps={searchFieldProps}/>
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
