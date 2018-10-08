let express = require('express');
const { Pool, } = require('pg');
const connectionString = process.env.DB_URL;
const Insert_feedback = 'INSERT INTO Feedback (feedbackText) VALUES ($1)';

// Instantiate router

let feedbackRoutes = express.Router();

/**
 * test comment.
 */

feedbackRoutes.post('/', (req, res) => {

    if (!req.body.feedbackText) {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include the feedbackText.',
        });
    }

    let feedback = {};
    feedback.text = req.body.feedbackText;

    const pool = new Pool({
        connectionString: connectionString,
    });

    pool.query(Insert_feedback, [feedback.text, ],  (err, response) => {

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

module.exports = feedbackRoutes;
