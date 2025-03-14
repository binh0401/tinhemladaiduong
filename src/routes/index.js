'use strict'

const express = require('express')
const router = express.Router()
const accessRoutes = require('./access/index.js')


// check apiKey


//check permission





router.use('/v1/api', accessRoutes)


module.exports = router