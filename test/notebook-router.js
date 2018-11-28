let chai = require('chai');
let index = require('../index');
let chaiHttp = require('chai-http');
let jwt = require('jsonwebtoken');
let should = chai.should();

chai.use(chaiHttp);

describe('notebook-router', function() {

    describe('/POST createNotebook', () => {

        it('it should succeed with correct fields public', done => {
            const payload = {
                userName: 'TestUser1',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .post('/notebook/createNotebook')
                .query( { name: 'notebook name', token: token, })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should succeed with correct fields private', done => {
            const payload = {
                userName: 'TestUser12',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .post('/notebook/createNotebook')
                .query( { name: '(private)notebookabc', token: token, })
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
                .query({ token: 'sdafswdd', })
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the name of the notebook.');
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
                .query({ token: token, })
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
                .query({ token: 'sdafswdd', })
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the id of the notebook.');
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
                .query({ token: token, })
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
                .query({ token: 'sdafswdd', })
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
                .query({ token: 'sdafswdd', })
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
                .query({ token: token, notebookId: '689c0462-ca35-11e8-a8d5-f2801f1b9fd1', })
                .end((err, res) => {
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
                .query({ token: 'sdafswdd', })
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the id of the notebook.');
                    done();
                });
        });

    });

    describe('/GET Search_userName', () => {

        it('it should succeed with correct field userName ', done => {
            const payload = {
                userName: 'testUsername',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .get('/notebook/search_userName')
                .query({ token: token, userName: 'testUsername1', })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data[0].name.should.be.eql('testNotebook1');
                    done();
                });
        });

        it('it should succeed with correct field userName public field ', done => {
            const payload = {
                userName: 'TestUser1',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .get('/notebook/search_userName')
                .query({ token: token, userName: 'TestUser12', })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.length.should.be.eql(0);
                    done();
                });
        });

        it('it should succeed with correct field userName private field ', done => {
            const payload = {
                userName: 'TestUser12',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .get('/notebook/search_userName')
                .query({ token: token, userName: 'TestUser12', })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.length.should.be.eql(1);
                    res.body.data[0].name.should.be.eql('(private)notebookabc');
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .get('/notebook/search_userName')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the token.');
                    done();
                });
        });

        it('it should fail with no userName', done => {
            chai.request(index)
                .get('/notebook/search_userName')
                .query({ token: 'sdafswdd', })
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the userName.');
                    done();
                });
        });

    });

    describe('/GET Search_name', () => {

        it('it should succeed with correct field name ', done => {
            const payload = {
                userName: 'testUsername',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .get('/notebook/search_name')
                .query({ token: token, name: 'testNotebook', })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data[0].username.should.be.eql('testUsername');
                    done();
                });
        });

        it('it should succeed with correct field name but public notebook', done => {
            const payload = {
                userName: 'testUsername1',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .get('/notebook/search_name')
                .query({ token: token, name: '(private)notebookabc', })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.length.should.be.eql(0);
                    done();
                });
        });

        it('it should succeed with correct field name but private notebook', done => {
            const payload = {
                userName: 'TestUser12',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .get('/notebook/search_name')
                .query({ token: token, name: '(private)notebookabc', })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.length.should.be.eql(1);
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .get('/notebook/search_name')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the token.');
                    done();
                });
        });

        it('it should fail with no userName', done => {
            chai.request(index)
                .get('/notebook/search_name')
                .query({ token: 'sdafswdd', })
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the name.');
                    done();
                });
        });

    });

    describe('/GET Search', () => {

        it('it should succeed with correct field ', done => {
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
                    done();
                });
        });

    });

    describe('/POST update', () => {

        it('it should succeed with correct fields ', done => {
            let data = {};
            data.notebookId = '689c0462-ca35-11e8-a8d5-f2801f1b9fd1';
            data.like = 10;
            data.dislike = 11;
            data.comment = 'test comment';

            const payload = {
                userName: 'testUsername',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .post('/notebook/update')
                .query({ token: token, })
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .post('/notebook/update')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the token.');
                    done();
                });
        });

    });
    describe('/POST updateNameNotebook', () => {

        it('it should succeed with correct fields ', done => {
            let data = {};
            data.notebookId = '689c0462-ca35-11e8-a8d5-f2801f1b9fd1';
            data.name = 'newName';

            const payload = {
                userName: 'testUsername',
            };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: '10h',
            });
            chai.request(index)
                .post('/notebook/updateNameNotebook')
                .query({ token: token, })
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should fail with no fields ', done => {
            chai.request(index)
                .post('/notebook/updateNameNotebook')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the token.');
                    done();
                });
        });

        it('it should fail with no Id and data ', done => {
            chai.request(index)
                .post('/notebook/updateNameNotebook')
                .query({ token: 'sdafswdd', })
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the id of the notebook.');
                    done();
                });
        });

        it('it should fail with no name ', done => {
            let incompletedata = {};
            incompletedata.notebookId = 'nhsdocnh';
            chai.request(index)
                .post('/notebook/updateNameNotebook')
                .query({ token: 'sdafswdd', })
                .send(incompletedata)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errorType.should.be.eql('RequestFormatError');
                    res.body.message.should.be.eql('Must include the name.');
                    done();
                });
        });
    });
});