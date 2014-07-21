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

        if (!topic){
            reject('Invalid topic data');
            return;
        }

        if (!topic.keywords){
            topic.keywords = '';
        }else{
            topic.keywords = topic.keywords.split(',');
        }

        var newTopic = new TopicModel({
            name: topic.name,
            userId: topic.userId,
            eventId: topic.eventId,
            keywords: topic.keywords,
            description: topic.description
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