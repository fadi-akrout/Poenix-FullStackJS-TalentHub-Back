require('dotenv').config({ path: '.env.test' });

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const Product = require('../product');

const mongoose = require('mongoose');


chai.use(chaiHttp);




describe('Test Evenement', () => {






it('should POST a valid Evenement', (done) => {
        
    let evenement = {
        name: "Test evenement",
        address: "lac",
        description: "aaaaa",
    }
    chai.request(server)
    .post('/api/evenements')
    .send(evenement)
    .end((err, res) => {
        res.should.have.status(201);
        
        done();

    });

});

it('should GET evenements', (done) => {
    chai.request(server)
      .get('/api/evenements')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        // Additional assertions for the response
        // ...
        done();
      });
    });

});