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

    describe('/POST updateNotebook', () => {

        it('it should succeed with correct fields ', done => {
            let data = {};
            data.notebookId = '689c0462-ca35-11e8-a8d5-f2801f1b9fd1';
            data.data = 'data';

            const payload = {
                userName: 'testUsername',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .post('/notebook/updateNotebook')
                .query({token: token})
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .post('/notebook/updateNotebook')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the token.');
                    done();
                });
        });

        it('it should fail with no Id and data ', done => {
            chai.request(index)
                .post('/notebook/updateNotebook')
                .query({token: 'sdafswdd'})
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the id of the notebook.');
                    done();
                });
        });

        it('it should fail with no data ', done => {
            let incompletedata = {};
            incompletedata.notebookId = 'nhsdocnh';
            chai.request(index)
                .post('/notebook/updateNotebook')
                .query({token: 'sdafswdd'})
                .send(incompletedata)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the data.');
                    done();
                });
        });

    });

    describe('/GET Notebook', () => {

        it('it should succeed with correct fields ', done => {
            const payload = {
                userName: 'testUsername',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .get('/notebook/Notebook')
                .query({token: token, notebookId:'689c0462-ca35-11e8-a8d5-f2801f1b9fd1'})
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.data.should.be.eql('data');
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .get('/notebook/Notebook')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the token.');
                    done();
                });
        });

        it('it should fail with no ID', done => {
            chai.request(index)
                .get('/notebook/Notebook')
                .query({token: 'sdafswdd'})
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the id of the notebook.');
                    done();
                });
        });

    });

    describe('/POST subscribeNotebook', () => {

        it('it should succeed with correct fields ', done => {
            let data = {};
            data.notebookId = '689c0462-ca35-11e8-a8d5-f2801f1b9fd1';

            const payload = {
                userName: 'testUsername1',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .post('/notebook/subscribe')
                .query({token: token})
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .post('/notebook/subscribe')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the token.');
                    done();
                });
        });

        it('it should fail with no Id ', done => {
            chai.request(index)
                .post('/notebook/subscribe')
                .query({token: 'sdafswdd'})
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the id of the notebook.');
                    done();
                });
        });

    });

});