var should = require('should'),
    // expect = require('chai').expect,
    request = require('supertest'),
    app = require('../app'),
    mongoose = require('mongoose'),
    Cusip = mongoose.model('Cusip'),
    agent = request.agent(app)

describe('Cusip CRUD Tests:', function () {
    var token

    beforeEach(function (done) {
        var newUser = {
            'email': 'liam@gmail.com',
            'password': '12345'
        }

        agent.post('/auth/register')
            .send(newUser)
            .expect(200)
            .end(function (err, results) {
                token = results.body.token
                done()
            })
    })
    it('should allow an cusip to be posted and return and _id', function (done) {
        var cusipPost = {
            "cusipId": "123987",
            "description": "new cusip"
        }

        agent.post('/api/Cusips')
            .set({ 'token': token })
            .send(cusipPost)
            .expect(200)
            .end(function (err, results) {
                results.body.cusipId.should.equal('123987')
                results.status.should.equal(201)
                done()
            })
    })

    afterEach(function (done) {
        Cusip.remove().exec()
        done()
    })
})