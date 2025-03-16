'use strict'

const asyncHandler = require('../../helpers/asyncHandler')
const accessController = require('../../controllers/access.controller')
const express = require('express')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()



// signUp
router.post('/signup', asyncHandler(accessController.signUp))

//signIn
router.post('/signin', asyncHandler(accessController.signIn))


///AUTHEN///
router.use(authentication)
////////////

//logOut
router.post('/logout', asyncHandler(accessController.logOut))

//handle refresh token
router.post('/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))



module.exports = router