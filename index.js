let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');

// Routers

let userRoutes = require('./app/routes/user-router');
let authRoutes = require('./app/routes/auth-router');
let feedbackRoutes = require('./app/routes/feedback-router');
let notebookRoutes = require('./app/routes/notebook-router');
let Versioning = require('express-routes-versioning');

// Set up app

let app = express();
app.use(cors());

// This middleware parses the body of the incoming requests so they are accessible by the route handlers

let routesVersioning = Versioning();

//app.use(bodyParser.urlencoded({ extended: true, }));

app.use(bodyParser.json());

// This middleware will attempt to extract the JWT from each request

// Base route to verify functionality

app.get('/', function(req, res) {
    res.send('All SET Carnet');
});

// Registration route

app.use('/user', routesVersioning({
    '1.0.0': userRoutes,
}));

app.use('/auth', routesVersioning({
    '1.0.0': authRoutes,
}));

app.use('/feedback', routesVersioning({
    '1.0.0': feedbackRoutes,
}));

app.use('/notebook', routesVersioning({
    '1.0.0': notebookRoutes,
}));

// Go with Heroku's env port number or your own

app.listen(process.env.PORT || 8080);

module.exports = app; // Enable importing for unit tests
