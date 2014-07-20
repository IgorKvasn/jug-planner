var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicSchema = new Schema({
    name:{ type: String, required: true},
    userId:{type: Schema.ObjectId, required: true, ref: 'users'},
    eventId:{type: Schema.ObjectId, required: true, ref:'events'},
    keywords: {type:String},
    description:{type:String}
});

var topic = mongoose.model('topics', topicSchema);
module.exports = {
    Topic: topic
};
