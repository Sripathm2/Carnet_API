let express = require('express');
let bcrypt = require('bcrypt');
const { Pool, } = require('pg');
let jwt = require('jsonwebtoken');
let validator = require('email-validator');
let passwordValidator = require('password-validator');

//The SQL statements used.

const connectionString = process.env.DB_URL;
const Insert_User = 'INSERT INTO Users (username, password, email , securityquestion, securityanswer, ' +
    'name, notebooks, notification) VALUES ($1, $2, $3,$4, $5, $6, $7, $8)';
const Select_User_Forget_Password = 'Select * From Users Where username = $1';
const Update_User_Forget_Password = 'Update Users Set password = $2 Where username = $1';
const Select_User = 'Select * From Users Where username = $1';

// Instantiate router

let userRoutes = express.Router();

/**
 * @api {post} /user/register Register
 * @apiName userRegister
 * @apiGroup user
 *
 * @apiParam (body) {String} userName of the user.
 * @apiParam (body) {String} password of the user.
 * @apiParam (body) {String} email of the user.
 * @apiParam (body) {String} securityQuestion of the user.
 * @apiParam (body) {String} securityAnswer of the user.
 * @apiParam (body) {String} name of the user.
 *
 * @apiParamExample {JSON} Request Body Example
 *      {
            userName: 'TestUser1',
            password: 'TestPassword1@',
            email: 'test1@test.com',
            securityQuestion: 'hello hint',
            securityAnswer: 'hello',
            name: 'test test',
        }

 * @apiSuccess {String} Success.
 * @apiError (RequestFormatError) 422 For missing data or invalid email, password or userName.
 * @apiError (Internal Error) 500+ Internal Error.
 */

userRoutes.post('/register', (req, res) => {

    if (!req.body.userName) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the userName.',
        });
    }
    if (!req.body.password) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the password.',
        });
    }
    if (!req.body.email) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the email.',
        });
    }
    if (!req.body.securityQuestion) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the securityQuestion.',
        });
    }
    if (!req.body.securityAnswer) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the securityAnswer.',
        });
    }
    if (!req.body.name) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the name.',
        });
    }

    let user = {};
    user.userName = req.body.userName;
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.email = req.body.email;
    user.securityQuestion = req.body.securityQuestion;
    user.securityAnswer = req.body.securityAnswer.toLowerCase();
    user.name = req.body.name;
    user.notebooks = '';

    if(user.userName.indexOf(' ') !== -1 || user.userName.length < 6 || user.userName.length > 32){
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Invalid username.',
        });
    }

    let schema = new passwordValidator();

    schema
        .is().min(8)
        .is().max(100)
        .has().uppercase()
        .has().lowercase()
        .has().digits()
        .has().symbols()
        .has().not().spaces();

    if(!schema.validate(req.body.password)){
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Invalid password.',
        });
    }

    if(!validator.validate(user.email)){
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Invalid email.',
        });
    }

    const pool = new Pool({
        connectionString: connectionString,
    });

    pool.query(Insert_User, [user.userName, user.password, user.email, user.securityQuestion, user.securityAnswer, user.name, ' ', ' ' ],  (err, response) => {

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

/**
 * @api {get} /user/forgetPassword forgetPassword
 * @apiName forgetPassword
 * @apiGroup user
 *
 * @apiQuery (query) {String} userName of the user.
 *
 * @apiSuccess {String} securityQuestion for that user.
 * @apiError (RequestFormatError) 422 For missing data or invalid email, password or userName.
 * @apiError (Internal Error) 500+ Internal Error.
 */

userRoutes.get('/forgetPassword', (req, res) => {

    if (!req.query.userName) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the userName.',
        });
    }

    let user = {};
    user.userName = req.query.userName;

    const pool = new Pool({
        connectionString: connectionString,
    });

    pool.query(Select_User_Forget_Password, [user.userName, ],  (err, response) => {

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
            securityQuestion: response.rows[0].securityquestion,
        });
    });
});

/**
 * @api {post} /user/forgetPassword forgetPassword
 * @apiName forgetPassword
 * @apiGroup user
 *
 * @apiParam (body) {String} userName of the user.
 * @apiParam (body) {String} password of the user.
 * @apiParam (body) {String} securityQuestion of the user.
 * @apiParam (body) {String} securityAnswer of the user.
 * @apiParam (body) {String} name of the user.
 *
 * @apiParamExample {JSON} Request Body Example
 *      {
            userName: 'TestUser1',
            password: 'TestPassword1@',
            email: 'test1@test.com',
            securityQuestion: 'hello hint',
            securityAnswer: 'hello',
            name: 'test test',
        }

 * @apiSuccess {String} Success.
 * @apiError (RequestFormatError) 422 For missing data or invalid password.
 * @apiError (Internal Error) 500+ Internal Error.
 */

userRoutes.post('/forgetPassword', (req, res) => {

    if (!req.body.userName) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the userName.',
        });
    }

    if (!req.body.password) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the password.',
        });
    }

    if (!req.body.securityQuestion) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the securityQuestion.',
        });
    }

    if (!req.body.securityAnswer) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the securityAnswer.',
        });
    }

    let user = {};
    user.userName = req.body.userName;
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.securityQuestion = req.body.securityQuestion;
    user.securityAnswer = req.body.securityAnswer.toLowerCase();

    const pool = new Pool({
        connectionString: connectionString,
    });

    pool.query(Select_User_Forget_Password, [user.userName, ],  (err, response) => {

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
                message: 'Incorrect userName1.',
            });
        }

        if(response.rows[0].securityquestion !== user.securityQuestion){
            return res.status(422).send({
                errorType: 'IncorrectQuestionError',
                message: 'Incorrect Security Question.',
            });
        }

        if(response.rows[0].securityanswer !== user.securityAnswer){
            return res.status(422).send({
                errorType: 'IncorrectAnswerError',
                message: 'Incorrect Security Answer.',
            });
        }

        const pool1 = new Pool({
            connectionString: connectionString,
        });

        pool1.query(Update_User_Forget_Password, [user.userName, user.password, ],  (err1, response1) => {

            pool.end();
            pool1.end();

            if(err1){
                pool.end();
                return res.send({
                    errorType: 'InternalError',
                    message: err1,
                });
            }

            return res.send({
                message: 'Success',
            });
        });
    });
});

/**
 * @api {get} /user/getData getData
 * @apiName getData
 * @apiGroup user
 *
 * @apiQuery (query) {String} token of the user login.
 *
 * @apiSuccess {String} data about the user.
 * @apiError (RequestFormatError) 422 For missing data.
 * @apiError (Internal Error) 500+ Internal Error.
 */

userRoutes.get('/getData', (req, res) => {

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
                username: decode.userName,
                email: response.rows[0].email,
                name: response.rows[0].name,
                notification: response.rows[0].notification,
            });
        });

    });

});

module.exports = userRoutes;
