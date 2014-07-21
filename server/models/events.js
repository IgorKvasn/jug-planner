var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    date:{ type: Date}, //if date not specified, this is a upcoming event
    location:{ type: String, required: true}
});

var event = mongoose.model('events', eventSchema);
module.exports = {
    Event: event
};
