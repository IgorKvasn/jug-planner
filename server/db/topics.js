var log = require('winston');
var errors = require('./errors');
var password = require('password-hash-and-salt');
var RSVP = require('rsvp');
var TopicModel = require('../models/topics').Topic;

/**
 * topic:
 *  - name
 *  - user
 *  - event
 *  - keywords
 *  - description
 */

exports.addTopic = function (topic) {

    return new RSVP.Promise(function (resolve, reject) {

            var newTopic = new TopicModel({
                name:topic.name,
//TODO                userId:{type: Schema.ObjectId, required: true, ref: 'users'},
//TODO                eventId:{type: Schema.ObjectId, required: true, ref:'events'},
                keywords: topic.keywords,
                description:topic.description
            });

        newTopic.save(function (err, newTopic) {
                if (err) {
                    log.error(err);
                    reject(err);
                } else {
                    log.debug('Topic saved: ' + JSON.stringify(newTopic));
                    resolve();
                }
            });


    });

};