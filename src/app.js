const express = require('express')
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')

const app = express()


// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression()) //reduce data size travelling

//init db
require('./dbs/init.mongodb.js')
//init router


//handling error


module.exports = app