let chai = require('chai');
let index = require('../index');
let chaiHttp = require('chai-http');
let jwt = require('jsonwebtoken');
let should = chai.should();

chai.use(chaiHttp);

describe('final testing', function() {

    describe('Final  check', () => {
        it('it should succeed with correct fields in notebooks ', done => {
            const payload = {
                userName: 'testUsername',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .get('/notebook/search')
                .query({ token: token, })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.length.should.be.eql(4);
                    res.body.data[0].username.should.be.eql('testUsername1');
                    res.body.data[0].name.should.be.eql('testNotebook1');
                    res.body.data[0].uuid.should.be.eql('689c0462-ca35-11e8-a8d5-32801f1b9fd1');
                    res.body.data[0].likes.should.be.eql('0');
                    res.body.data[0].dislikes.should.be.eql('0');
                    res.body.data[0].comment.should.be.eql(' ');
                    res.body.data[1].username.should.be.eql('TestUser1');
                    res.body.data[1].name.should.be.eql('notebook name');
                    res.body.data[1].likes.should.be.eql('0');
                    res.body.data[1].dislikes.should.be.eql('0');
                    res.body.data[1].comment.should.be.eql('');
                    res.body.data[2].username.should.be.eql('TestUser12');
                    res.body.data[2].name.should.be.eql('(private)notebookabc');
                    res.body.data[2].likes.should.be.eql('0');
                    res.body.data[2].dislikes.should.be.eql('0');
                    res.body.data[2].comment.should.be.eql('');
                    res.body.data[3].username.should.be.eql('testUsername');
                    res.body.data[3].name.should.be.eql('newName');
                    res.body.data[3].likes.should.be.eql('10');
                    res.body.data[3].dislikes.should.be.eql('11');
                    res.body.data[3].comment.should.be.eql(' --testUsername : test comment');
                    done();
                });
        });

        it('it should succeed with correct field in users', done => {
            const payload = {
                userName: 'testUsername',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .get('/user/getData')
                .query({ token: token, })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

    });
});