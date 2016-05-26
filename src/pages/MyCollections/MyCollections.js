import React from 'react';
import PureComponent from 'react-pure-render/component';
import {page} from '../page';
import MyCollections from '../../components/MyCollections';
import Header from '../../components/Common/Header.js';

const debug = require('debug')('app:mycollections');

@page('MyCollections')
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
    return {
      // collections: dispatch({
      //   type: API_REQUEST,
      //   method: 'get',
      //   path: '/collections/all'
      // })
    };
  }

  getUserCollections() {
    const {horizon} = this.state;
    const collections = horizon('collections');
    collections.findAll({userId: 1}).fetch().subscribe(collections => {
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
    this.getUserCollections();
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
      <div>
        <Header params={params}/>
        {loaded && (
        <MyCollections params={params} collections={loaded && collections || []}/>
        ) || (<div>Loading...</div>)}
      </div>
    );
  }

}
