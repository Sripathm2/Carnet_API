let chai = require('chai');
let index = require('../index');
let chaiHttp = require('chai-http');
let should = chai.should();
const { Pool, } = require('pg');

const connectionString = process.env.DB_URL;
const Select_User = 'Select * from Users where userName = \'TestUser1\'';

chai.use(chaiHttp);

describe('user-router', function() {

    describe('/POST register', () => {

        let owner = {
            userName: 'TestUser1',
            password: 'TestPassword1',
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

                    const pool = new Pool({
                        connectionString: connectionString,
                    });

                    pool.query(Select_User,  (err, response) => {
                        //owner.userName.should.be.eql(response.rows[0].username);
                        //owner.email.should.be.eql(response.rows[0].email);
                        //owner.securityQuestion.should.be.eql(response.rows[0].securityquestion);
                        //owner.securityAnswer.should.be.eql(response.rows[0].securityanswer);
                        pool.end();
                        done();
                    });

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

});