let express = require('express');
const { Pool, } = require('pg');
const connectionString = process.env.DB_URL;
const Insert_feedback = 'INSERT INTO Feedback (feedbackText) VALUES ($1)';

// Instantiate router

let feedbackRoutes = express.Router();

/**
 * @api {post} /feedback
 * @apiName feedback
 * @apiGroup feedback
 *
 * @apiParam (body) {String} feedbackText of the user.
 *
 * @apiParamExample {JSON} Request Body Example
 *      {
            feedbackText: 'TestUser1feedback'

 * @apiSuccess {String} Success.
 * @apiError (RequestFormatError) 422 For missing data or invalid email, password or userName.
 * @apiError (Internal Error) 500+ Internal Error.
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
