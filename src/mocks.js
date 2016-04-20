import sinon from 'sinon/pkg/sinon';

const debug = require('debug')('app:mocks');

let state = {
  idx: 999,
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
  'me': {
    id: 0,
    name: 'Jon',
    nickname: 'Lennon'
  }
};

function updateState() {
  localStorage.setItem('state', JSON.stringify(state));
}

function loadState() {
  if (!localStorage.state) {
    updateState();
  } else {
    state = JSON.parse(localStorage.getItem('state'));
  }
}


function respond(xhr, data, code = 200) {
  updateState();
  xhr.respond(code, {'Content-Type': 'application/json'}, JSON.stringify(data));
}

loadState();
const server = sinon.fakeServer.create();

server.respondWith('GET', /\/me/, (xhr, id) => {
  respond(xhr, state.me);
});

server.respondWith('GET', /\/cards/, (xhr, id) => {
  respond(xhr, state.cards);
});

server.respondWith('GET', /\/collections/, (xhr, id) => {
  respond(xhr, state.collections);
});

server.respondWith('POST', /\/collections/, (xhr, id) => {
  const obj = xhr.requestBody;
  obj.id = ++state.idx;
  state.collections.push(obj);
  respond(xhr, obj);
});
