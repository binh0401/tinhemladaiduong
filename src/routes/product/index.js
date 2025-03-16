'use strict'

const express = require('express')
const {authentication} = require('../../auth/authUtils')
const router = express.Router()

///AUTHENTICATION///
router.use(authentication)
////////////////////

router.post('')


module.exports = router