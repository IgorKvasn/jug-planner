var db = require('../db');

exports.index = function (req, res) {
    res.render('index');
};

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

exports.register = function (req, res) {
    db.register(req.body).then(function(result){
        res.status(200).send('');
    }).catch(function(err){
        res.status(500).send(err);
    });
};

exports.login = function (req, res){
    db.login(req.body).then(function(result){
        res.status(200).send('');
    }).catch(function(err){
        res.status(403).send(err);
    });
};