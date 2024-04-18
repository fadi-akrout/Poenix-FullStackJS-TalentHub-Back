require('dotenv').config({ path: '.env.test' });

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const Product = require('../product');

const mongoose = require('mongoose');


chai.use(chaiHttp);




describe('Test Student', () => {






it('should POST a valid Student', (done) => {
        
    let student = {
        name: "Test Product",
        cin: "9999999",
        phoneNumber: "99999999"
    }
    chai.request(server)
    .post('/api/students')
    .send(student)
    .end((err, res) => {
        res.should.have.status(201);
        
        done();

    });

});

it('should GET students', (done) => {
    chai.request(server)
      .get('/api/students')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        // Additional assertions for the response
        // ...
        done();
      });
    });

});