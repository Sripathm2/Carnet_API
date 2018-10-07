let chai = require('chai');
let index = require('../index');
let chaiHttp = require('chai-http');
let jwt = require('jsonwebtoken');
let should = chai.should();

chai.use(chaiHttp);

describe('notebook-router', function() {

    describe('/POST createNotebook', () => {

        it('it should succeed with correct fields ', done => {
            const payload = {
                userName: 'TestUser1',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .post('/notebook/createNotebook')
                .query({name:'notebook name', token: token})
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .post('/notebook/createNotebook')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the token.');
                    done();
                });
        });

        it('it should fail with no name ', done => {
            chai.request(index)
                .post('/notebook/createNotebook')
                .query({token: 'sdafswdd'})
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the name of the notebook.');
                    done();
                });
        });

    });

});