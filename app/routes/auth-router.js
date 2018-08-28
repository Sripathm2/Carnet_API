let express = require('express');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let Cam2App = require('../models/cam2App');
let config = require('../../config');

// Instantiate router

let authRoutes = express.Router();

/**
 * @api {get} /auth/ Request Token
 * @apiName getToken
 * @apiGroup auth
 * @apiPermission none
 *
 * @apiParam (query) {String} clientID client id
 * @apiParam (query){String} clientSecret client secret
 * @apiParamExample {json} URL example
 *      /auth?clientID=<yourClientID>&clientSecret=<yourClientSecret>
 *
 * @apiSuccess {String} Token access token
 * @apiSuccessExample {json} Success Example
 *      HTTP/1.1 200 OK
 *      {
 *          'token': <newAccessToken>
 *      }
 *
 * @apiError (RequestFormatError) 422 Must include clientID and clientSecret.
 * @apiError (ResourceNotFoundError) 404 No app exists with given clientID.
 * @apiError (AuthenticationError) 401 Bad client secret.
 * @apiError (InternalError) 500 API Internal error.
 */

authRoutes.get('/', (req, res) => {

    if (req.query.clientID === undefined || req.query.clientSecret === undefined || req.query.clientID === '' || req.query.clientSecret === '') {
        return res.status(422).send({
            errorType: 'RequestFormatError',
            message: 'Must include clientID and clientSecret.',
        });
    }

    Cam2App.findOne({ clientID: req.query.clientID, }, (err, cam2app) => {
        if (err) {
            return res.send({
                errorType: 'InternalError',
                message: err,
            });
        }

        if (!cam2app) {
            return res.status(404).send({
                errorType: 'ResourceNotFoundError',
                message: 'No app exists with given clientID.',
            });
        }

        if (bcrypt.compareSync(req.query.clientSecret, cam2app.clientSecret)) {
            const payload = {
                clientID: cam2app.clientID,
                permissionLevel: cam2app.permissionLevel,
            };

            // Sign token with the permission level the user should have.
            // Tokens expire in 5 minutes.

            let token;
            switch (cam2app.permissionLevel) {
                case 'admin':
                case 'user': // fall-through user or admin permission to user signature.
                    token = jwt.sign(payload, config.userSecret, {
                        expiresIn: '5m',
                    });
                    break;
                case 'webUI':
                    token = jwt.sign(payload, config.webUISecret, {
                        expiresIn: '5m',
                    });
            }
            res.send({
                token: token,
            });
        } else {

            res.status(401).send({
                errorType: 'AuthenticationError',
                message: 'Bad client secret.',
            });
        }
    });
});

module.exports = authRoutes;
