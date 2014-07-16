var log = require('winston');
var pg = require('pg');
var errors = require('./errors');
var password = require('password-hash-and-salt');
var RSVP = require('rsvp');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:heslo@localhost:5432/postgres';


//var client = new pg.Client(connectionString);
//client.connect();

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
                pg.connect(connectionString, function (err, client, done) {
                    if (err) {
                        log.error('error fetching client from pool', err);
                        reject(err);
                        return;
                    }
                    client.query('INSERT INTO users(username, password, email)  VALUES ($1, $2, $3);', [userData.username.toLowerCase(), hash, userData.email], function (err, result) {
                        done();

                        if (err) {
                            log.error(err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
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
            pg.connect(connectionString, function (err, client, done) {
                if (err) {
                    log.error('error fetching client from pool', err);
                    reject(err);
                    return;
                }
                client.query('SELECT count(*) FROM users WHERE username=$1', [userData.username.toLowerCase()], function (err, result) {
                    done();

                    if (err) {
                        log.error(err);
                        reject(err);
                    } else {
                        resolve(+result.rows[0].count === 0);
                    }
                });
            });
        })
    }
}
;