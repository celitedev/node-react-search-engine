import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import Pagination from './Widgets/Pagination';
import {Link} from 'react-router';

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

export default class MyCollections extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pagination: {
        page: 1,
        perPage: 5
      }
    };
  }

  selectPage(page) {
    const perPage = this.state.pagination.perPage || {};
    const pages = Math.ceil(this.props.collections.length / perPage);
    const newPage = Math.min(Math.max(page, 1), pages);

    this.setState({
      pagination: {
        page: newPage,
        perPage: perPage
      }
    });
  }

  render() {
    const {collections} = this.props;
    const {pagination} = this.state;
    return (
      <div className='mdl-layout mdl-js-layout'>
      <ul className={classnames(styles.root, 'mdl-list')}>
        <div className='mdl-card__title'>
          <h2 className='mdl-card__title-text'>My collections</h2>
        </div>
        <Pagination data={collections}
                     page={pagination.page}
                     perPage={pagination.perPage}
                     selectPage={(page) => ::this.selectPage(page)}>
          {paginate(collections, pagination).data.map((c, i) => (
            <li key={i} className='mdl-list__item'>
              <div className={classnames('mdl-card mdl-shadow--4dp', styles.root)}>
                <div className='mdl-card__title'>
                  <h4 className='mdl-card__title-text'>
                    <Link to={`collections/${c.id}`}>
                      {c.title}
                    </Link>
                  </h4>
                </div>
                {c.cards.map((card, i) => (
                  <div key={i} className={classnames('mdl-card mdl-shadow--8dp', styles.cardList)}>
                    <div className='mdl-card__title'>
                      <h2 className={classnames('mdl-card__title-text', styles.cardInfo)}>{card.title}</h2>
                    </div>
                    <div className={styles.cardImage}>
                      <img className={styles.cardImg} src='http://placehold.it/350x150'/>
                    </div>
                    <div className={classnames('mdl-card__supporting-text', styles.cardInfo)}>
                      {card.description}
                    </div>
                  </div>
                ))}

              </div>
            </li>
          ))}
        </Pagination>
      </ul>
      </div>
    );
  }
}
