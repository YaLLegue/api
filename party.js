var mongoose = require('mongoose'),
  Schema     = mongoose.Schema;

var partidaSchema = new Schema({
  nombre: String,
  apuesta: String,
  participantes: [],
  destino: String
});

module.exports = mongoose.model('Partida', partidaSchema);
