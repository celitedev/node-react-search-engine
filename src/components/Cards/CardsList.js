import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import classnames from 'classnames';
import Card from './Card';
import Pagination from '../Widgets/Pagination';

const debug = require('debug')('app: cardsSearch');

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
        perPage: 5
      },
      placewithopeninghours: {
        page: 1,
        perPage: 5
      },
      creativework: {
        page: 1,
        perPage: 5
      },
      organizationandperson: {
        page: 1,
        perPage: 5
      }
    };
  }

  selectPage(page, cardsLength, type) {
    const perPage = this.state[type].perPage || {};
    const pages = Math.ceil(cardsLength / perPage);
    const newPage = Math.min(Math.max(page, 1), pages);

    this.setState({
      [type]: {
        page: newPage,
        perPage: perPage
      }
    });
  }

  render() {
    const {cards, filter} = this.props;
    return (
      <div className={classnames(styles.root)}>
        {cards.map((section, i) => (
          section.results.length && (
            <div key={i}>
              {(filter === 'all' || filter === section.filterContext.type.toLowerCase()) && (
                <Pagination data={section.results}
                            page={this.state[section.filterContext.type.toLowerCase()].page}
                            perPage={this.state[section.filterContext.type.toLowerCase()].perPage}
                            selectPage={(page) => ::this.selectPage(page, section.results.length, section.filterContext.type.toLowerCase())}>
                  <li className={classnames('mdl-list__item', styles.collectionList)}>
                    <div className={classnames('mdl-card', styles.card)}>
                      <label htmlFor='' className={styles.collectionFilterName}>{section.filterContext.type}</label>
                      {paginate(section.results, this.state[section.filterContext.type.toLowerCase()]).data.map((card, index) => (
                        <div key={index} className={styles.listItem}>
                          <Card className={classnames('card m-card-imgRight', styles.cardStyle)} data={card} addCards={true}/>
                        </div>
                      ))}
                    </div>
                  </li>
                </Pagination>
              )}
            </div>
          ) || null
        ))}
      </div>
    );
  }
}
