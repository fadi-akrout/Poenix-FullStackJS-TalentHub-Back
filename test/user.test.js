require('dotenv').config({ path: '.env.test' });

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const Product = require('../product');

const mongoose = require('mongoose');


chai.use(chaiHttp);




describe('Test User', () => {






it('should POST a valid User', (done) => {
        
    let user = {
        name: "Test Product",
        email: "amir@gmail.com",
        password: "password123"
    }
    chai.request(server)
    .post('/api/users')
    .send(user)
    .end((err, res) => {
        res.should.have.status(201);
        
        done();

    });

});

it('should GET users', (done) => {
    chai.request(server)
      .get('/api/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        // Additional assertions for the response
        // ...
        done();
      });
    });

});