import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import Card from './Card';
import Pagination from '../Widgets/Pagination';
import Collapse from 'react-collapse';

const debug = require('debug')('app: cardsSearch');

const filterLabels = {
  event: 'HAPPENING',
  placewithopeninghours: 'PLACES',
  creativework: 'CREATIVE WORK',
  organizationandperson: 'PERSON / GROUP'
};

function paginate(data = [], options) {
  // adapt to zero indexed logic
  const page = options.page - 1 || 0;
  const perPage = options.perPage;

  const amountOfPages = Math.ceil(data.length / perPage);
  const startPage = page < amountOfPages ? page : 0;

  return {
    amount: amountOfPages,
    data: data.slice(startPage * perPage, startPage * perPage + perPage),
    page: startPage + 1
  };
}

function searchedCards(state) {
  const {savedCollectionInfo} = state.collection;
  return {savedCollectionInfo};
}

@connect(searchedCards)
export default class CardsList extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      event: {
        page: 1,
        perPage: 5,
        isOpened: true
      },
      placewithopeninghours: {
        page: 1,
        perPage: 5,
        isOpened: true
      },
      creativework: {
        page: 1,
        perPage: 5,
        isOpened: true
      },
      organizationandperson: {
        page: 1,
        perPage: 5,
        isOpened: true
      }
    };
  }

  selectPage(page, cardsLength, type) {
    const perPage = this.state[type].perPage || {};
    const pages = Math.ceil(cardsLength / perPage);
    const newPage = Math.min(Math.max(page, 1), pages);
    const isOpened = this.state[type].isOpened;

    this.setState({
      [type]: {
        page: newPage,
        perPage: perPage,
        isOpened: isOpened
      }
    });
  }

  settingCard(card) {
    return {
      identifiers1: card.formatted.identifiers1,
      identifiers2: card.formatted.identifiers2,
      headsup1: card.formatted.headsup1,
      headsup2: card.formatted.headsup2,
      databits1: card.formatted.databits1,
      databits2: card.formatted.databits2 && card.formatted.databits2.length,
      whyshown: card.formatted.whyshown
    };
  }

  onToggle(key, isOpened) {
    const page = this.state[key].page;
    const perPage = this.state[key].perPage;

    this.setState({
      [key]: {
        page: page,
        perPage: perPage,
        isOpened: !isOpened
      }
    });
  }

  render() {
    const {cards, filter} = this.props;
    return (
      <div className={classnames(styles.root)}>
        {cards.map((section, i) => (
          section.results.length && (filter === 'all' || filter === section.filterContext.type.toLowerCase()) && (
              <div key={i}>
                <span className={styles.filterTitleSection}>
                 <label htmlFor='' className={styles.collectionFilterName}>
                    {filterLabels[section.filterContext.type.toLowerCase()]}
                  </label>
                  <img
                    className={this.state[section.filterContext.type.toLowerCase()].isOpened ? styles.arrowDown : styles.arrowRight}
                    src={this.state[section.filterContext.type.toLowerCase()].isOpened ? require('../../images/arrow-down.png') : require('../../images/arrow-right.png')}
                    onClick={()=>::this.onToggle(section.filterContext.type.toLowerCase(), this.state[section.filterContext.type.toLowerCase()].isOpened)}/>
                </span>
                <Collapse isOpened={this.state[section.filterContext.type.toLowerCase()].isOpened}>
                  <Pagination className={styles.pagginationPosition}
                              data={section.results}
                              page={this.state[section.filterContext.type.toLowerCase()].page}
                              perPage={this.state[section.filterContext.type.toLowerCase()].perPage}
                              selectPage={(page) => ::this.selectPage(page, section.results.length, section.filterContext.type.toLowerCase())}>
                    <div className={classnames('mdl-card', styles.card)}>
                      {paginate(section.results, this.state[section.filterContext.type.toLowerCase()]).data.map((card, index) => (
                        <div key={index} className={styles.listItem}>
                          <Card className={classnames('card m-card-imgRight', styles.cardStyle)} settings={this.settingCard(card)} data={card} noLink={true} addCards={true}/>
                        </div>
                      ))}
                    </div>
                  </Pagination>
                  <hr className={styles.pagginationBottom}/>
                </Collapse>
            </div>
          ) || null
        ))}
      </div>
    );
  }
}
