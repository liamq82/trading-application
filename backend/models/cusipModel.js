var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var cusipModel = new Schema({
    cusipId: {
        type: String
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model('Cusip', cusipModel)