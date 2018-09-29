let express = require('express');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
const { Pool, } = require('pg');


const connectionString = process.env.DB_URL;
const Select_User= 'Select * From Users Where userName = $1';

// Instantiate router

let userRoutes = express.Router();

/**
 * test comment.
 */

userRoutes.get('/token', (req, res) => {

    if (!req.query.userName) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the userName.',
        });
    }

    if (!req.query.password) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the password.',
        });
    }

    let user = {};
    user.userName = req.query.userName;
    user.password = req.query.password;


    const pool = new Pool({
        connectionString: connectionString,
    });

    pool.query(Select_User, [user.userName, ],  (err, response) => {

        if(err){
            pool.end();
            return res.send({
                errorType: 'InternalError',
                message: err,
            });
        }

        if(!response.rows[0]){
            return res.status(422).send({
                errorType: 'NoSuchUserError',
                message: 'Incorrect userName.',
            });
        }

        console.log(user.password);
        console.log(response.rows[0].name);

        if(bcrypt.compareSync(user.password, response.rows[0].password)){
            const payload = {
                userName: user.userName,
            };

            // Tokens expire in 5 minutes.

            let token;
            token = jwt.sign(payload, config.userSecret, {
                expiresIn: '10h',
            });
            res.send({
                token: token,
            });
        }
        else {

            res.status(401).send({
                errorType: 'AuthenticationError',
                message: 'Bad client secret.',
            });
        }

        pool.end();
    });
});

module.exports = userRoutes;
