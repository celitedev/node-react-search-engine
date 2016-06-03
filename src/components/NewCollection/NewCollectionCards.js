import React from 'react';
import PureComponent from 'react-pure-render/component';
import CollectionCardsList from './CollectionCardsList';
import CollectionCardsAddButton from './CollectionCardsAddButton';
import classnames from 'classnames';
import {connect} from 'redux-simple';
import {saveCollectionInfo, loadCards} from '../../actions';

const debug = require('debug')('app:NewCollectionCards');

function collection(state) {
  const {savedCollectionInfo} = state.collection;
  return {savedCollectionInfo};
}

@connect(collection, {saveCollectionInfo, loadCards})
export default class NewCollectionCards extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loaded: false,
      cards: []
    };
  }

  componentDidMount() {
    this.loadCards();
  }

  componentWillReceiveProps(nextProps) {
    const newCards = nextProps.savedCollectionInfo.cards;
    if (newCards.length !== this.props.savedCollectionInfo.cards.length) {
      this.loadCards(newCards);
    }
  }

  async loadCards(newCards) {
    const {loadCards, savedCollectionInfo} = this.props;
    const cardsList = newCards || savedCollectionInfo.cards;
    const cardsIds = cardsList.map((card) => {
      return card.id;
    });
    debug('Cards ids', cardsIds);
    try {
      let cards = await loadCards(cardsIds);
      debug('Cards load finished', cards);
      cards = cards.map((card) => {
          const n = cardsIds.indexOf(card.raw.id);
          return [n, {...card, id: card.raw.id, description: cardsList[n].description}];
      }).sort().map((j) => j[1]);
      this.setState({
        cards,
        loaded: true
      });
    } catch (err) {
      debug('Error ocured while fetching cards.', err);
    }
  }

  render() {
    const {loaded, cards} = this.state;
    return (
      <div className={styles.root}>
      {loaded && (
        <div>
        <div className='mdl-grid'>
          <CollectionCardsAddButton cards={cards}/>
        </div>
        <div className='mdl-grid'>
          <CollectionCardsList cards={cards}/>
        </div>
        <div className={classnames('mdl-grid', styles.bottomAddCardBtn)}>
          {(cards && cards.length) && (
            <CollectionCardsAddButton cards={cards}/>
          ) || null}
        </div>
        </div>
      )}
      </div>
    );
  }
}
