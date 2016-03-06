/* jslint node: true */
'use strict';
var fs        = require('fs'),
  schemas   = {},
  basePath  = __dirname + '/../mongoose_models';

fs.readdirSync(basePath).forEach(
  function (file) {
    var path = basePath + '/' + file;
    schemas[file.slice(0, -3)] = require(path);
  }
);

function basicValidations(req, res, next) {
  var schema = req.params.schema.slice(0, -1),
    pathSchema = req.params.schema,
    flag     = true;

  if (schemas[schema] === undefined) {
    res.send(errors.schemaNotFound(pathSchema));
    flag = false;
  }

  if (flag) { next(); }
}

function isEmpty(object) {
  var key;
  for (key in object) {
    if (object.hasOwnProperty(key)) {
      return true;
    }
  }
  return false;
}


module.exports = function (server) {
  server.get('/v1/:schema', function (req, res) {
    var condition = {},
      schema      = req.params.schema.slice(0, -1),
      key,
      keys        = [],
      warning     = {};

    for (key in schemas[schema].schema.paths) {
      if (schemas[schema].schema.paths.hasOwnProperty(key)) {
        keys.push(key);
      }
    }

    schemas[schema].find(condition).select('-_id').exec(
      function (err, docs) {
        if (err) { throw err; }

        var toSend = { data: docs };
        if (isEmpty(warning)) { toSend.warnings = warning; }

        res.json(toSend);
      }
    );
  });
}
