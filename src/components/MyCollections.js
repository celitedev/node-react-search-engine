import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import Pagination from './Widgets/Pagination';
import {connect} from 'redux-simple';
import {toggleLoginModal} from '../actions';
import {Link} from 'react-router';
import Card from './Cards/Card';

const debug = require('debug')('app:myCollectionsCmp');

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

function userInfo(state) {
  const {user} = state.auth;
  return {user};
}

@connect(userInfo, {toggleLoginModal})
export default class MyCollections extends PureComponent {
  static contextTypes = {
    horizon: React.PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      collections: props.collections,
      horizon: context.horizon,
      pagination: {
        page: 1,
        perPage: 5
      }
    };
  }

  getCollections(collections) {
    const {id} = this.props.user;
      collections.findAll({userId: id}).fetch().subscribe(collections => {
        debug('Fetched collections', collections);
        this.setState({
          collections
        });
      },
      (err) => debug('Error fetch data from db', err),
      () => {
        debug('Compleated fetching data');
    });
  }

  deleteCollection(collectionId) {
    const {horizon} = this.state;
    const collections = horizon('collections');
    collections.remove(collectionId).subscribe(collection => {
        debug('Fetched collections', collections);
        this.getCollections(collections);
      },
      (err) => debug('Error fetch data from db', err),
      () => {
        debug('Compleated fetching data');
      });
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
    const {pagination, collections} = this.state;
    return (
      <div className='mdl-layout mdl-js-layout'>
        <ul className={classnames(styles.root, 'mdl-list')}>
          <Link to={`/collections/new`}>
            <button
              className={classnames('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent', styles.newCollectionAdd)}>
              New collection
            </button>
          </Link>
          <div className='mdl-card__title'>
            <h2 className='mdl-card__title-text'>My collections</h2>
          </div>

          {collections.length && (
            <Pagination className={styles.pagginationPosition}
                        data={collections}
                        page={pagination.page}
                        perPage={pagination.perPage}
                        selectPage={(page) => ::this.selectPage(page)}>
              {paginate(collections, pagination).data.map((c, i) => (
                <li key={i} className='mdl-list__item'>
                  <div className={classnames('mdl-card mdl-shadow--4dp', styles.root)}>
                    <div className='mdl-card__title'>
                      <button onClick={() => ::this.deleteCollection(c.id)}
                              className={classnames('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent', styles.deleteCollection)}>
                        <i className='material-icons'>delete</i>
                      </button>
                      <h4 className='mdl-card__title-text'>
                        <Link to={`collections/${c.id}`}>
                          {c.title}
                        </Link>
                      </h4>
                    </div>
                    <div className={styles.cardsList}>
                      {c.cards.map((card, i) => (
                          <Card key={i} className={classnames('card m-card-imgRight', styles.cardStyle)} data={card}/>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </Pagination>
          ) || null}
        </ul>
      </div>
    );
  }
}
