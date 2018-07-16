var cusipController = function (Cusip) {
    var post = function (req, res) {
        var cusip = new Cusip(req.body)

        if (!req.body.cusipId) {
            res.status(400)
            res.send('Cusip ID is required')
        } else {
            cusip.save(function (err) {
                if (err) {
                    res.status(500)
                    res.send(err)
                }
                else {
                    res.status(201)
                    res.send(cusip)
                }
            })
        }

    }

    var get = function (req, res) {
        var query = {}
        if (req.query.cusipId) {
            query.cusipId = req.query.cusipId
        }
        Cusip.find(query, function (err, cusips) {
            if (err) {
                res.status(500)
                res.send(err)
            }
            else
                res.json(cusips)
        })
    }

    var getByIdMiddleware = function (req, res, next) {
        Cusip.findById(req.params.cusipId, function (err, cusip) {
            if (err) {
                res.status(500)
                res.send(err)
            } else if (cusip) {
                req.cusip = cusip
                next()
            } else {
                res.status(404)
                res.send('no cusip found')
            }
        })

    }

    var getById = function (req, res) {
        res.json(req.cusip)
    }

    var put = function (req, res) {
        req.cusip.cusipId = req.body.cusipId
        req.cusip.description = req.body.description
        req.cusip.save(function (err) {
            if (err) {
                res.status(500)
                res.send(err)
            }
            else
                res.json(req.cusip)
        })
    }

    var patch = function (req, res) {
        if (req.body._id)
            delete req.body._id

        for (var key in req.body) {
            req.cusip[key] = req.body[key]
        }

        req.cusip.save(function (err) {
            if (err)
                res.status(500).send(err)
            else
                res.json(req.cusip)
        })
    }

    var deleteCusip = function (req, res) {
        req.cusip.remove(function (err) {
            if (err)
                res.status(500).send(err)
            else
                res.status(204).send('Removed')
        })
    }

    return {
        post: post,
        get: get,
        getByIdMiddleware: getByIdMiddleware,
        getById: getById,
        put: put,
        patch: patch,
        delete: deleteCusip
    }
}

module.exports = cusipController