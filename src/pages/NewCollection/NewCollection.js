import React from 'react';
import {page} from '../page';
import PureComponent from 'react-pure-render/component';
import {saveCollectionInfo,
  resetCollectionInfo,
  redirect,
  toggleEditCollection,
  switchPlaceholdersVisibility} from '../../actions';
import NewCollectionHeader from '../../components/NewCollection/NewCollectionHeader';
import NewCollectionDescription from '../../components/NewCollection/NewCollectionDescription';
import NewCollectionCards from '../../components/NewCollection/NewCollectionCards';
import CollectionAddCardDialog from '../../components/NewCollection/CollectionAddCardDialog';
import Header from '../../components/Common/Header.js';
import Footer from '../../components/Footer/Footer.js';

import classnames from 'classnames';

const debug = require('debug')('app:collection');


function collection(state) {
  const {authenticated} = state.auth;
  const {showPlaceholders, savedCollectionInfo, editCollection} = state.collection;
  return {showPlaceholders, savedCollectionInfo, authenticated, editCollection};
}

@page('NewCollection', collection, {saveCollectionInfo, resetCollectionInfo, redirect, toggleEditCollection, switchPlaceholdersVisibility})
export default class NewCollection extends PureComponent {
  static contextTypes = {
    horizon: React.PropTypes.func
  };

  static fetchData({}) {
    return {};
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      horizon: context.horizon,
      params: null,
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
          debug('Completed fetch data');
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
    const {savedCollectionInfo} = nextProps;

    if (!savedCollectionInfo.id) {
      this.getUserCollection();
    }
  }

  render() {
    const {loaded} = this.state;
    const {authenticated, params} = this.props;
    return (
      <div className={classnames('mdl-layout', 'mdl-layout--fixed-header')}>
      <Header params={params}/>
        {loaded && (
          <main className='mdl-layout__content'>
            <div className='page-content'>
              {authenticated && <NewCollectionHeader />}
              <NewCollectionDescription />
              <NewCollectionCards />
              <CollectionAddCardDialog />
            </div>
            <Footer />
          </main>
        )}
      </div>
    );
  }
}
