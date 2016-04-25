import React from 'react';
import PureComponent from '../../../node_modules/react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import _ from 'lodash';
import {addCardToCollection, deleteCardFromCollection} from '../../actions';
import {Button} from 'react-mdl';

import Paggination from '../Widgets/Paggination';

const debug = require('debug')('app: cardsSearch');

function paginate(data = [], o) {
  // adapt to zero indexed logic
  const page = o.page - 1 || 0;
  const perPage = o.perPage;

  const amountOfPages = Math.ceil(data.length / perPage);
  const startPage = page < amountOfPages ? page : 0;

  return {
    amount: amountOfPages,
    data: data.slice(startPage * perPage, startPage * perPage + perPage),
    page: startPage + 1
  };
}


function searchedCards(state) {
  const { savedCollectionInfo } = state.collection;
  return {savedCollectionInfo};
}

@connect(searchedCards, {addCardToCollection, deleteCardFromCollection})
export default class CardsList extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      creative: {
        page: 1,
        perPage: 5
      },
      place: {
        page: 1,
        perPage: 5
      },
      person: {
        page: 1,
        perPage: 5
      },
      happening: {
        page: 1,
        perPage: 5
      }
    };
  }

  findCardById(id) {
    return _.find(this.props.savedCollectionInfo.cards, {'id': id});
  }

  filterCardsByType(type) {
    return _.filter(this.props.cards, {'type': type});
  }

  selectPage(page, type) {
    const perPage = this.state[type].perPage || {};
    const pages = Math.ceil(this.filterCardsByType(type).length / perPage);
    const newPage = Math.min(Math.max(page, 1), pages);

    this.setState({
      [type]: {
        page: newPage,
        perPage: perPage
      }
    });
  }

  render() {
    const {addCardToCollection, deleteCardFromCollection, cardTypes, cards, filter} = this.props;
    return (
      <div className={classnames(styles.root)}>
        { cardTypes.map((type, i) => (
          <div key={i}>
            {(_.find(cards, {'type': type}) && filter === 'all') || _.find(cards, {'type': type}) && filter === type ? (
              <Paggination data={::this.filterCardsByType(type)}
                           page={this.state[type].page}
                           perPage={this.state[type].perPage}
                           selectPage={(page) => ::this.selectPage(page, type)}>
              <li className={classnames('mdl-list__item', styles.collectionList)}>
                <div className={classnames('mdl-card', styles.card)}>
                  <label htmlFor='' className={styles.collectionFilterName}>{type}</label>
                  {paginate(::this.filterCardsByType(type), this.state[type]).data.map((card) =>
                  <div key={card.id}>
                      <div className={classnames('mdl-card mdl-shadow--8dp', styles.cardList)}>
                      <div className='mdl-card__title'>
                        <h2 className={classnames('mdl-card__title-text', styles.cardInfo)}>{card.title}</h2>
                      </div>
                      <div className={styles.cardImage}>
                        <img className={styles.cardImg} src='http://placehold.it/350x150'/>
                      </div>
                      <div className={classnames('mdl-card__supporting-text', styles.cardActions)}>
                        {::this.findCardById(card.id) ?
                          <Button
                            accent
                            className={classnames(styles.cardActionButton, 'mdl-js-ripple-effect button--colored')}
                            onClick={() => deleteCardFromCollection(::this.findCardById(card.id).collectionId, card.id)}
                          >
                            Remove card
                          </Button>
                          :
                          < Button
                            colored
                            className={classnames(styles.cardActionButton, 'mdl-js-ripple-effect')}
                            onClick={() => addCardToCollection(Math.random() * 10, card)}
                          >
                            Add card
                          </Button>
                        }
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              </li>
              </Paggination>
            ) : null }
          </div>
        ))}
      </div>
    );
  }
}
