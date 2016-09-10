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
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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

  handleChange(event, index, value) {
    this.setState({
      filter: value
    }, () => this.loadCards());
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
          <form onSubmit={::this.searchResults}>
            <div className={styles.filterSection}>
              <div className={styles.filterField}>
                <SelectField
                  value={filter}
                  labelStyle={{'color': '#fff', 'fontWeight': '600', 'marginLeft': '10px', 'top': '-12px'}}
                  iconStyle={{'top': '2px', 'color': '#fff'}}
                  underlineStyle={{'display': 'none'}}
                  style={{'backgroundColor': '#3793ff', 'borderRadius': '5px', 'width': '190px', 'height': '29px', 'lineHeight': '40px'}}
                  onChange={::this.handleChange}>
                  <MenuItem value={'all'} primaryText='NO FILTER' />
                  <MenuItem value={'happening'} primaryText='HAPPENING' />
                  <MenuItem value={'places'} primaryText='PLACES' />
                  <MenuItem value={'creative Work'} primaryText='CREATIVE WORK' />
                  <MenuItem value={'Person / Group'} primaryText='PERSON / GROUP' />
                </SelectField>
                <TextField
                  name='cards_search'
                  type='search'
                  onChange={::this.handleSearch}
                  hintText='Search for specific items...'
                  underlineStyle={{'display': 'none'}}
                  hintStyle={{'bottom': '7px', 'fontWeight': '500', 'fontStyle': 'italic', 'fontSize': '20px', 'color': '#b7b7b7'}}
                  style={{'height': '30px', 'bottom': '14px'}}
                  className={styles.search}/>
                </div>
            </div>
          </form>
        <CardsList cardTypes={cardTypes} cards={cards} shareBtn={false} filter={filterType.toLowerCase()}/>
      </div>
    );
  }
}
