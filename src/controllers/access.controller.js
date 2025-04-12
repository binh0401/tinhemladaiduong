'use strict'
import AccessService from '../services/access.service.js';

import {CREATED, OK} from '../core/success.response.js'

class AccessController{

  signUp = async(req, res, next) => {
      new CREATED({
        message: 'Registered OK',
        metadata: await AccessService.signUp(req.body)
      }).send(res)
  }
  
  signIn = async(req,res,next) => {
    new OK({
      message: 'Login OK',
      metadata: await AccessService.signIn(req.body)
    }).send(res)
  }
  
  logOut = async(req,res,next) => {
    new OK({
      message: 'Log out success',
      metadata: await AccessService.logOut(req.keyStored)
    }).send(res)
  }

  handleRefreshToken = async (req,res,next) => {
    new OK({
      message: 'Get new tokens success',
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStored: req.keyStored
      })
    }).send(res)
  }

}

export default new AccessController()