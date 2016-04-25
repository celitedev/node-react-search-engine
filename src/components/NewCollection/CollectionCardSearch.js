import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import _ from 'lodash';
import {getCards, addCardToCollection, getCardsSuggestions, deleteCardFromCollection} from '../../actions';
import {Radio, RadioGroup, Button} from 'react-mdl';
import 'material-design-icons';
import Autosuggest from 'react-autosuggest';
import CardsList from '../Cards/CardsList';

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
            <RadioGroup value={filter} name='searchFilter'>
              <Radio className={styles.radio} value='all' onClick={() => this.changeFilter('all')}>
                All types
              </Radio>
              <Radio className={styles.radio} value='happening' onClick={() => this.changeFilter('happening')}>
                Happening
              </Radio>
              <Radio className={styles.radio} value='place' onClick={() => this.changeFilter('place')}>
                Place
              </Radio>
              <Radio className={styles.radio} value='creative' onClick={() => this.changeFilter('creative')}>
                Creative work
              </Radio>
              <Radio className={styles.radio} value='person' onClick={() => this.changeFilter('person')}>
                Person/Group
              </Radio>
            </RadioGroup>
            <Autosuggest suggestions={suggestions}
                         onSuggestionsUpdateRequested={::this.onSuggestionsUpdateRequested}
                         getSuggestionValue={::this.getSuggestionValue}
                         renderSuggestion={renderSuggestion}
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
