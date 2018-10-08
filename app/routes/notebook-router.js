let express = require('express');
const { Pool, } = require('pg');
const uuidv4 = require('uuid/v4');
let jwt = require('jsonwebtoken');

const connectionString = process.env.DB_URL;
const Insert_notebook = 'INSERT INTO Notebook  (userName, name, files, subscribedBy, likes, dislikes, uuid, comment) VALUES ($1, $2, $3,$4, $5, $6, $7, $8)';
const Update_notebook_data = 'UPDATE Notebook SET files = $1 WHERE uuid = $2 AND userName = $3';
const Update_notebook_comment = 'UPDATE Notebook SET likes = $1::numeric, dislikes = $2::numeric, comment = $3 WHERE uuid = $4 AND userName = $5';
const Update_notebook_subscribed = 'UPDATE Notebook SET subscribedby = $1::text WHERE uuid = $2 ';
const Select_notebook_data = 'Select * from Notebook WHERE uuid = $1 AND userName = $2';
const Select_notebook_userName = 'Select userName, name, uuid, likes, dislikes, comment from Notebook where userName = $1 ';
const Select_notebook_name = 'Select userName, name, uuid, likes, dislikes, comment from Notebook where name = $1 ';
const Select_notebook_id = 'Select * from Notebook where uuid = $1 ';
const Select_notebook = 'Select userName, name, uuid, likes, dislikes, comment from Notebook';
const Select_user = 'Select * from Users where userName = $1';
const Update_user = 'UPDATE Users SET notification = $1::text WHERE userName = $2 ';
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

            updateAll(req.body.notebookId);

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

notebookRoutes.post('/update', (req, res) => {

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

    if (!req.body.like) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the like.',
        });
    }

    if (!req.body.dislike) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the dislike.',
        });
    }

    if (!req.body.comment) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the comment.',
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

        pool.query(Select_notebook_id, [req.body.notebookId],  (err, response) => {

            if(err){
                pool.end();
                return res.send({
                    errorType: 'InternalError',
                    message: err,
                });
            }

            pool.end();

            let data = {};
            data.like = response.rows[0].likes + parseInt(req.body.like);
            data.dislike = response.rows[0].dislikes + parseInt(req.body.dislike);
            data.comment = response.rows[0].comment + '--' + decode.userName + ' : ' + req.body.comment;

            const pool1 = new Pool({
                connectionString: connectionString,
            });

            pool1.query(Update_notebook_comment, [data.like, data.dislike, data.comment, req.body.notebookId, decode.userName],  (err, response) => {
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

module.exports = notebookRoutes;

function updateAll(notebookID, notebookName){
    const pool = new Pool({
        connectionString: connectionString,
    });

    pool.query(Select_notebook_id, [notebookID],  (err, response) => {

        if(err){
            pool.end();
            return res.send({
                errorType: 'InternalError',
                message: err,
            });
        }

        let arr = response.rows[0].subscribedby.split("--");

        pool.end();

        for(let i=0;i<arr.length;i++) {
            const pool1 = new Pool({
                connectionString: connectionString,
            });

            pool1.query(Select_user, [arr[i],], (err, response1) => {

                const pool2 = new Pool({
                    connectionString: connectionString,
                });

                if(!response1.rows[0]){
                    return;
                }
                let data = response1.rows[0].notification +  '--' + notebookName;

                pool2.query(Update_user, [arr[i], data], (err, response2) => {pool2.end();});
                pool1.end();

            });
        }

    });

}