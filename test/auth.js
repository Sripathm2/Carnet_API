let mongoose = require('mongoose');
let chai = require('chai');
let index = require('../index');
let chaiHttp = require('chai-http');
let Cam2App = require('../app/models/cam2App');
let bcrypt = require('bcrypt');
let should = chai.should();

chai.use(chaiHttp);

describe('Auth', () => {

    before(done => {

        // Make sure all test apps are removed

        Cam2App.remove({}, err => {});

        // Create app with webUI credentials

        let webUIApp = new Cam2App();
        webUIApp.clientID = '1';
        webUIApp.clientSecret = bcrypt.hashSync('1', 10);
        webUIApp.permissionLevel = 'webUI';
        webUIApp.owner = 'webUI';

        // Create some apps with user credentials

        let userApp = new Cam2App();
        userApp.clientID = '2';
        userApp.clientSecret = bcrypt.hashSync('2', 10);
        userApp.permissionLevel = 'user';
        userApp.owner = 'testowner';

        webUIApp.save(err => {
            userApp.save(err => {
                done();
            });
        });
    });

    // Remove all users after tests are completed

    after(done => {

        // Remove all test users

        Cam2App.remove({}, err => {
            done();
        });
    });

    describe('/GET auth', () => {

        it('it should fail without clientID and secret', done => {
            chai.request(index)
                .get('/auth')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include clientID and clientSecret.');
                    done();
                });
        });

        it('it should fail without clientID', done => {
            const payload = {
                clientID: '1',
            };

            chai.request(index)
                .get('/auth')
                .query(payload)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include clientID and clientSecret.');
                    done();
                });
        });

        it('it should fail without clientSecret', done => {
            const payload = {
                clientSecret: '1',
            };

            chai.request(index)
                .get('/auth')
                .query(payload)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include clientID and clientSecret.');
                    done();
                });
        });

        it('it should fail with invalid clientID', done => {
            const payload = {
                clientID: '',
                clientSecret: '1',
            };

            chai.request(index)
                .get('/auth')
                .query(payload)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include clientID and clientSecret.');
                    done();
                });
        });

        it('it should fail with unused clientID', done => {
            const payload = {
                clientID: 'invalid',
                clientSecret: 'invalid',
            };

            chai.request(index)
                .get('/auth')
                .query(payload)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.errorType.should.be.eql('ResourceNotFoundError');
                    res.body.message.should.be.eql('No app exists with given clientID.');
                    done();
                });
        });

        it('it should fail with incorrect clientSecret', done => {
            const payload = {
                clientID: '1',
                clientSecret: 'invalid',
            };

            chai.request(index)
                .get('/auth')
                .query(payload)
                .end((err, res) => {
                    res.status.should.be.eql(401);
                    res.body.errorType.should.be.eql('AuthenticationError');
                    res.body.message.should.be.eql('Bad client secret.');
                    done();
                });
        });

        it('it should succeed with correct clientSecret and ID', done => {
            const payload = {
                clientID: '1',
                clientSecret: '1',
            };

            chai.request(index)
                .get('/auth')
                .query(payload)
                .end((err, res) => {
                    res.status.should.be.eql(200);
                    res.body.token.should.exist;
                    done();
                });
        });
    });

});