
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./server/routes');
var http = require('http');
var path = require('path');
var log = require('winston');
var mongoose = require('mongoose');
var fs = require('fs');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//MongoDB connection.
mongoose.connect('mongodb://localhost/JugPlanner');
var db = mongoose.connection;
//When connection error happens, display an error message.
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log('Connected to MongoDB.');
});

//load all MongoDB models
fs.readdirSync(__dirname + '/server/models').forEach(function(f){
    if (~f.indexOf('.js')){
        log.info('Loading MongoDB model: ' + f);
        require(__dirname + '/server/models/' + f);
    }

});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  log.level = 'silly';
}

//Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

//API
app.post('/api/login', routes.login);
app.post('/api/logout', routes.logout);
app.post('/api/register', routes.register);

app.get('/api/user', routes.users);

app.post('/api/event', routes.event.add);
app.get('/api/event', routes.event.readAll);
app.put('/api/event', routes.event.update);
app.get('/api/event/:id', routes.event.readOne);

app.post('/api/topic', routes.topic.add);
app.get('/api/topic/:id', routes.topic.readByEvent);

app.get('/api/event-topic', routes.event.readAllTopics);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
