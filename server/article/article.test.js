const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../index');
const config = require('../../config/config');

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Article APIs', () => {
  let article = {
    title: 'my title',
    text: 'my content',
    tags: ['test'],
    userId: '5b4d0530219c437cd621342d'
  };

  const UserCredentials = {
    username: 'apiUser',
    password: 'express'
  };

  it('should get valid JWT token', (done) => {
    request(app)
      .post('/api/auth/login')
      .send(UserCredentials)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body).to.have.property('token');
        jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
          expect(err).to.not.be.ok;
          expect(decoded.username).to.equal(UserCredentials.username);
          jwtToken = `Bearer ${res.body.token}`;
          done();
        });
      })
      .catch(done);
    });

  describe('# POST /api/articles', () => {
    it('should create a new article', (done) => {
      request(app)
        .post('/api/articles')
        .set('Authorization', jwtToken)
        .send(article)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.title).to.equal(article.title);
          expect(res.body.text).to.equal(article.text);
          expect(res.body.tags.toString()).to.equal(article.tags.toString());
          expect(res.body.userId).to.equal(article.userId);
          article = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/articles/:articleId', () => {
    it('should get article details', (done) => {
      request(app)
        .get(`/api/articles/${article._id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.userId).to.equal(article.userId);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/api/articles/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', jwtToken)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/articles/:articleId', () => {
    it('should update article details', (done) => {
      article.title = 'TESTTITLE';
      request(app)
        .put(`/api/articles/${article._id}`)
        .set('Authorization', jwtToken)
        .send(article)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.title).to.equal('TESTTITLE');
          expect(res.body.userId).to.equal(article.userId);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/articles/', () => {
    it('should get all articles', (done) => {
      request(app)
        .get('/api/articles')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all articles (with limit and skip)', (done) => {
      request(app)
        .get('/api/articles')
        .set('Authorization', jwtToken)
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/articles/', () => {
    it('should delete article', (done) => {
      request(app)
        .delete(`/api/articles/${article._id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.title).to.equal('TESTTITLE');
          done();
        })
        .catch(done);
    });
  });

});