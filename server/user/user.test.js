const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');
const config = require('../../config/config');

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## User APIs', () => {
  let jwtToken;

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

  let user = {
    name: 'TESTUSER123',
    avatar: '1234567890'
  };

  describe('# POST /api/users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .set('Authorization', jwtToken)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(user.name);
          expect(res.body.avatar).to.equal(user.avatar);
          user = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/:userId', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(user.name);
          expect(res.body.avatar).to.equal(user.avatar);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/api/users/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', jwtToken)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/users/:userId', () => {
    it('should update user details', (done) => {
      user.name = 'TESTUSER';
      request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', jwtToken)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('TESTUSER');
          expect(res.body.avatar).to.equal(user.avatar);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/api/users')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all users (with limit and skip)', (done) => {
      request(app)
        .get('/api/users')
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

  describe('# DELETE /api/users/', () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('TESTUSER');
          expect(res.body.avatar).to.equal(user.avatar);
          done();
        })
        .catch(done);
    });
  });
});
