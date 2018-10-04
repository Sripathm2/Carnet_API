let express = require('express');
const { Pool, } = require('pg');
let jwt = require('jsonwebtoken');

const connectionString = process.env.DB_URL;
const Select_User = 'Select * From Users Where userName = $1';

// Instantiate router

let notebookRoutes = express.Router();

/**
 * test comment.
 */

notebookRoutes.post('/createNotebook', (req, res) => {

    if (!req.query.token) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the token.',
        });
    }

    jwt.verify(req.query.token, process.env.secret, function(err, decode) {
        if(err){
            return res.send({
                errorType: 'InvalidTokenError',
                message: 'invalid or expired token.',
            });
        }

        const pool = new Pool({
            connectionString: connectionString,
        });

        pool.query(Select_User, [decode.userName, ],  (err, response) => {

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

            pool.end();
            return res.send({
                message: 'Success',
                email: response.rows[0].email,
                name: response.rows[0].name,
                notebooks: response.rows[0].notebooks,
            });
        });

    });

});

module.exports = notebookRoutes;
