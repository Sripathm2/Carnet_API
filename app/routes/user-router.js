let express = require('express');
let bcrypt = require('bcrypt');
const { Pool, } = require('pg');

const connectionString = process.env.DB_URL;
const Insert_User = 'INSERT INTO Users (userName, password, email , securityQuestion, securityAnswer, ' +
    'name, notebooks) VALUES ($1, $2, $3,$4, $5, $6, $7)';

// Instantiate router

let userRoutes = express.Router();

/**
 *
 * test comment.
 */
userRoutes.post('/register', (req, res) => {
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

    pool.query(Insert_User, [user.userName, user.password, user.email, user.securityQuestion, user.securityAnswer, user.name, user.notebooks,],  (err, response) => {

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

module.exports = userRoutes;
