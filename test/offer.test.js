require('dotenv').config({ path: '.env.test' });

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const Product = require('../product');

const mongoose = require('mongoose');


chai.use(chaiHttp);




describe('Test Offer', () => {






it('should POST a valid Offer', (done) => {
        
    let offer = {
        name: "Test evenement",
        post: "lac",
        skills: "aaaaa",
    }
    chai.request(server)
    .post('/api/offers')
    .send(offer)
    .end((err, res) => {
        res.should.have.status(201);
        
        done();

    });

});

it('should GET offers', (done) => {
    chai.request(server)
      .get('/api/offers')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        // Additional assertions for the response
        // ...
        done();
      });
    });

});