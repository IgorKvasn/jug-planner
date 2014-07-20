var log = require('winston');
var errors = require('./errors');
var password = require('password-hash-and-salt');
var RSVP = require('rsvp');
var UserModel = require('../models/users').User;
var userManager = require('../userManager');

exports.register = function (userData) {

    return new RSVP.Promise(function (resolve, reject) {
        isUsernameUnique().then(function (uniq) {
            if (!uniq) {
                reject('Username has been already taken by someone else.');
                return;
            }

            createNewUser(userData).then(function (result) {
                resolve();
            }).catch(function (err) {
                reject('Unable to register:' + err);
            });

        }).catch(function (err) {
            reject('Unable to register:' + err);
        });
    });


    function createNewUser(userData) {

        return new RSVP.Promise(function (resolve, reject) {
            generatePasswordHash(userData.password1).then(function (hash) {
                var newUser = new UserModel({
                    name: userData.username.toLowerCase(),
                    password: hash,
                    email: userData.email
                });

                newUser.save(function (err, newUser) {
                    if (err) {
                        log.error(err);
                        reject(err);
                    } else {
                        log.debug('User saved: ' + JSON.stringify(newUser));
                        resolve();
                    }
                });


            }).catch(function (err) {
                reject(err);
            });

        });

    }

    function generatePasswordHash(passwordText) {
        return new RSVP.Promise(function (resolve, reject) {

            password(passwordText).hash(function (error, hash) {
                    if (error) {
                        log.error('unable to create password hash', error);
                        reject(error);
                    } else {
                        resolve(hash);
                    }
                }
            );
        })
    }

    function isUsernameUnique() {
        return new RSVP.Promise(function (resolve, reject) {
            UserModel.find({ name: userData.username.toLowerCase()}, function (err, users) {
                if (err) {
                    log.error(err);
                    reject(err);
                } else {
                    if (users.length === 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        })
    }
};

exports.login = function (userData) {

    return new RSVP.Promise(function (resolve, reject) {
        if (!userData || !userData.username || !userData.password) {
            log.debug('Incomplete login credentials');
            reject('Incomplete login credentials');
            return;
        }
        UserModel.findOne({ name: userData.username.toLowerCase() }, 'password role', function (err, user) {
            if (err) {
                log.error(err);
                reject(err);
            } else {
                if (!user) {//no user with such username
                    reject('Wrong username/password');
                    return;
                }
                password(userData.password).verifyAgainst(user.password, function (error, verified) {
                    if (error) {
                        reject('Cannot verify password - server error.');
                        return;
                    }
                    if (!verified) {
                        reject('Wrong username/password');
                    } else {
                        userManager.addLoggedUser(userData.username, user.role);
                        resolve();
                    }
                });
            }
        });
    });
};

exports.logout = function (username) {
    //todo add some kind of user validation, so that only the logged user can logout himself/herself
    return new RSVP.Promise(function (resolve, reject) {
        if (!username) {
            reject('You have to specify the username');
            return;
        }

        userManager.removeLoggedUser(username);
        resolve();
    })
};