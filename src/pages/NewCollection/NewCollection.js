import React from 'react';
import {page} from '../page';
import {saveCollectionInfo, resetCollectionInfo, redirect, switchPlaceholdersVisibility} from '../../actions';
import NewCollectionHeader from '../../components/NewCollection/NewCollectionHeader';
import NewCollectionDescription from '../../components/NewCollection/NewCollectionDescription';
import NewCollectionCards from '../../components/NewCollection/NewCollectionCards';
import CollectionAddCardDialog from '../../components/NewCollection/CollectionAddCardDialog';
import Header from '../../components/Common/Header.js';
import classnames from 'classnames';

const debug = require('debug')('app:collection');


function collection(state) {
  const {authenticated} = state.auth;
  const {showPlaceholders, savedCollectionInfo, editCollection} = state.collection;
  return {showPlaceholders, savedCollectionInfo, authenticated, editCollection};
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
    const {location, authenticated, redirect, resetCollectionInfo} = this.props;
    resetCollectionInfo();
    if (!authenticated) {
      if (location.pathname === '/collections/new') {
        setTimeout(() => {
          redirect('/');
        }, 500);
      }
    }
    this.getUserCollection();
  }

  componentWillReceiveProps(nextProps) {
    const {loaded, authenticated} = this.props;
    if (nextProps.loaded === loaded) return;
    if (nextProps.user && (nextProps.user.authenticated !== authenticated)) {
      debug('Next props', nextProps);
      resetCollectionInfo();
      this.getUserCollection();
    } else return;
  }

  render() {
    const {loaded} = this.state;
    const {editCollection, authenticated, params} = this.props;
    return (
      <div className={classnames('mdl-layout', 'mdl-layout--fixed-header')}>
      <Header params={params}/>
        {loaded && (
          <main className='mdl-layout__content'>
            <div className='page-content'>
              {(authenticated && editCollection) && <NewCollectionHeader />}
              <NewCollectionDescription />
              <NewCollectionCards />
              <CollectionAddCardDialog />
            </div>
          </main>
        )}
      </div>
    );
  }

}
