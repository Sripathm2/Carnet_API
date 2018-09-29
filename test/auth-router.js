let chai = require('chai');
let index = require('../index');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('auth-router', function() {

    describe('/GET token', () => {

        it('it should succeed with correct fields ', done => {
            chai.request(index)
                .get('/auth/token')
                .query({ userName: 'TestUser1', password: 'TestPassword1', })
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.message.should.be.eql('Success');
                    res.body.securityQuestion.should.be.eql('hello hint');
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .get('/auth/token')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the userName.');
                    done();
                });
        });

        it('it should fail with no password. ', done => {
            chai.request(index)
                .get('/auth/token')
                .query({ userName: 'NoUser', })
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the password.');
                    done();
                });
        });

    });

});