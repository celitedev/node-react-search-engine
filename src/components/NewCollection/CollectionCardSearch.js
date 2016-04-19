import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import _ from 'lodash';
import {getCards, addCardToCollection} from '../../actions';
import {Radio, RadioGroup, Textfield, Button} from 'react-mdl';
import 'material-design-icons';

const Container = require('../../../node_modules/react-sticky/lib/container');
//const Sticky = require('../../../node_modules/react-sticky/lib/sticky');

function searchedCards(state) {
  const { savedCollectionInfo } = state.collection;
  return {savedCollectionInfo};
}

@connect(searchedCards, {getCards, addCardToCollection})
export default class CollectionCardSearch extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      filter: 'all',
      cards: [],
      cardTypes: ['place', 'event', 'person', 'all']
    };
    this.loadCards();
  }

  changeFilter(filter) {
    this.setState({
      filter
    });
  }

  // componentDidMount() {
  //   const cardsDialogModal = document.getElementById('cardsDialogModal');
  //   cardsDialogModal.addEventListener('scroll', this.handleScroll);
  // }
  //
  // componentWillUnmount() {
  //   const cardsDialogModal = document.getElementById('cardsDialogModal');
  //   cardsDialogModal.removeEventListener('scroll', this.handleScroll);
  // }
  // handleScroll() {
  //   const cardsDialogModal = document.getElementById('cardsDialogModal');
  //   (cardsDialogModal.onscroll = () => {
  //     const sticky = document.getElementById('cardsDialogStickyHeader');
  //     const scroll = cardsDialogModal.scrollTop;
  //
  //     if (scroll >= 75) sticky.className = 'cardsDialogStickyHeader';
  //     else sticky.className = '';
  //   })();
  // }

  async loadCards() {
    const {getCards} = this.props;
    const cards = await getCards();
    this.setState({cards});
  }


  render() {
    const {className, savedCollectionInfo, addCardToCollection} = this.props;
    const {cards, cardTypes, filter} = this.state;
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
          <Textfield label='Seach cards with typeahead/autosuggested' className={classnames(styles.search)}/>
          <Button
            className={classnames('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect', styles.extraFiltersBtn)}>
            Show Extra Filters
          </Button>
        </div>
        { cardTypes.map((type, i) => (
          <div key={i}>
            {(_.find(cards, {'type': type}) && filter === type) || (filter === 'all' && _.find(cards, {'type': type})) ? (
              <li className={classnames('mdl-list__item', styles.collectionList)}>
                <div className={classnames('mdl-card', styles.card)}>
                  <label htmlFor='' className={styles.collectionFilterName}>{type}</label>
                  {_.filter(cards, {'type': type}).map((card) =>
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
