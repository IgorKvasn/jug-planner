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
        if (!event || !event.date) {
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
 * returns collection of events:
 * - location
 * - date
 * - MongoDB ID
 * @returns {exports.Promise}
 */
exports.readAllEvents = function () {
    return new RSVP.Promise(function (resolve, reject) {
        EventModel.find({}, function (err, events) {
            if (err) {
                log.error(err);
                reject(err);
            } else {
                var result = _.map(events, function(e){
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