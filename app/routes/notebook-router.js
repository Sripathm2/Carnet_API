let express = require('express');
const { Pool, } = require('pg');
const uuidv4 = require('uuid/v4');
let jwt = require('jsonwebtoken');

const connectionString = process.env.DB_URL;
const Insert_notebook = 'INSERT INTO Notebook  (username, name, files, subscribedBy, likes, dislikes, uuid, comment, access) VALUES ($1, $2, $3,$4, $5, $6, $7, $8, $9)';
const Update_notebook_data = 'UPDATE Notebook SET files = $1, pdf = $4, pdftext = $5 WHERE uuid = $2 AND (username = $3 OR access LIKE \'%\' || $3 || \'%\') RETURNING name';
const Update_notebook_comment = 'UPDATE Notebook SET likes = $1::numeric, dislikes = $2::numeric, comment = $3 WHERE uuid = $4';
const Update_notebook_subscribed = 'UPDATE Notebook SET subscribedby = $1::text WHERE uuid = $2 ';
const Select_notebook_data = 'Select * from Notebook WHERE uuid = $1';
const Select_notebook_userName = 'Select username, name, uuid, likes, dislikes, comment from Notebook where username = $1 ';
const Select_notebook_name = 'Select username, name, uuid, likes, dislikes, comment from Notebook where name = $1 ';
const Select_notebook_id = 'Select * from Notebook where uuid = $1 ';
const Select_notebook = 'Select username, name, uuid, likes, dislikes, comment from Notebook';
const Select_user = 'Select * from Users where userName = $1';
const Update_user = 'UPDATE Users SET notification = $1::text WHERE username = $2 ';
const Update_notebook_name = 'UPDATE Notebook SET name = $1 WHERE uuid = $2 AND username = $3';
const Update_access = 'UPDATE Notebook SET access = access || $1 WHERE uuid = $2 AND username = $3';

// Instantiate router

let notebookRoutes = express.Router();

/**
 * @api {post} /notebook/createNotebook createNotebook
 * @apiName createNotebook
 * @apiGroup notebook
 *
 * @apiParam (query) {String} token token for user authentication and authorization.
 * @apiParam (query) {String} name of the notebook.
 *
 * @apiSuccess {String} Success.
 * @apiError (RequestFormatError) 422 For missing data or invalid values.
 * @apiError (Internal Error) 500+ Internal Error.
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

        pool.query(Insert_notebook, [decode.userName, req.query.name, '', '', 0, 0, uuidv4(), '', '', ], (err, response) => {

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

/**
 * @api {post} /notebook/updateNotebook updateNotebook
 * @apiName updateNotebook
 * @apiGroup notebook
 *
 * @apiParam (query) {String} token token for user authentication and authorization.
 * @apiParam (body) {String} notebookId of the user.
 * @apiParam (body) {String} data of the user.
 * @apiParam (body) {String} pdf of the user.
 * @apiParam (body) {String} pdftext of the user.
 *
 * @apiSuccess {String} Success.
 * @apiError (RequestFormatError) 422 For missing data or invalid values.
 * @apiError (Internal Error) 500+ Internal Error.
 */

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

    if (!req.body.pdf) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the pdf.',
        });
    }

    if (!req.body.pdftext) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include thepdftext.',
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

        pool.query(Update_notebook_data, [req.body.data, req.body.notebookId, decode.userName, req.body.pdf, req.body.pdftext, ],  (err, response) => {

            if(err){
                pool.end();
                return res.send({
                    errorType: 'InternalError',
                    message: err,
                });
            }

            updateAll(req.body.notebookId, response.rows[0].name);
            pool.end();
            return res.send({
                message: 'Success',
            });

        });

    });

});

/**
 * @api {get} /notebook/Notebook Notebook
 * @apiName Notebook
 * @apiGroup notebook
 *
 * @apiParam (query) {String} token token for user authentication and authorization.
 * @apiParam (query) {String} notebookId of the user.
 * @apiParam (query) {String} userAuth of the user.
 *
 * @apiSuccess {String} Notebook data.
 * @apiError (RequestFormatError) 422 For missing data or invalid values.
 * @apiError (Internal Error) 500+ Internal Error.
 */

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

        pool.query(Select_notebook_data, [req.query.notebookId, ],  (err, response) => {

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

            if(response.rows[0].name.indexOf('(private)')){
                if(response.rows[0].username !== decode.userName && (response.rows[0].acess === undefined || response.row[0].indexOf(decode.userName) === -1)){
                    return res.status(422).send({
                        errorType: 'NoSuchNotebookError',
                        message: 'Incorrect Notebook Id.',
                    });

                }
            }

            pool.end();

            return res.send({
                data: response.rows[0].files,
                pdf: response.rows[0].pdf,
                pdftext: response.rows[0].pdftext
            });
        });

    });

});

/**
 * @api {post} /notebook/subscribe subscribe
 * @apiName subscribe
 * @apiGroup notebook
 *
 * @apiParam (query) {String} token token for user authentication and authorization.
 * @apiParam (body) {String} notebookId of the user.
 *
 * @apiSuccess {String} Success.
 * @apiError (RequestFormatError) 422 For missing data or invalid values.
 * @apiError (Internal Error) 500+ Internal Error.
 */

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

        pool.query(Select_notebook_id, [req.body.notebookId, ],  (err, response) => {

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

            pool1.query(Update_notebook_subscribed, [subscribed, req.body.notebookId, ],  (err, response1) => {

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

/**
 * @api {get} /notebook/search_userName search_userName
 * @apiName search_userName
 * @apiGroup notebook
 *
 * @apiParam (query) {String} token token for user authentication and authorization.
 * @apiParam (query) {String} userName of the user to search for.
 *
 * @apiSuccess {String} list of notebooks for that user.
 * @apiError (RequestFormatError) 422 For missing data or invalid values.
 * @apiError (Internal Error) 500+ Internal Error.
 */

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

        pool.query(Select_notebook_userName, [req.query.userName, ],  (err, response) => {

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

            if(decode.userName === req.query.userName) {
                return res.send({
                    data: response.rows,
                });
            } else {
                let inputdata = response.rows;
                let outputdata = [];
                for(let j = 0 ; j < inputdata.length ; j++){
                    if(!inputdata[j].name.includes('(private)')){
                        outputdata.push(inputdata[j]);
                    }
                }
                return res.send({
                    data: outputdata,
                });
            }
        });

    });

});

