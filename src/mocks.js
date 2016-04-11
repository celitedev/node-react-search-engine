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
  ]
};

// initialize fake REST server
const restServer = new FakeRest.Server();
restServer.init(data);

// use sinon.js to monkey-patch XmlHttpRequest
const server = sinon.fakeServer.create();
server.respondWith(restServer.getHandler());
