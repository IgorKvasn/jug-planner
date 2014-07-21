var log = require('winston');
var errors = require('./errors');
var password = require('password-hash-and-salt');
var RSVP = require('rsvp');
var EventModel = require('../models/events').Event;
var _ = require("lodash");

/**
 * event:
 *  - date
 *  - location
 */

exports.addEvent = function (event) {

    return new RSVP.Promise(function (resolve, reject) {
        if (!event || !event.location) {
            reject('Invalid new event data');
            return;
        }

        var newEvent = new EventModel({
            date: event.date,
            location: event.location
        });

        newEvent.save(function (err, newEvent) {
            if (err) {
                log.error(err);
                reject(err);
            } else {
                log.debug('Event saved: ' + JSON.stringify(newEvent));
                resolve();
            }
        });


    });

};
/**
 * input param:
 *  - id (MongoDB event ID!!!)
 *  - location
 *  - date
 * @param event
 * @returns {exports.Promise}
 */
exports.updateEvent = function (event) {
    return new RSVP.Promise(function (resolve, reject) {
        if (!event || !event.id) {
            reject('Invalid new event data');
            return;
        }

        EventModel.where('_id', event.id).update({$set: {date: event.date, location: event.location}}, function (err, count) {
            if (err) {
                log.error(err);
                reject(err);
            } else {
                log.debug('Event updated');
                resolve('ok');
            }
        });
    });
};

/**
 * returns collection of events; collection is sorted from newest to oldest:
 * - location
 * - date
 * - MongoDB ID
 * @returns {exports.Promise}
 */
exports.readAllEvents = function () {
    return new RSVP.Promise(function (resolve, reject) {
        EventModel.find({}, 'location date _id')
            .sort('-date')
            .exec(function (err, events) {
                if (err) {
                    log.error(err);
                    reject(err);
                } else {
                    var result = _.map(events, function (e) {
                        return {
                            location: e.location,
                            date: e.date,
                            id: e._id
                        };
                    });

                    resolve(result);
                }
            });
    });
};

exports.readEvent = function (eventId) {
    return new RSVP.Promise(function (resolve, reject) {
        if (!eventId){
            reject('Invalid eventId');
            return;
        }
        EventModel.find({_id: eventId}, 'location date')
            .exec(function (err, events) {
                if (err) {
                    log.error(err);
                    reject(err);
                } else {
                    //todo maybe handle an error scenario, when nothing is found - this should return 404 (as a proper REST thingy)
                    resolve(events);
                }
            });
    });
};