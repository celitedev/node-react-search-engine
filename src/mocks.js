import FakeRest from 'fakerest';
import sinon from 'sinon/pkg/sinon';
import _ from 'lodash';

const data = {
  'collections': [
    {
      id: 0,
      title: 'col 0 title',
      subtitle: 'col 0 subttitle',
      description: 'col 0 description',
      cards: [{
        id: '04b0c3eb-6d0d-5772-99bc-df597a8a1cad',
        title: 'Card title',
        description: 'some nice optional description why this card belongs to this collection',
      }, {
        id: '8d0c761b-5cd5-554c-ad10-56a9d0f58df0',
        title: 'Card title',
        description: 'This card also belongs here...'
      }]
    },
    {
      id: 1,
      title: 'col 1 title',
      subtitle: 'col 1 subttitle',
      description: 'col 1 description',
      cards: [{
        id: '04b0c3eb-6d0d-5772-99bc-df597a8a1cad',
        title: 'Card title',
        description: 'some nice optional description why this card belongs to this collection',
      }, {
        id: '8d0c761b-5cd5-554c-ad10-56a9d0f58df0',
        title: 'Card title',
        description: 'This card also belongs here...'
      }]
    }
  ],
  'me': [{
    id: 0,
    name: 'Jon',
    nickname: 'Lennon'
  }
  ]
};

// initialize fake REST server
const restServer = new FakeRest.Server();
restServer.init(data);

/**
 * modify the request before FakeRest handles it
 */
restServer.addRequestInterceptor((request) => {
  //if (request.method === 'GET') {
  //  const collections = localStorage.getItem('collections') || [];
  //  const updatedCollection = _.filter(collections, col => {
  //    return col.id;
  //  });
  //  localStorage.setItem('collections', JSON.stringify(collections));
  //  localStorage.setItem(action.name, action.collection);
  //}
  return request; // always return the modified input
});

/**
 * modify the response before FakeRest sends it
 */
restServer.addResponseInterceptor((response) => {
  return response; // always return the modified input
});

// use sinon.js to monkey-patch XmlHttpRequest
const server = sinon.fakeServer.create();
server.respondWith(restServer.getHandler());
