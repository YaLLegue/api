/* jslint node: true */
'use strict';
var fs = require('fs'),
    schemas  = {},
    basePath = __dirname + '/../mongoose_models',
    Partida  = require(basePath + '/partida.js'),
    User     = require(basePath + '/user.js');

fs.readdirSync(basePath).forEach(
    function(file) {
        var path = basePath + '/' + file;
        schemas[file.slice(0, -3)] = require(path);
    }
);

function basicValidations(req, res, next) {
    var schema = req.params.schema.slice(0, -1),
        pathSchema = req.params.schema,
        flag = true;

    if (schemas[schema] === undefined) {
        res.send(errors.schemaNotFound(pathSchema));
        flag = false;
    }

    if (flag) {
        next();
    }
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


module.exports = function(server) {
    server.get('/v1/users/:user', function (req, res) {
      User.find({username: req.params.user})
        .exec(function (err, doc) {
          if (err) { throw err;}
          res.send(doc[0]);
        });


    });
    server.get('/v1/:schema', function(req, res) {
        var condition = {},
            schema = req.params.schema.slice(0, -1),
            key,
            keys = [],
            warning = {};

        for (key in schemas[schema].schema.paths) {
            if (schemas[schema].schema.paths.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        schemas[schema].find(condition).exec(
            function(err, docs) {
                if (err) {
                    throw err;
                }

                var toSend = {
                    data: docs
                };
                if (isEmpty(warning)) {
                    toSend.warnings = warning;
                }

                res.json(toSend);
            }
        );
    });

    server.get('/v1/partidas/:idPartida/win', function(req, res) {
        var condition = {
            _id: req.params.idPartida
        };


        Partida.find(condition).exec(function(err, doc) {
            if (err) {
                throw err;
            }

            if (doc[0].cerrado) {
                res.send(false);
            } else {
                console.log('abierto');
                Partida.update({
                    _id: req.params.idPartida
                }, {
                    cerrado: true
                }, function(err, numberAffected, rawResponse) {
                    if (err) {
                        console.log(err);
                    }
                });
                res.send(true);
            }
        })
    });

    server.get('/v1/trail/:keyword', function(req, res) {
        setTimeout(function() {
            res.send({
                nombre: 'Constituyentes (METRO)',
                latitud: '19.411671',
                longitud: '-99.191563'
            });
        }, 3000);
    });


    server.post('/v1/:schema', basicValidations, function(req, res) {
        var schema = req.params.schema.slice(0, -1),
            reference = req.body.reference,
            newDocument = new schemas[schema](reference);
        //newDocument = new schemas[schema]({"name": "amet", "email": "amet.alvirde@gmail.com"});


        newDocument.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.send({
                _id: newDocument._id,
                status: true,
                message: 'Chingón, man.'
            });
        });
    });

}
