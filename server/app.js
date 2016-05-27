var express = require('express');
var horizon = require('@horizon/server');

var app = express();

module.exports = (function(){
  var port = process.env.PORT || 3000;

  var httpServer = app.listen(port, function(err) {
    if (err) {
      console.log(err); // eslint-disable-line
      return;
    }

    console.log(`Express listening at http://localhost:${3000}`); // eslint-disable-line
  });

  // @TODO make this configurable
  horizon(httpServer, {
    auto_create_collection: true,
    auto_create_index: true,
    project_name: 'kwhen',
    permissions: false, // waiting for additions to permission system atm
    auth: {
      allow_anonymous: true,
      allow_unauthenticated: true,
      token_secret: 'sdsds'
    }
  });
})();
