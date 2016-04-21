import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import _ from 'lodash';
import {getCards, addCardToCollection, getCardsSuggestions} from '../../actions';
import {Radio, RadioGroup, Textfield, Button} from 'react-mdl';
import 'material-design-icons';
import Autosuggest from 'react-autosuggest';

const debug = require('debug')('app: cardsSearch');

function searchedCards(state) {
  const { savedCollectionInfo } = state.collection;
  return {savedCollectionInfo};
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.title}</span>
  );
}


@connect(searchedCards, {getCards, addCardToCollection, getCardsSuggestions})
export default class CollectionCardSearch extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      filter: 'all',
      cards: [],
      cardTypes: ['place', 'event', 'person', 'all'],
      value: '',
      suggestions: [],
      noSuggestions: false
    };
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
    const cards = await getCards();
    debug('Finished fetch cards', cards);
    this.setState({cards});
  }

  searchCreteriaChange(event, { newValue, method }) {
    this.setState({
      value: newValue
    });
  }

  filterResults(obj, type, search) {
    const escapedValue = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('^' + escapedValue, 'i');
    const filterArray = obj.filter(card => regex.test(card.title) && (card.type === type || type === 'all'));
    return filterArray;
  }

  render() {
    const {className, addCardToCollection} = this.props;
    const {cards, cardTypes, filter, value, suggestions, noSuggestions} = this.state;
    const searchFieldProps = {
      placeholder: 'Seach cards',
      value,
      onChange: this.searchCreteriaChange.bind(this)
    };
    return (
      <div className={classnames(className, styles.root)}>
        <div id='cardsDialogStickyHeader'>
          <RadioGroup value={filter} name='searchFilter'>
            <Radio className={styles.radio} value='all' onClick={() => this.changeFilter('all')}>
              All types
            </Radio>
            <Radio className={styles.radio} value='place' onClick={() => this.changeFilter('place')}>
              Place
            </Radio>
            <Radio className={styles.radio} value='event' onClick={() => this.changeFilter('event')}>
              Event
            </Radio>
            <Radio className={styles.radio} value='person' onClick={() => this.changeFilter('person')}>
              Person
            </Radio>
          </RadioGroup>
          <Autosuggest suggestions={suggestions}
                       onSuggestionsUpdateRequested={::this.onSuggestionsUpdateRequested}
                       getSuggestionValue={::this.getSuggestionValue}
                       renderSuggestion={renderSuggestion}
                       inputProps={searchFieldProps} />
          {
            noSuggestions &&
            <div className='no-suggestions'>
              No suggestions
            </div>
          }
          <Button
            className={classnames('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect', styles.extraFiltersBtn)}>
            Show Extra Filters
          </Button>
        </div>
        { cardTypes.map((type, i) => (
          <div key={i}>
            {(::this.filterResults(cards, type, value) && filter === type) ? (
              <li className={classnames('mdl-list__item', styles.collectionList)}>
                <div className={classnames('mdl-card', styles.card)}>
                  <label htmlFor='' className={styles.collectionFilterName}>{type}</label>
                  {::this.filterResults(cards, type, value).map((card) =>
                    <div key={card.id} className={classnames('mdl-card mdl-shadow--8dp', styles.cardList)}>
                      <div className='mdl-card__title'>
                        <h2 className={classnames('mdl-card__title-text', styles.cardInfo)}>{card.title}</h2>
                      </div>
                      <div className={styles.cardImage}>
                        <img className={styles.cardImg} src='http://placehold.it/350x150'/>
                      </div>
                      <div className={classnames('mdl-card__supporting-text', styles.cardActions)}>
                        <Button
                          className={classnames(styles.extraFiltersBtn, styles.cardActionButton, 'mdl-js-ripple-effect')}
                          onClick={() => addCardToCollection(Math.random() * 10, card)}
                        >
                          Action
                        </Button>
                      </div>
                    </div>
                  )}
                  <ul className={classnames('pagination', styles.pagination)}>
                    <li className='mdl-button mdl-js-button mdl-button--icon'><a href='#!'>1</a></li>
                    <li className='mdl-button mdl-js-button mdl-button--icon'><a href='#!'>2</a></li>
                    <li className='mdl-button mdl-js-button mdl-button--icon'><a href='#!'>3</a></li>
                  </ul>
                </div>
              </li>
            ) : null }
          </div>
        ))}
      </div>
    );
  }
}
