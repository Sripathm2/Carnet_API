let express = require('express');
let bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'CarnetUser',
    host: 'localhost',
    database: 'Carnet',
    password: 'CarnetPassword',
    port: 5432,
});


// Instantiate router

let userRoutes = express.Router();


/**
 *
 */
userRoutes.post('/register', (req, res) => {
    let user = {};
    user.clientID = req.body.userName;
    user.clientSecret = req.body.userPassword;

    // Encrypt client secret with blowfish before saving to database

    user.clientSecret = bcrypt.hashSync(user.clientSecret, 10);

    pool.query('INSERT INTO Users (index, key, value) VALUES ($1, $2)',
        [user.clientID, user.clientSecret], (err, response) => {

        if(err){
            return res.send({
                errorType: 'InternalError',
                message: err,
            });
        }

        return res.send({
            message: 'Success',
        })
    })
});

module.exports = userRoutes;
