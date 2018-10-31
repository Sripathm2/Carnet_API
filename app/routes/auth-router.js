let express = require('express');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
const { Pool, } = require('pg');

const connectionString = process.env.DB_URL;
const Select_User = 'Select * From Users Where userName = $1';

// Instantiate router

let authRoutes = express.Router();

/**
 * @api {get} /token token
 * @apiName auth
 * @apiGroup auth
 *
 * @apiQuery (body) {String} userName of the user.
 *                  {String} password of the user.
 *
 * @apiSuccess {String} token for the user.
 * @apiError (RequestFormatError) 422 For missing data or invalid password or userName.
 * @apiError (Internal Error) 500+ Internal Error.
 */

authRoutes.get('/token', (req, res) => {

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

        bcrypt.compare(user.password, response.rows[0].password, function(err, res1) {
            if(res1 === true){
                const payload = {
                    userName: user.userName,
                };

                let token;
                token = jwt.sign(payload, process.env.secret, {
                    expiresIn: '10h',
                });
                res.send({
                    token: token,
                });
            } else {
                res.status(401).send({
                    errorType: 'AuthenticationError',
                    message: 'Bad user password.',
                });
            }
        });
        pool.end();
    });
});

module.exports = authRoutes;
