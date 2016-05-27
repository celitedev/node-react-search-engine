import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import {page} from '../page';
import {saveCollectionInfo, resetCollectionInfo} from '../../actions';
import NewCollectionHeader from '../../components/NewCollection/NewCollectionHeader';
import NewCollectionDescription from '../../components/NewCollection/NewCollectionDescription';
import NewCollectionCards from '../../components/NewCollection/NewCollectionCards';
import CollectionAddCardDialog from '../../components/NewCollection/CollectionAddCardDialog';
import Header from '../../components/Common/Header.js';
const debug = require('debug')('app:collection');

function collection(state) {
  const {showPlaceholders, savedCollectionInfo} = state.collection;
  return {showPlaceholders, savedCollectionInfo};
}

@page('NewCollection', collection, {saveCollectionInfo, resetCollectionInfo})
export default class NewCollection extends PureComponent {
  static contextTypes = {
    horizon: React.PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      horizon: context.horizon,
      loaded: false
    };
  }

  static fetchData({dispatch, params}) {
    return {
      // collection: dispatch({
      //   type: API_REQUEST,
      //   method: 'get',
      //   path: '/collections/one',
      //   query: params
      // })
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
    const {resetCollectionInfo} = this.props;
    resetCollectionInfo();
    this.getUserCollection();
  }

  componentWillReceiveProps(nextProps) {
    debug('Next props', nextProps);
  }

  render() {
    const {loaded} = this.state;
    const {params} = this.props;
    return (
      <div>
      <Header params={params}/>
        {loaded && (
        <div className={styles.background}>
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
