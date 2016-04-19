import FakeRest from 'fakerest';
import sinon from 'sinon/pkg/sinon';
import _ from 'lodash';

const data = {
  'getCollection': [{
    id: 0,
    title: 'col 0 title',
    subtitle: 'col 0 subttitle',
    description: 'col 0 description',
    img: 'http://placehold.it/350x150',
    cards: [{
      id: '04b0c3eb-6d0d-5772-99bc-df597a8a1cad',
      collectionId: 0,
      title: 'Card title',
      content: 'card text',
      description: 'some nice optional description',
      type: 'place',
      img: 'http://placehold.it/350x150'
    }, {
      id: '8d0c761b-5cd5-554c-ad10-56a9d0f58df0',
      collectionId: 0,
      title: 'Card title',
      content: 'card text',
      description: 'This card also belongs here...',
      type: 'person',
      img: 'http://placehold.it/350x150'
    }]
  }],
  'collections': [
    {
      id: 0,
      title: 'col 0 title',
      subtitle: 'col 0 subttitle',
      description: 'col 0 description',
      img: 'http://placehold.it/350x150',
      cards: [{
        id: '04b0c3eb-6d0d-5772-99bc-df597a8a1cad',
        collectionId: 0,
        title: 'Card title',
        content: 'card text',
        description: 'some nice optional description',
        type: 'place',
        img: 'http://placehold.it/350x150'
      }, {
        id: '8d0c761b-5cd5-554c-ad10-56a9d0f58df0',
        collectionId: 0,
        title: 'Card title',
        content: 'card text',
        description: 'This card also belongs here...',
        type: 'person',
        img: 'http://placehold.it/350x150'
      }]
    },
    {
      id: 1,
      title: 'col 1 title',
      subtitle: 'col 1 subttitle',
      description: 'col 1 description',
      cards: [{
        id: '04b0c3eb-6d0d-5772-99bc-df597a8a1cad',
        collectionId: 1,
        title: 'Card title',
        content: 'card text',
        description: 'some nice optional description',
        type: 'place',
        img: 'http://placehold.it/350x150'
      }, {
        id: '8d0c761b-5cd5-554c-ad10-56a9d0f58df0',
        collectionId: 1,
        title: 'Card title',
        content: 'card text',
        description: 'This card also belongs here...',
        type: 'person',
        img: 'http://placehold.it/350x150'
      }]
    }
  ],
  'cards': [{
    id: '04b0c3eb-6d0d-5772-99bc-df597a8a1cad1',
    title: 'Card title',
    content: 'card text',
    description: 'some nice optional description',
    type: 'person',
    img: 'http://placehold.it/350x150'
  }, {
    id: '8d0c761b-5cd5-554c-ad10-56a9d0f58df02',
    title: 'Card title',
    content: 'card text',
    description: 'This card also belongs here...',
    type: 'place',
    img: 'http://placehold.it/350x150'
  }],
  'me': [{
    id: 0,
    name: 'Jon',
    nickname: 'Lennon'
  }
  ]
};

let mockData;
if (!localStorage.mockData) {
  localStorage.setItem('mockData', JSON.stringify(data));
  mockData = data;
} else {
  mockData = JSON.parse(localStorage.getItem('mockData'));
}

function triggerSave(place, data) {
  mockData[place].push(data);
  localStorage.setItem('mockData', JSON.stringify(mockData));
}

// initialize fake REST server
const restServer = new FakeRest.Server();
restServer.init(mockData);

/**
 * modify the request before FakeRest handles it
 */
restServer.addRequestInterceptor((request) => {
  if (request.queryString === '/saveCollection') {
    triggerSave('collections', request.requestBody);
  }
  return request; // always return the modified input
});

/**
 * modify the response before FakeRest sends it
 */
restServer.addResponseInterceptor((response) => {
  return response; // always return the modified input
});

const server = sinon.fakeServer.create();
server.respondWith(restServer.getHandler());

// server.respondWith('GET', /\/me\/(\d+)/, function (xhr, id) {
//   debugger;
//   xhr.respond(200, {'Content-Type': 'application/json'}, JSON.serialize(mockData.me));
// });
//
// server.respondWith('POST', /\/collections\//, function (xhr, id) {
//   mockData.collections.push({
//     id: 329
//
//   });
//   xhr.respond(200, {'Content-Type': 'application/json'}, JSON.serialize());
//   triggerSave();
// });
