let chai = require('chai');
let index = require('../index');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('index', function() {

    describe('/GET /', () => {

        it('It should succeed with a successful message.', done => {
            chai.request(index)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.be.eql('All SET Carnet');
                    done();
                });
        });
    });

});