/**
 * @api {get} /notebook/search_name search_name
 * @apiName search_name
 * @apiGroup notebook
 *
 * @apiParam (query) {String} token token for user authentication and authorization.
 * @apiParam (query) {String} name of the notebook to search for.
 *
 * @apiSuccess {String} list of notebooks for that name.
 * @apiError (RequestFormatError) 422 For missing data or invalid values.
 * @apiError (Internal Error) 500+ Internal Error.
 */

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

        pool.query(Select_notebook_name, [req.query.name, ],  (err, response) => {

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

            let inputdata = response.rows;
            let outputdata = [];
            for(let j = 0 ; j < inputdata.length ; j++){
                if(!inputdata[j].name.includes('(private)') || decode.userName === inputdata[j].username){
                    outputdata.push(inputdata[j]);
                }
            }
            return res.send({
                data: outputdata,
            });
        });

    });

});

/**
 * @api {get} /notebook/search search
 * @apiName search
 * @apiGroup notebook
 *
 * @apiParam (query) {String} token token for user authentication and authorization.
 *
 * @apiSuccess {String} list of notebooks.
 * @apiError (RequestFormatError) 422 For missing data or invalid values.
 * @apiError (Internal Error) 500+ Internal Error.
 */

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

/**
 * @api {post} /notebook/update update
 * @apiName update
 * @apiGroup notebook
 *
 * @apiParam (query) {String} token token for user authentication and authorization.
 * @apiParam (body) {String} notebookId of the user.
 * @apiParam (body) {String} likes of the user.
 * @apiParam (body) {String} dislikes of the user.
 * @apiParam (body) {String} comment of the user.
 *
 * @apiSuccess {String} Success.
 * @apiError (RequestFormatError) 422 For missing data or invalid values.
 * @apiError (Internal Error) 500+ Internal Error.
 */

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

        pool.query(Select_notebook_id, [req.body.notebookId, ],  (err, response) => {

            if(err){
                pool.end();
                return res.send({
                    errorType: 'InternalError',
                    message: err,
                });
            }

            pool.end();

            let data = {};
            data.like = parseInt(response.rows[0].likes) + parseInt(req.body.like);
            data.dislike = parseInt(response.rows[0].dislikes) + parseInt(req.body.dislike);

            if(req.body.comment.length > 2) {
                data.comment = response.rows[0].comment + '--' + decode.userName + ' : ' + req.body.comment;
            } else {
                data.comment = response.rows[0].comment;
            }

            const pool1 = new Pool({
                connectionString: connectionString,
            });

            pool1.query(Update_notebook_comment, [data.like, data.dislike, data.comment, req.body.notebookId, ],  (err, response) => {
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

    pool.query(Select_notebook_id, [notebookID, ],  (err, response) => {

        if(err){
            pool.end();
            return res.send({
                errorType: 'InternalError',
                message: err,
            });
        }

        let arr = response.rows[0].subscribedby.split('--');

        for(let i = 0;i < arr.length; i++) {

            if(arr[i].length < 4){
                continue;
            }
            const pool1 = new Pool({
                connectionString: connectionString,
            });

            pool1.query(Select_user, [arr[i], ], (err1, response1) => {

                const pool2 = new Pool({
                    connectionString: connectionString,
                });
                if(!response1){
                    pool1.end();
                }
                if(!response1.rows[0]){
                    pool1.end();
                }

                let data = '';

                if(!response1.rows[0].notification){
                    data = response1.rows[0].notification +  '--:--' + notebookName + 'is updated';
                } else {
                    data = notebookName + 'is updated';
                }

                pool2.query(Update_user, [data, arr[i], ], (err2, response2) => {
                    pool2.end();
                });

                pool1.end();

            });
        }
        pool.end();

    });

}

/**
 * @api {post} /notebook/updateNameNotebook updateNameNotebook
 * @apiName updateNameNotebook
 * @apiGroup notebook
 *
 * @apiParam (query) {String} token token for user authentication and authorization.
 * @apiParam (body) {String} notebookId of the user.
 * @apiParam (body) {String} name of the notebook.
 *
 * @apiSuccess {String} Success.
 * @apiError (RequestFormatError) 422 For missing data or invalid values.
 * @apiError (Internal Error) 500+ Internal Error.
 */

notebookRoutes.post('/updateNameNotebook', (req, res) => {
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
    if (!req.body.name) {
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
        pool.query(Update_notebook_name, [req.body.name, req.body.notebookId, decode.userName, ],  (err, response) => {
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

notebookRoutes.post('/accessNotebook', (req, res) => {
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
    if (!req.body.name) {
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
        console.log('sijdjbi----------------------');
        pool.query(Update_access, [req.body.name, req.body.notebookId, decode.userName, ],  (err, response) => {
            if(err){
                pool.end();
                return res.send({
                    errorType: 'InternalError',
                    message: err,
                });
            }
            console.log(response);
            pool.end();
            return res.send({
                message: 'Success',
            });
        });
    });
});
