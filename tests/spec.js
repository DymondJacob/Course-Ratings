var app = require('../app');
var request = require('supertest');
var chai = require('chai').expect;
const User = require('../models').User;

describe('user', function() {
  it('should return a user', function(done) {
    const userData = [{ fullName: 'John Smith', emailAddress: 'john@smith.com', password: 'password' }];
    User.create(userData, function(err, users) {
     request(app)
       .get('/api/users')
       .set('Accept', 'application/json')
       .set('Authorization', 'Basic am9lQHNtaXRoLmNvbTpwYXNzd29yZA==')
       .expect('Content-Type', /json/)
       .expect(200)
       .end(function(err, resp) {
         if (err) return done(err);
         chai(resp.body.fullName).to.eq('Joe Smith');
         done();
       });
      });
  });

  it('should return a 401 if the credentials are invalid', function(done) {
     request(app)
      .get('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic bad auth')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function(err, resp) {
        chai(resp.body.error.message).to.eql('Credentials required.');
        done();
      });
  })
});
