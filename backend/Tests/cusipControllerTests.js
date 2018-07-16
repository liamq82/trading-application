var should = require('chai').should(),
    sinon = require('sinon');

describe('Cusip Controller Tests:', function () {
    describe('Post', function () {

        var Cusip = function (cusip) {
            this.save = function (cb) {
                cb(undefined)
            }
        }
        var cusipController = require('../controller/cusipController')(Cusip)
        var res;

        beforeEach(function () {
            res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
        })

        it('should not allow an empty cusip ID on POST', function () {
            var req = {
                body: {
                    description: 'My cusip for testing.'
                }
            }
            cusipController.post(req, res)

            res.status.calledWith(400).should.be.true
            res.send.calledWith('Cusip ID is required').should.be.true
        })

        it('should save valid cusips', function () {
            var req = {
                body: {
                    cusipId: '12345'
                }
            }

            cusipController.post(req, res)
            res.status.calledWith(201).should.equal(true, 'Valid cusip not saved successfully')
            res.send.calledOnce.should.equal(true, 'Send was not called for valid cusip')
            res.send.calledWith(req)
        })
    })

    describe('GET', function () {

        var res;
        var req;
        var CusipThatReturnsError = {
            find: function (query, cb) {
                cb('error')
            }
        }
        var CusipThatReturnsData = {
            find: function (query, cb) {
                cb(null, ['cusip 1', 'cusip 2', 'cusip 3'])
            }
        }
        var CusipWithSpyOnFindFunction;
        var queryWithNoCusipId = {}

        beforeEach(function () {
            res = {
                status: sinon.spy(),
                send: sinon.spy(),
                json: sinon.spy()
            }
            req = {
                query: {}
            }
            CusipWithSpyOnFindFunction = {
                find: sinon.spy()
            }
        })

        it('should return error 500 if database error thrown', function () {
            var cusipController = require('../controller/cusipController')(CusipThatReturnsError)
            cusipController.get(req, res)

            res.status.calledWith(500).should.equal(true, 'Error code 500 not set in status')
            res.send.calledWith('error').should.equal(true, 'send called with incorrect error message')
        })

        it('should return list of cusips found in database', function (done) {
            var cusipController = require('../controller/cusipController')(CusipThatReturnsData)
            cusipController.get(req, res)

            res.json.calledOnce.should.equal(true, 'send not called for successful GET')
            res.json.calledWith(['cusip 1', 'cusip 2', 'cusip 3']).should.equal(true, 'cusips returned from database not sent in response')
            done()
        })

        it('should get cusip by cusip ID', function () {
            req.query.cusipId = '12345'
            var cusipController = require('../controller/cusipController')(CusipWithSpyOnFindFunction)
            cusipController.get(req, res)

            CusipWithSpyOnFindFunction.find.calledWith({
                cusipId: '12345'
            }).should.equal(true, 'Cusip ID not used to get Cusip')
        })

        it('should get all cusips if no cusip ID available', function () {
            var cusipController = require('../controller/cusipController')(CusipWithSpyOnFindFunction)
            cusipController.get(req, res)
            CusipWithSpyOnFindFunction.find.calledWith(queryWithNoCusipId).should.equal(true, 'Cusip ID should not have been passed as query parameter')
        })
    })

    describe('Get by ID middleware', function () {

        var CusipThatReturnsError = {
            findById: function (id, cb) {
                cb('error')
            }
        }
        var cusipControllerThatReturnsError = require('../controller/cusipController')(CusipThatReturnsError)

        var cusipRetrievedFromDatabase = {
            cusipId: '12345',
            description: 'My cusip'
        }
        var CusipThatSuccessfullyGetsData = {
            findById: function (id, cb) {
                cb(null, cusipRetrievedFromDatabase)
            }
        }
        var cusipControllerSuccess = require('../controller/cusipController')(CusipThatSuccessfullyGetsData)


        var CusipThatReturnsNoData = {
            findById: function (id, cb) {
                cb(null, null)
            }
        }
        var cusipControllerNoCusipFound = require('../controller/cusipController')(CusipThatReturnsNoData)

        var req
        var res
        var next

        beforeEach(function () {
            req = {
                params: {
                    cusipId: '12345'
                }
            }
            res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
            next = sinon.spy()
        })

        it('should handle server errors', function () {
            cusipControllerThatReturnsError.getByIdMiddleware(req, res, next)

            res.status.calledWith(500).should.equal(true, 'Server error did not set status as 500')
            res.send.calledWith('error').should.equal(true, 'Server error did not return errom message')
        })

        it('should successfully retrive cusips', function () {
            cusipControllerSuccess.getByIdMiddleware(req, res, next)

            next.calledOnce.should.equal(true, 'Next should be called if an cusip is retrieved from database')
            req.cusip.should.equal(cusipRetrievedFromDatabase, 'Cusip was not added to request')
        })

        it('should handle no cusip found', function () {
            cusipControllerNoCusipFound.getByIdMiddleware(req, res, next)

            res.status.calledWith(404).should.equal(true, 'status not set to 404 when no cusip found')
            res.send.calledWith('no cusip found').should.equal(true, 'should call send with "no cusip found"')
        })
    })

    describe('GET by ID', function () {
        var Cusip = {}
        var retrievedCusip = {
            cusipId: '12345',
            description: 'Cusip retrieved from database'
        }
        var cusipController = require('../controller/cusipController')(Cusip)
        var req = {
            cusip: retrievedCusip
        }
        var res = {
            json: sinon.spy()
        }
        it('should return an cusip', function () {
            cusipController.getById(req, res)
            res.json.calledWith(retrievedCusip).should.equal(true, 'GET by ID did not return cusip')
        })
    })

    describe('PUT', function () {

        var cusipController = require('../controller/cusipController')()
        var reqWithSaveError = {
            body: {
                cusipId: '12345',
                description: 'cusip to put'
            },
            cusip: {
                save: function (cb) {
                    cb('error')
                }
            }
        }

        var cusipToSave = {
            cusipId: '12345',
            description: 'succesfully saved cusip'
        }
        var reqWithSuccessfulSave = {
            body: cusipToSave,
            cusip: {
                save: function (cb) {
                    cb(null)
                }
            }
        }
        var res;

        beforeEach(function () {
            res = {
                status: sinon.spy(),
                send: sinon.spy(),
                json: sinon.spy()
            }

        })

        it('should handle errors when saving to database', function () {
            cusipController.put(reqWithSaveError, res)
            res.status.calledWith(500).should.be.true
            res.send.calledWith('error').should.be.true
        })

        it('should return saved cusip on successful save', function () {
            cusipController.put(reqWithSuccessfulSave, res)

            res.json.calledWith(reqWithSuccessfulSave.cusip).should.be.true
        })
    })
})