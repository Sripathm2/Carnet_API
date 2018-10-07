let express = require('express');
const { Pool, } = require('pg');
const uuidv4 = require('uuid/v4');
let jwt = require('jsonwebtoken');

const connectionString = process.env.DB_URL;
const Insert_notebook = 'INSERT INTO Notebook  (userName, name, files, subscribedBy, likes, dislikes, uuid, comment) VALUES ($1, $2, $3,$4, $5, $6, $7, $8)';
const Update_notebook_data = 'UPDATE Notebook SET files = $1 WHERE uuid = $2 AND userName = $3';
const Update_notebook_subscribed = 'UPDATE Notebook SET subscribedby = $1::text WHERE uuid = $2 ';
const Select_notebook_data = 'Select * from Notebook WHERE uuid = $1 AND userName = $2';
const Select_notebook_userName = 'Select userName, name, uuid, likes, dislikes, comment from Notebook where userName = $1 ';
const Select_notebook_name = 'Select userName, name, uuid, likes, dislikes, comment from Notebook where name = $1 ';
const Select_notebook_id = 'Select userName, name, uuid, likes, dislikes, comment from Notebook where uuid = $1 ';
const Select_notebook = 'Select userName, name, uuid, likes, dislikes, comment from Notebook';
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

    if (!req.query.name) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the name of the notebook.',
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

        pool.query(Insert_notebook, [decode.userName, req.query.name, "", "", 0, 0, uuidv4(), "" ],  (err, response) => {

            if(err){
                pool.end();
                return res.send({
                    errorType: 'InternalError',
                    message: err,
                });
            }

            pool.end();

            return res.send({
                message: 'Success',
            });
        });

    });

});

notebookRoutes.post('/updateNotebook', (req, res) => {

    if (!req.query.token) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the token.',
        });
    }

    if (!req.body.notebookId) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the id of the notebook.',
        });
    }

    if (!req.body.data) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the data.',
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

        pool.query(Update_notebook_data, [req.body.data, req.body.notebookId, decode.userName],  (err, response) => {

            if(err){
                pool.end();
                return res.send({
                    errorType: 'InternalError',
                    message: err,
                });
            }

            pool.end();

            return res.send({
                message: 'Success',
            });
        });

    });

});

notebookRoutes.get('/Notebook', (req, res) => {

    if (!req.query.token) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the token.',
        });
    }

    if (!req.query.notebookId) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the id of the notebook.',
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

        pool.query(Select_notebook_data, [req.query.notebookId, decode.userName],  (err, response) => {

            if(err){
                pool.end();
                return res.send({
                    errorType: 'InternalError',
                    message: err,
                });
            }

            if(!response.rows[0]){
                return res.status(422).send({
                    errorType: 'NoSuchNotebookError',
                    message: 'Incorrect Notebook Id.',
                });
            }

            pool.end();

            return res.send({
                data: response.rows[0].files,
            });
        });

    });

});

notebookRoutes.post('/subscribe', (req, res) => {

    if (!req.query.token) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the token.',
        });
    }

    if (!req.body.notebookId) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the id of the notebook.',
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

        pool.query(Select_notebook_id, [ req.body.notebookId],  (err, response) => {

            if(err){
                pool.end();
                return res.send({
                    errorType: 'InternalError',
                    message: err,
                });
            }

            let subscribed = response.rows[0].subscribedby + '--' + decode.userName;

            pool.end();


            const pool1 = new Pool({
                connectionString: connectionString,
            });

            pool1.query(Update_notebook_subscribed, [subscribed, req.body.notebookId,],  (err, response1) => {

                if(err){
                    pool1.end();
                    return res.send({
                        errorType: 'InternalError',
                        message: err,
                    });
                }

                pool1.end();

                return res.send({
                    message: 'Success',
                });
            });

        });

    });

});

notebookRoutes.get('/search_userName', (req, res) => {

    if (!req.query.token) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the token.',
        });
    }

    if (!req.query.userName) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the userName.',
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

        pool.query(Select_notebook_userName, [req.query.userName,],  (err, response) => {

            if(err){
                pool.end();
                return res.send({
                    errorType: 'InternalError',
                    message: err,
                });
            }

            if(!response.rows[0]){
                return res.status(422).send({
                    errorType: 'NoSuchNotebookError',
                    message: 'Incorrect Notebook Id.',
                });
            }

            pool.end();

            return res.send({
                data: response.rows,
            });
        });

    });

});

notebookRoutes.get('/search_name', (req, res) => {

    if (!req.query.token) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the token.',
        });
    }

    if (!req.query.name) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the name.',
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

        pool.query(Select_notebook_name, [req.query.name,],  (err, response) => {

            if(err){
                pool.end();
                return res.send({
                    errorType: 'InternalError',
                    message: err,
                });
            }

            if(!response.rows[0]){
                return res.status(422).send({
                    errorType: 'NoSuchNotebookError',
                    message: 'Incorrect Notebook name.',
                });
            }

            pool.end();

            return res.send({
                data: response.rows,
            });
        });

    });

});

notebookRoutes.get('/search', (req, res) => {

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

        pool.query(Select_notebook,  (err, response) => {

            if(err){
                pool.end();
                return res.send({
                    errorType: 'InternalError',
                    message: err,
                });
            }

            if(!response.rows[0]){
                return res.status(422).send({
                    errorType: 'NoSuchNotebookError',
                    message: 'Incorrect Notebook name.',
                });
            }

            pool.end();

            return res.send({
                data: response.rows,
            });
        });

    });

});

module.exports = notebookRoutes;
