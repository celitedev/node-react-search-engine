import React from 'react';
import {page} from '../page';
import {saveCollectionInfo, resetCollectionInfo, redirect, switchPlaceholdersVisibility} from '../../actions';
import NewCollectionHeader from '../../components/NewCollection/NewCollectionHeader';
import NewCollectionDescription from '../../components/NewCollection/NewCollectionDescription';
import NewCollectionCards from '../../components/NewCollection/NewCollectionCards';
import CollectionAddCardDialog from '../../components/NewCollection/CollectionAddCardDialog';
import Header from '../../components/Common/Header.js';
const debug = require('debug')('app:collection');

function collection(state) {
  const {authenticated} = state.auth;
  const {showPlaceholders, savedCollectionInfo} = state.collection;
  return {showPlaceholders, savedCollectionInfo, authenticated};
}

@page('NewCollection', collection, {saveCollectionInfo, resetCollectionInfo, redirect, switchPlaceholdersVisibility})
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

  getUserCollection() {
    const {horizon} = this.state;
    const {params, saveCollectionInfo, location, switchPlaceholdersVisibility, authenticated, showPlaceholders} = this.props;
    const collections = horizon('collections');
    if (!authenticated && showPlaceholders) {
      switchPlaceholdersVisibility();
    }
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
    resetCollectionInfo();
    this.getUserCollection();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loaded === this.props.loaded) return;
    debug('Next props', nextProps);
    resetCollectionInfo();
    this.getUserCollection();
  }

  render() {
    const {loaded} = this.state;
    const {params, authenticated} = this.props;
    return (
      <div>
      <Header params={params}/>
        {loaded && (
          <div className={styles.overflow}>
            {authenticated && <NewCollectionHeader />}
            <NewCollectionDescription />
            <NewCollectionCards />
            <CollectionAddCardDialog />
          </div>
        )}
      </div>
    );
  }

}
