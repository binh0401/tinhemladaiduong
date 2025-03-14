'use strict'

const express = require('express')
const router = express.Router()
const accessRoutes = require('./access/index.js')
const { apiKey, permission } = require('../auth/checkAuth.js')

// check apiKey
router.use(apiKey)
//check permission
router.use(permission('0000'))





router.use('/v1/api', accessRoutes)


module.exports = router