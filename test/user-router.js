let chai = require('chai');
let index = require('../index');
let chaiHttp = require('chai-http');
let should = chai.should();

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

        it('it should succeed with correct fields ', done => {
            chai.request(index)
                .post('/user/register')
                .send(owner)
                .end((err, res) => {
                    res.should.have.status(200);
                    console.log(res.body);
                    done();
                });
        });

    });

});