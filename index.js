let express = require('express');
//let bearerToken = require('express-bearer-token');
let bodyParser = require('body-parser');

// Routers

let userRoutes = require('./app/routes/user-router');
let Versioning = require('express-routes-versioning');

// Custom config files

let config = require('./config');

// Set up app

let app = express();

// This middleware parses the body of the incoming requests so they are accessible by the route handlers

let routesVersioning = Versioning();

//app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json());

// This middleware will attempt to extract the JWT from each request

//app.use(bearerToken());

// Base route to verify functionality

app.get('/', function(req, res) {
    res.send('All SET Carnet');
});

// Registration route

app.use('/user', routesVersioning({
    '1.0.0': userRoutes,
}));

// Go with Heroku's env port number or your own

app.listen(process.env.PORT || 8080);

module.exports = app; // Enable importing for unit tests
