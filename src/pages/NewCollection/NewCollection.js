import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import {page} from '../page';
import {saveCollectionInfo, resetCollectionInfo, redirect} from '../../actions';
import NewCollectionHeader from '../../components/NewCollection/NewCollectionHeader';
import NewCollectionDescription from '../../components/NewCollection/NewCollectionDescription';
import NewCollectionCards from '../../components/NewCollection/NewCollectionCards';
import CollectionAddCardDialog from '../../components/NewCollection/CollectionAddCardDialog';
import Header from '../../components/Common/Header.js';
const debug = require('debug')('app:collection');

function collection(state) {
  const {user} = state.auth;
  const {showPlaceholders, savedCollectionInfo} = state.collection;
  return {showPlaceholders, savedCollectionInfo, user};
}

@page('NewCollection', collection, {saveCollectionInfo, resetCollectionInfo, redirect})
export default class NewCollection extends React.Component {
  static contextTypes = {
    horizon: React.PropTypes.func
  };

  static fetchData({dispatch, params}) {
    return {};
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      horizon: context.horizon,
      loaded: false
    };
  }

  getUserCollection(user) {
    const {horizon} = this.state;
    const {params, saveCollectionInfo, location} = this.props;
    const collections = horizon('collections');
    if (location.pathname === '/collections/new') {
      setTimeout(() => {
        this.setState({
        loaded: true
      });
      }, 100);
    } else {
      collections.find({id: params.collectionId}).fetch().subscribe(collection => {
          debug('Fetched collection', collection);
          saveCollectionInfo({...collection});
          debug('Collection saved to redux');
        },
        (err) => debug('Error fetch data from db', err),
        () => {
          debug('Compleated fetch data');
          this.setState({
            loaded: true
          });
        });
    }
  }

  componentDidMount() {
    const {user} = this.props;
    resetCollectionInfo();
    if (user) {
      this.getUserCollection(user);
    }
  }

  componentWillReceiveProps(nextProps) {
    debug('Next props', nextProps);
    const {authenticated, user} = nextProps;
    const {loaded} = this.state;
    resetCollectionInfo();
    if (authenticated && !loaded) {
      this.getUserCollection(user);
    }
  }

  render() {
    const {loaded} = this.state;
    const {params} = this.props;
    return (
      <div>
      <Header params={params}/>
        {loaded && (
        <div className={styles.overflow}>
          <NewCollectionHeader />
          <NewCollectionDescription />
          <NewCollectionCards />
          <CollectionAddCardDialog />
        </div>
        ) || (<div>Loading...</div>)}
      </div>
    );
  }

}
