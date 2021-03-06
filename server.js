//
//
//Main App
var express = require('express');
var bodyParser = require('body-parser')
var events = require('./routes/api/EventsRoute.js');
var ratings = require('./routes/api/RatingsRoute.js');
var comments = require('./routes/api/CommentsRoute.js');
var locations = require('./routes/api/LocationsRoute.js');
var images = require('./routes/api/ImagesRoute.js');
var categories = require('./routes/api/CategoriesRoute.js');
var users = require('./routes/api/UsersRoute.js');
var backoffice = require('./routes/api/BackofficeRoute.js');
var notify = require('./routes/api/NotificationRoute.js').notify;
var jwt = require('express-jwt');
var ctx = require('./routes/util/conf.js').context();


var auth = jwt({
  secret: new Buffer(ctx.auth0.secret, 'base64'),
  audience: ctx.auth0.audience
});

var app = express();

// gzip/deflate outgoing responses
var compression = require('compression')

app.set('port', (process.env.PORT || 3002));

app.use(bodyParser.json());
app.use(compression());


app.get('/api/events', events.search);
app.get('/api/events/:id', events.findById);
app.post('/api/events', notify, auth, events.create);
app.put('/api/events/:id', auth, events.update);
app.delete('/api/events/:id', auth, events.delete);
app.post('/api/events/:id/images', notify, auth, events.addImage);
app.get('/api/categories', categories.findAll);
app.post('/api/locations', notify, auth, locations.create);
app.put('/api/locations/:id', auth, locations.update);
app.get('/api/locations', locations.findAll);
app.get('/api/locations/:id', locations.findById);
app.delete('/api/locations/:id', auth, locations.delete);
app.post('/api/locations/:id/images', notify, auth, locations.addImage);
app.get('/api/locations/:id/events', events.findByLocationId);
app.post('/api/images', notify, auth, images.addImage);
app.post('/api/ratings', notify, auth, ratings.create);
app.post('/api/comments', notify, auth, comments.create);
app.get('/api/users/me', auth, users.findCurrent);
app.post('/api/users/me', notify, auth, users.findOrCreate);
app.put('/api/ratings/:id', auth, ratings.update);
app.put('/api/comments/:id', auth, comments.update);
app.get('/api/sync', backoffice.syncEvents);



app.use(function(err, req, res, next) {

  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid Token');
  } else {
    console.error(err);
    res.status(500).send('Something broke!');
  }

  next;
});



app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
