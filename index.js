let express = require('express');
let bearerToken = require('express-bearer-token');
let bodyParser = require('body-parser');
let bluebird = require('bluebird');

// Routers

let authRoutes = require('./app/routes/auth-router');

// Custom config files

let config = require('./config');

// Set up app

let app = express();

// Go with Heroku's env port number or your own

app.listen(process.env.PORT || 8080);

module.exports = app; // Enable importing for unit tests
