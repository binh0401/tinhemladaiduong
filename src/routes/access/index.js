'use strict'

const asyncHandler = require('../../helpers/asyncHandler')
const accessController = require('../../controllers/access.controller')
const express = require('express')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()



// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))

//signIn
router.post('/shop/signin', asyncHandler(accessController.signIn))


///AUTHEN///
router.use(authentication)
////////////
//logOut
router.post('/shop/logout', asyncHandler(accessController.logOut))


module.exports = router