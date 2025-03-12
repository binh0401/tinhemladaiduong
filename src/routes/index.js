'use strict'

const express = require('express')
const router = express.Router()
const accessRoutes = require('./access/index.js')


router.use('/v1/api', accessRoutes)


module.exports = router