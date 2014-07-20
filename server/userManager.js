var _ = require('lodash');
var log = require('winston');
var loggedUsers = [];


exports.loggedUsers = loggedUsers;

exports.addLoggedUser = function (username, role) {
    //todo on user login, random ID (token) will be generated - this will be used with every user request
    log.debug('user login: ' + username);

    var alreadyLogged = _.find(loggedUsers, {username: username});
    if (!alreadyLogged) {
        loggedUsers.push({username: username, role: role});
    }
};

exports.removeLoggedUser = function(username){
    log.debug('user logout: ' + username);
    _.remove(loggedUsers, function(user) { return user.username === username; });
};

exports.getUserLogged = function(username){
    return _.find(loggedUsers, {username: username});
};


exports.userRoles = {
    commonUser: 0,
    admin:10
};