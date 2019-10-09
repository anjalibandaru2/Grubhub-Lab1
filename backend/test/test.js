const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = require('chai').should();
const assert = require('assert');
const expect = chai.expect;
const test_name = "anjali", test_phoneNumber = 988222347;
const test_email = "anjali.bandaru@sjsu.edu", test_password = "anjali";


describe('Mocha tests for Grubhub:', () => {

    // Get course details
    it("Test Case 1 --- Verify signin with valid credentials", (done) => {
        chai.request('http://localhost:3001')
        .post(`/signin`)
        .send({
            email : test_email,
            password : test_password,
            userType : "owner"
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(err).to.be.null;
            res.body.should.be.a('object');
            res.status.should.be.equal(200);  
            expect(res.body.status).to.equal(true);
            expect(res.body.message).to.equal("Loggedin successfully");
        done();
        });
    });

    it("Test Case 2 --- Get profile details of owner", (done) => {
        chai.request('http://localhost:3001')
        .post(`/getOwnerProfile`)
        .send({
            owner_id : 2
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(err).to.be.null;
            res.body.should.be.a('object');
            res.status.should.be.equal(200);  
            expect(res.body.status).to.equal(true);
            expect(res.body.message.owner_name).to.equal(test_name);
        done();
        });
    });

    it("Test Case 3 --- Update profile of owner", (done) => {
        chai.request('http://localhost:3001')
        .post(`/updateOwnerProfile`)
        .send({
            owner_id : 1,
            owner_colName : "owner_phoneNumber",
            owner_colValue : test_phoneNumber
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(err).to.be.null;
            res.body.should.be.a('object');
            res.status.should.be.equal(200);  
            expect(res.body.status).to.equal(true);
            
            expect(res.body.message.owner_phoneNumber).to.equal(test_phoneNumber);
        done();
        });
    });

    it("Test Case 4 --- Get menu of owner's restaurant", (done) => {
        chai.request('http://localhost:3001')
        .post(`/getAllMenuItems`)
        .send({
            owner_id : 1
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(err).to.be.null;
            res.body.should.be.a('object');
            res.status.should.be.equal(200);  
            expect(res.body.status).to.equal(true);
            expect(res.body.message).to.be.an('object').to.have.own.property("breakfast");
            expect(res.body.message).to.be.an('object').to.have.own.property("lunch");
            expect(res.body.message).to.be.an('object').to.have.own.property("appetizers");
            res.body.message.should.be.an('object');
            //expect(res.body.message).to.equal(true);
            //expect(res.body.message.owner_phoneNumber).to.equal(test_phoneNumber);
        done();
        });
    });

    it("Test Case 5 --- verify sign in with invalid password", (done) => {
        chai.request('http://localhost:3001')
        .post(`/signin`)
        .send({
           email : test_email,
           password : "testpwd",
           userType : "owner"
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(err).to.be.null;
            res.body.should.be.a('object');
            res.status.should.be.equal(200);  
            expect(res.body.status).to.equal(false);
            expect(res.body.message).to.equal("Incorrect Password!!");
        done();
        });
    });
    
})