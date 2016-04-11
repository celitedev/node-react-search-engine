import FakeRest from 'fakerest';
import sinon from 'sinon/pkg/sinon';

const data = {
  'collections': [
    {
      id: 0,
      title: 'col 0 title',
      subtitle: 'col 0 subttitle',
      description: 'col 0 description'
    },
    {
      id: 1,
      title: 'col 1 title',
      subtitle: 'col 1 subttitle',
      description: 'col 1 description'
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
restServer.addRequestInterceptor(function(request) {
  if(request.method === 'GET'){
    let collections = localStorage.getItem('collections') || [];
    let updatedCollection = _.filter(collections, col => {
      return col.id
    });
    localstorage.setItem('collections', JSON.stringify(collections));
    localstorage.setItem(action.name, action.collection);
  }
  return request; // always return the modified input
});

/**
 * modify the response before FakeRest sends it
 */
restServer.addResponseInterceptor(function(response) {
  return response; // always return the modified input
});

// use sinon.js to monkey-patch XmlHttpRequest
const server = sinon.fakeServer.create();
server.respondWith(restServer.getHandler());
