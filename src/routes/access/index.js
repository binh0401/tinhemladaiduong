'use strict'

import asyncHandler from '../../helpers/asyncHandler.js';
import accessController from '../../controllers/access.controller.js';
import express from 'express';
import { authentication } from '../../auth/authUtils.js'

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



export default router