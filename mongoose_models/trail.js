var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var trailSchema = new Schema({
    st_asgeojson: {
        type: [Number],
        index: '2dsphere'
    },
    route_id: String,
    route_short_name: String,
    route_long_name: String
});

module.exports = mongoose.model('Trail', trailSchema);
