let chai = require('chai');
let index = require('../index');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('feedback-router', function() {

    describe('/POST ', () => {

        it('it should succeed with correct fields ', done => {

            let feedback = {
                feedbackText: 'Test feedback',
            };

            chai.request(index)
                .post('/feedback')
                .send(feedback)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .post('/feedback')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the feedbackText.');
                    done();
                });
        });

    });

});