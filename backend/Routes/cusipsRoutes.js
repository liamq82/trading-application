var express = require('express')

var routes = function (Cusip) {
    var cusipRouter = express.Router();
    var cusipController = require('../controller/cusipController')(Cusip)

    cusipRouter.route('/')
        .post(cusipController.post)
        .get(cusipController.get)

    cusipRouter.use('/:cusipId', cusipController.getByIdMiddleware)

    cusipRouter.route('/:cusipId')
        .get(cusipController.getById)
        .put(cusipController.put)
        .patch(cusipController.patch)
        .delete(cusipController.delete)

    return cusipRouter
}

module.exports = routes