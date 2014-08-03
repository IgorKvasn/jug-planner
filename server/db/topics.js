var log = require('winston');
var errors = require('./errors');
var password = require('password-hash-and-salt');
var RSVP = require('rsvp');
var TopicModel = require('../models/topics').Topic;
var _ = require('lodash');

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

        if (!topic) {
            reject('Invalid topic data');
            return;
        }

        if (!topic.keywords) {
            topic.keywords = '';
        } else {
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

exports.readTopicByEvent = function (eventId) {

    return new RSVP.Promise(function (resolve, reject) {
        if (!eventId) {
            reject('Incomplete eventId');
            return;
        }

        TopicModel.find({ eventId: eventId }, 'name userId eventId keywords description', function (err, topics) {
            if (err) {
                log.error(err);
                reject(err);
            } else {
                resolve(topics); //todo perhaps return 404 if no topic is found - to act REST-ish
            }
        });
    })
};

exports.readAllEventsWithTopics = function () {
    return new RSVP.Promise(function (resolve, reject) {

        TopicModel.find({})
            .populate('userId eventId')
            .sort('-date')
            .exec(function (err, topics) {
                if (err) {
                    log.error(err);
                    reject(err);
                } else {
                    resolve(_.map(topics, function(t){
                        t.userId.__v = null;
                        t.eventId.__v = null;
                        return t;
                    }));
                }
            });
    });
};