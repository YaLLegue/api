/* jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  http = require('http'),
  conectionString = 'mongodb://localhost:27017/mapaton',
  app = require('./app');

mongoose.connect(conectionString, function (err) {
  if (err) { throw err; }
  console.log('Successfully connected to MongoDB at: ');
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
