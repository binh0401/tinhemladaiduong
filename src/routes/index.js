'use strict'

const express = require('express')
const router = express.Router()
const accessRoutes = require('./access/index.js')
const { apiKey } = require('../auth/checkAuth.js')

// check apiKey
router.use(apiKey)
//check permission





router.use('/v1/api', accessRoutes)


module.exports = router