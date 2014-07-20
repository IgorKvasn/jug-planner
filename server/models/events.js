var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    date:{ type: Date, required: true},
    location:{ type: String, required: true}
});

var event = mongoose.model('events', eventSchema);
module.exports = {
    Event: event
};
