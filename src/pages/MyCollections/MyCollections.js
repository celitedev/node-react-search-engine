import React from 'react';
import PureComponent from 'react-pure-render/component';
import {page} from '../page';
import MyCollections from '../../components/MyCollections';
import Header from '../../components/Common/Header.js';
import {redirect, resetCollectionInfo} from '../../actions';

const debug = require('debug')('app:mycollections');

function userInfo(state) {
  const {user, authenticated} = state.auth;
  return {user, authenticated};
}

@page('MyCollections', userInfo, {redirect, resetCollectionInfo})
export default class Index extends PureComponent {
  static contextTypes = {
    horizon: React.PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      horizon: context.horizon,
      collections: [],
      loaded: false
    };
  }

  static fetchData({}) {
    return {};
  }

  getUserCollections(user) {
    const {horizon} = this.state;
    const collections = horizon('collections');
    collections.findAll({userId: user.id}).fetch().subscribe(collections => {
        debug('Fetched collections', collections);
        this.setState({
          collections
        });
      },
      (err) => debug('Error fetch data from db', err),
      () => {
        debug('Compleated fetching data');
        this.setState({
          loaded: true
        });
      });
  }

  componentDidMount() {
    const {user} = this.props;
    if (user) {
      this.getUserCollections(user);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {authenticated, user, resetCollectionInfo} = nextProps;
    resetCollectionInfo();
    this.setState({
      loaded: false
    });
    if (authenticated) {
      this.getUserCollections(user);
    }
  }

  render() {
    const {params} = this.props;
    const {collections, loaded} = this.state;
    return (
      <div>
        <Header params={params}/>
        {loaded && (
          <MyCollections params={params} collections={loaded && collections || []}/>
        )}
      </div>
    );
  }

}
