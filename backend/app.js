var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    jwt = require('jwt-simple'),
    bcrypt = require('bcrypt-nodejs'),
    cors = require('cors')

var db

if (process.env.ENV === 'Test')
    db = mongoose.connect('mongodb://localhost/cusipAPI_test')
else
    db = mongoose.connect('mongodb://localhost/cusipAPI')

var Cusip = require('./models/cusipModel')
var User = require('./models/user')

var app = express()

var port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

app.use(cors())

authRouter = require('./Routes/authRouter')(User, jwt)
cusipRouter = require('./Routes/cusipsRoutes')(Cusip)
userRegistrationRouter = require('./Routes/userRegistrationRouter')(User, jwt)
loginRouter = require('./Routes/loginRouter')(User, jwt, bcrypt)

app.use('/api', authRouter)
app.use('/api/Cusips', cusipRouter)
app.use('/auth/register', userRegistrationRouter)
app.use('/auth/login', loginRouter)

app.listen(port, () => console.log('listening on port ', port))

module.exports = app