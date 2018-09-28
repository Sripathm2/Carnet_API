let express = require('express');
let bcrypt = require('bcrypt');
const { Pool, } = require('pg');

const connectionString = process.env.DB_URL;
const Insert_User = 'INSERT INTO Users (userName, password, email , securityQuestion, securityAnswer, ' +
    'name, notebooks) VALUES ($1, $2, $3,$4, $5, $6, $7)';
const Select_User_Forget_Password = 'Select * From Users Where userName = $1';

// Instantiate router

let userRoutes = express.Router();

/**
 * test comment.
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
    user.password = req.body.password;
    user.email = req.body.email;
    user.securityQuestion = req.body.securityQuestion;
    user.securityAnswer = req.body.securityAnswer;
    user.name = req.body.name;
    user.notebooks = '';

    // Encrypt client secret with blowfish before saving to database

    user.password = bcrypt.hashSync(user.password, 10);

    const pool = new Pool({
        connectionString: connectionString,
    });

    pool.query(Insert_User, [user.userName, user.password, user.email, user.securityQuestion, user.securityAnswer, user.name, user.notebooks, ],  (err, response) => {

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

userRoutes.post('/forgetPassword', (req, res) => {

    if (!req.body.userName) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the userName.',
        });
    }

    let user = {};
    user.userName = req.body.userName;

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

        if(!response.rows[0].securityquestion){
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

module.exports = userRoutes;
