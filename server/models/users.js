var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name:{ type: String, required: true, unique: true},
    password:{ type: String, required: true},
    email:{ type: String, required: true},
    role:{ type: Number, required: true, default: 0}
});

var user = mongoose.model('users', userSchema);
module.exports = {
    User: user
};
