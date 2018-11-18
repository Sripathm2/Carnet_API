let chai = require('chai');
let index = require('../index');
let chaiHttp = require('chai-http');
let jwt = require('jsonwebtoken');
let should = chai.should();

chai.use(chaiHttp);

describe('user-router', function() {

    describe('/POST register', () => {

        let owner = {
            userName: 'TestUser1',
            password: 'TestPassword1@',
            email: 'test1@test.com',
            securityQuestion: 'hello hint',
            securityAnswer: 'hello',
            name: 'test test',
        };
        let incomplete_owner = {};

        it('it should succeed with correct fields ', done => {
            chai.request(index)
                .post('/user/register')
                .send(owner)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should fail with invalid email.', done => {
            owner.email = 'wrongEmail';
            chai.request(index)
                .post('/user/register')
                .send(owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Invalid email.');
                    done();
                });
        });

        it('it should fail with invalid password .', done => {
            owner.password = 'jkfwrong';
            chai.request(index)
                .post('/user/register')
                .send(owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Invalid password.');
                    done();
                });
        });

        it('it should fail with invalid username.', done => {
            owner.userName = 'jkfw';
            chai.request(index)
                .post('/user/register')
                .send(owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Invalid username.');
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .post('/user/register')
                .send(incomplete_owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the userName.');
                    done();
                });
        });

        it('it should fail with no password ', done => {
            incomplete_owner.userName = 'testUserName';
            chai.request(index)
                .post('/user/register')
                .send(incomplete_owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the password.');
                    done();
                });
        });

        it('it should fail with no email ', done => {
            incomplete_owner.password = 'testPassword';
            chai.request(index)
                .post('/user/register')
                .send(incomplete_owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the email.');
                    done();
                });
        });

        it('it should fail with no securityQuestion ', done => {
            incomplete_owner.email = 'testEmail';
            chai.request(index)
                .post('/user/register')
                .send(incomplete_owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the securityQuestion.');
                    done();
                });
        });

        it('it should fail with no securityAnswer ', done => {
            incomplete_owner.securityQuestion = 'testSecurityQuestion';
            chai.request(index)
                .post('/user/register')
                .send(incomplete_owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the securityAnswer.');
                    done();
                });
        });

        it('it should fail with no name ', done => {
            incomplete_owner.securityAnswer = 'testSecurityAnswer';
            chai.request(index)
                .post('/user/register')
                .send(incomplete_owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the name.');
                    done();
                });
        });

    });

    describe('/GET forgetPassword', () => {

        it('it should succeed with correct fields ', done => {
            chai.request(index)
                .get('/user/forgetPassword')
                .query({ userName: 'testUsername', })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql('Success');
                    res.body.securityQuestion.should.be.eql('what my name?');
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .get('/user/forgetPassword')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the userName.');
                    done();
                });
        });

        it('it should fail with incorrect user. ', done => {
            chai.request(index)
                .get('/user/forgetPassword')
                .query({ userName: 'NoUser', })
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('NoSuchUserError');
                    res.body.message.should.be.eql('Incorrect userName.');
                    done();
                });
        });

    });

    describe('/POST forgetPassword', () => {

        let owner = {
            userName: 'testUsername',
            password: 'TestPassword12',
            securityQuestion: 'what my name?',
            securityAnswer: 'test answer',
        };

        let incomplete_owner = {};

        it('it should succeed with correct fields ', done => {
            chai.request(index)
                .post('/user/forgetPassword')
                .send(owner)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql('Success');
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .post('/user/forgetPassword')
                .send(incomplete_owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the userName.');
                    done();
                });
        });

        it('it should fail with no password ', done => {
            incomplete_owner.userName = 'testUserName';
            chai.request(index)
                .post('/user/forgetPassword')
                .send(incomplete_owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the password.');
                    done();
                });
        });

        it('it should fail with no securityQuestion ', done => {
            incomplete_owner.password = 'testPassword';
            chai.request(index)
                .post('/user/forgetPassword')
                .send(incomplete_owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the securityQuestion.');
                    done();
                });
        });

        it('it should fail with no securityAnswer ', done => {
            incomplete_owner.securityQuestion = 'testSecurityQuestion';
            chai.request(index)
                .post('/user/forgetPassword')
                .send(incomplete_owner)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the securityAnswer.');
                    done();
                });
        });

    });

    describe('/GET getData', () => {

        it('it should succeed with correct fields ', done => {
            const payload = {
                userName: 'testUsername',
            };

            let token;
            token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .get('/user/getData')
                .query({ token: token, })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql('Success');
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .get('/user/getData')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the token.');
                    done();
                });
        });

    });

});