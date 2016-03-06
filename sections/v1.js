/* jslint node: true */
'use strict';
var fs        = require('fs'),
  url       = require('url');

module.exports = function (server) {
  server.get('/hola', function (req, res) {
    res.send('Hola');
  });
}
