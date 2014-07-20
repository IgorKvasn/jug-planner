var log = require('winston');
var errors = require('./errors');
var password = require('password-hash-and-salt');
var RSVP = require('rsvp');
var TopicModel = require('../models/topics').Topic;


/**
 * finds all previous JUG events and compiles them into a short summary
 */
exports.archive = function(){

};