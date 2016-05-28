import React from 'react';
import PureComponent from 'react-pure-render/component';
import {page} from '../page';
import MyCollections from '../../components/MyCollections';
import Header from '../../components/Common/Header.js';
import {redirect} from '../../actions';

const debug = require('debug')('app:mycollections');

function userInfo(state) {
  const {user} = state.auth;
  return {user};
}

@page('MyCollections', userInfo, {redirect})
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

  getUserCollections() {
    const {horizon} = this.state;
    const {id} = this.props.user;
    const collections = horizon('collections');
    collections.findAll({userId: id}).fetch().subscribe(collections => {
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
    const {user, redirect} = this.props;
    if (!user || !user.id) {
      redirect('/');
    } else {
      this.getUserCollections();
    }
  }

  componentWillReceiveProps() {
    this.setState({
      loaded: false
    });
    this.getUserCollections();
  }

  render() {
    const {params} = this.props;
    const {collections, loaded} = this.state;
    return (
      <div className='mdl-layout__container'>
        <Header params={params}/>
        {loaded && (
          <MyCollections params={params} collections={loaded && collections || []}/>
        ) || (
          <div>Loading...</div>
        )}
      </div>
    );
  }

}
