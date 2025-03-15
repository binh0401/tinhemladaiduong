'use strict'

const { asyncHandler } = require('../../auth/checkAuth')
const accessController = require('../../controllers/access.controller')
const express = require('express')
const router = express.Router()



// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))


module.exports = router