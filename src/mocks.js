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
  cards: [{
    id: '04b0c3eb-6d0d-5772-99bc-df597a8a1cad1',
    title: 'Card title',
    content: 'card text',
    description: 'some nice optional description',
    type: 'person',
    img: 'http://placehold.it/350x150'
  },
    {
      id: '34342343234',
      title: 'New card',
      content: 'card text',
      description: 'some nice optional description',
      type: 'person',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '56456234243242',
      title: 'Nice event',
      content: 'card text',
      description: 'some nice optional description',
      type: 'creative',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '234234123123132',
      title: 'Another card',
      content: 'card text',
      description: 'some nice optional description',
      type: 'person',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '8d0c761b-5cd5-554c-ad10-56a9d0f58df02',
      title: 'Card title',
      content: 'card text',
      description: 'This card also belongs here...',
      type: 'place',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '43545234',
      title: 'New card',
      content: 'card text',
      description: 'some nice optional description',
      type: 'person',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '5645623433343243242',
      title: 'Nice event',
      content: 'card text',
      description: 'some nice optional description',
      type: 'creative',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '234234142423123132',
      title: 'Another card',
      content: 'card text',
      description: 'some nice optional description',
      type: 'person',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '8d0c76134343b-5cd5-554c-ad10-56a9d0f58df02',
      title: 'Card title',
      content: 'card text',
      description: 'This card also belongs here...',
      type: 'place',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '3434234234',
      title: 'New card',
      content: 'card text',
      description: 'some nice optional description',
      type: 'person',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '564562321214243242',
      title: 'Nice event',
      content: 'card text',
      description: 'some nice optional description',
      type: 'creative',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '23423412123123123132',
      title: 'Another card',
      content: 'card text',
      description: 'some nice optional description',
      type: 'person',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '8d0c761b-5c2323d5-554c-ad10-56a9d0f58df02',
      title: 'Card title',
      content: 'card text',
      description: 'This card also belongs here...',
      type: 'place',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '4354524545434',
      title: 'New card',
      content: 'card text',
      description: 'some nice optional description',
      type: 'person',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '56456234333432323243242',
      title: 'Nice event',
      content: 'card text',
      description: 'some nice optional description',
      type: 'creative',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '2342341434342423123132',
      title: 'Another card',
      content: 'card text',
      description: 'some nice optional description',
      type: 'person',
      img: 'http://placehold.it/350x150'
    },
    {
      id: 'sd-5cd5-554c-ad10-56a9d0f58df02',
      title: 'Card title',
      content: 'card text',
      description: 'This card also belongs here...',
      type: 'place',
      img: 'http://placehold.it/350x150'
    },
    {
      id: 'sda-5cd5-554c-ad10-56a9d0f58df02',
      title: 'Card title',
      content: 'card text',
      description: 'This card also belongs here...',
      type: 'place',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '8d0c76rerdfd134343b-5cd5-554c-ad10-56a9d0f58df02',
      title: 'Card title',
      content: 'card text',
      description: 'This card also belongs here...',
      type: 'place',
      img: 'http://placehold.it/350x150'
    },
    {
      id: '8d0c76rsssser134343b-5cd5-554c-ad10-56a9d0f58df02',
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

/*
State
 */
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

/*
Get suggestions
 */

function escapeRegexCharacters(str, data, filter = 'all') {
  const escapedValue = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp('^' + escapedValue, 'i');
  return data.filter(card => regex.test(card.title) && (card.type === filter || filter === 'all'));
}

function getParameterByName(name, url) {
  const param = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + param + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/*
Server routes
 */
const server = sinon.fakeServer.create();

server.respondWith('GET', /\/me/, (xhr, id) => {
  respond(xhr, state.me);
});

server.respondWith('GET', /\/cards\/getcards/, (xhr, id) => {
  const queryParam = getParameterByName('query', xhr.url);
  const type = getParameterByName('type', xhr.url);
  const requestedCards = escapeRegexCharacters(queryParam.trim(), state.cards, type);
  respond(xhr, requestedCards);
});

server.respondWith('GET', /\/cards\/suggestions/, (xhr, id) => {
  const queryParam = getParameterByName('value', xhr.url);
  const suggestedCards = escapeRegexCharacters(queryParam.trim(), state.cards);
  respond(xhr, suggestedCards);
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
