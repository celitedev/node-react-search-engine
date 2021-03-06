import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import Pagination from './Widgets/Pagination';
import {connect} from 'redux-simple';
import {toggleLoginModal, toggleEditCollection, redirect, switchPlaceholdersVisibility, resetCollectionInfo} from '../actions';
import {RaisedButton} from 'material-ui';
import {List, ListItem} from 'material-ui/List';
import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import autobind from 'autobind-decorator';
import Footer from '../components/Footer/Footer.js';

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
  const {showPlaceholders} = state.collection;
  const {user} = state.auth;
  return {user, showPlaceholders};
}

@connect(userInfo, {toggleLoginModal, toggleEditCollection, redirect, switchPlaceholdersVisibility, resetCollectionInfo})
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

  componentDidMount() {
    const {resetCollectionInfo} = this.props;
    resetCollectionInfo();
  }

  deleteCollection(event, collectionId) {
    event.stopPropagation();
    const {horizon} = this.state;
    const {user} = this.props;
    const collections = horizon('collections');
    collections.remove({userId: user.id, id: collectionId}).subscribe(collection => {
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

  @autobind
  createCollection() {
      const {redirect, toggleEditCollection} = this.props;
      toggleEditCollection(true);
      redirect(`/collections/new`);
  }

  editCollection(event, collection, edit) {
    event.stopPropagation();
    const {redirect, toggleEditCollection} = this.props;
    toggleEditCollection(edit);
    redirect(`collections/${collection.id}`);
  }

  render() {
    const {pagination, collections} = this.state;
    return (
      <main className='mdl-layout__content'>
        <div className='page-content'>
          <ul className={classnames(styles.root, 'mdl-list')}>
            <RaisedButton
              label='New collection'
              primary={true}
              className={styles.newCollectionAdd}
              onClick={this.createCollection}/>
            <FloatingActionButton mini={true} secondary={true} className={styles.newCollectionAddSmall} onClick={this.createCollection}>
              <ContentAdd />
            </FloatingActionButton>
            <div className='mdl-card__title'>
              <h2 className={classnames('mdl-card__title-text', styles.title)}>MY COLLECTIONS</h2>
            </div>

            {collections.length && (
              <Pagination className={styles.pagginationPosition}
                          data={collections}
                          page={pagination.page}
                          perPage={pagination.perPage}
                          selectPage={(page) => ::this.selectPage(page)}>
                {paginate(collections, pagination).data.map((c, i) => (
                  <List key={i}>
                    <ListItem>
                      <Card className={styles.cardStyle} onClick={(event) => this.editCollection(event, c, false)}>
                      {!_.isEmpty(c.img) && (
                        <CardMedia className={styles.imageWrap} style={{backgroundImage: `url(${c.img})`}}/>
                      )}
                      <div className={styles.cardFlexGrow}>
                        <CardTitle
                          title={c.title}
                          titleStyle={{'color': '#666666', 'fontSize': '28px', 'fontWeight': '500', 'textAlign': 'center'}}
                          subtitle={c.subTitle}
                          subtitleStyle={{'color': '#158655', 'fontSize': '18px', 'fontStyle': 'italic', 'fontWeight': '500', 'textAlign': 'center'}}/>
                        {c.description && (
                          <CardText style={{'textAlign': 'center'}}>
                            {c.description.replace(/<.*?>/g, '')}
                          </CardText>
                        )}
                        <CardActions>
                          <RaisedButton
                            primary={true}
                            labelPosition='before'
                            icon={<EditIcon />}
                            className={styles.editBtn}
                            label='Edit' onClick={(event) => this.editCollection(event, c, true)}/>
                          <RaisedButton
                            label='Delete'
                            labelPosition='before'
                            icon={<DeleteIcon />}
                            secondary={true}
                            onClick={(event) => ::this.deleteCollection(event, c.id)}/>
                        </CardActions>
                        </div>
                      </Card>
                    </ListItem>
                  </List>
                ))}
              </Pagination>
            ) || null}
          </ul>
        </div>
        <Footer />
      </main>
    );
  }
}
