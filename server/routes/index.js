var db = require('../db');
var userManager = require('../userManager');
var log = require('winston');

exports.index = function (req, res) {
    res.render('index');
};

exports.archive = function (req, res) {
    db.archive.overview().then(function(events){
        res.render('archive',{events:events});
    }).catch(function(err){
        log.error(err.message);
        res.status(500).send(err);
    });

};

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

exports.register = function (req, res) {
    db.auth.register(req.body).then(function(result){
        res.status(200).send('');
    }).catch(function(err){
        log.error(err.message);
        res.status(500).send(err);
    });
};

exports.login = function (req, res){
    db.auth.login(req.body).then(function(result){
        res.status(200).send('');
    }).catch(function(err){
        log.error(err.message);
        res.status(403).send(err);
    });
};

exports.logout = function (req, res){
    db.auth.logout(req.body.username).then(function(result){
        res.status(200).send('');
    }).catch(function(err){
        log.error(err.message);
        res.status(403).send(err);
    });
};

var event = {};

event.readAll = function(req,res){
    db.event.readAllEvents().then(function(result){
        res.status(200).json(result);
    }).catch(function(err){
        log.error(err.message);
        res.status(500).send(err);
    });
};

event.update = function(req,res){
    //check if authorized
    var logged = userManager.getUserLogged(req.body.username);

    if (!logged || logged.role !== userManager.userRoles.admin){
        res.status(403).send('Not authorized user ' + req.body.username);
        return;
    }

    db.event.updateEvent(req.body.event).then(function(result){
        res.status(200).json(result);
    }).catch(function(err){
        log.error(err.message);
        res.status(500).send(err);
    });
};

event.readOne = function(req, res){
    db.event.readEvent(req.params.id).then(function(result){
        res.status(200).json(result);
    }).catch(function(err){
        log.error(err.message);
        res.status(500).send(err);
    });
};

event.add = function (req, res){
    //check if authorized
    var logged = userManager.getUserLogged(req.body.username);

    if (!logged || logged.role !== userManager.userRoles.admin){
        res.status(403).send('Not authorized user ' + req.body.username);
        return;
    }

    db.event.addEvent(req.body.event).then(function(result){
        res.status(200).send('');
    }).catch(function(err){
        log.error(err.message);
        res.status(500).send(err);
    });
};

exports.event = event;


var topic = {};

topic.add = function (req, res){
    //check if authorized
    var logged = userManager.getUserLogged(req.body.username);

    if (!logged || logged.role !== userManager.userRoles.admin){
        res.status(403).send('Not authorized user ' + req.body.username);
        return;
    }

    db.topics.addTopic(req.body.topic).then(function(result){
        res.status(200).send('');
    }).catch(function(err){
        log.error(err.message);
        res.status(500).send(err);
    });
};

topic.readByEvent = function(req, res){
    db.topics.readTopicByEvent(req.params.id).then(function(result){
        res.status(200).json(result);
    }).catch(function(err){
        log.error(err.message);
        res.status(500).send(err);
    });
};

exports.topic = topic;