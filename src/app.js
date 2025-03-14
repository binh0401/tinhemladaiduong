const express = require('express')
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')
const { checkOverload } = require('./helpers/check.connect.js')
const  router  = require('./routes/index.js')
require('dotenv').config()

const app = express()


// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression()) //reduce data size travelling
app.use(express.json())
app.use(express.urlencoded({ //handle if user does not send data in JSON, but in url
  extended: true            //handle nested objects 
}))

//init db
require('./dbs/init.mongodb.js')
//checkOverload()


//init routes
app.use('/', router)


//handling error


module.exports = app