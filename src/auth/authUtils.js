'use strict'
const jwt = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')


const HEADER = {
  API_KEY : 'x-api-key',
  AUTHORIZATION : 'authorization',
  CLIENT_ID: 'x-client-id',
  REFRESH_TOKEN: 'refresh-token'
}

const createTokenPair = async(payload, publicKey, privateKey) => {
  try {
    //access token 

    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: '2 days'
    })

    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: '7 days'
    })


    //verify the access token imediately after create ==> user can use website immediately
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if(err){
        console.error(`error verify:`, err)
      }else{
        console.log(`decode verify`, decode)
      }
    })

    return {accessToken, refreshToken}


  } catch (error) {
    
  }
}

const authentication = asyncHandler( async (req,res,next) => {
    /*
        1, Check userId missing
        2, get public key stored in DB
        3, Check if there is refresh token => if yes, means that user is calling handleRefreshToken route 
        => When call /handleRefreshToken, we only pass refreshToken
        4, get accessToken => if there is accessToken => accessToken still on time 
        => we only pass accessToken if it's on time
        5, verify token
        6, check user in db if correct
        7, return next
    */  

    //#1
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')

    //#2,6
    const keyStored = await KeyTokenService.findPublicKeyByUserId(userId)
    if(!keyStored) throw new NotFoundError('User has already log out')

    //#3
    if(req.headers[HEADER.REFRESH_TOKEN]){
      try {
        const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
        const decodedUser = await verifyRefreshToken(refreshToken, keyStored.privateKey)
        if(decodedUser.userId !== userId) throw new AuthFailureError('Invalid UserId')
        req.keyStored = keyStored
        req.user = decodedUser
        req.refreshToken = refreshToken
        return next()

      } catch (error) {
        throw error
      } 
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    //#4
    try {
      const decodedUser = await verifyAccessToken(accessToken, keyStored.publicKey)
      if(decodedUser.userId !== userId){
        throw new AuthFailureError('Invalid UserId')
      }
      req.keyStored = keyStored
      return next()

    } catch (error) {
      throw error
    }


})

const verifyRefreshToken = async (refreshToken, privateKey) => {
    return await jwt.verify(refreshToken, privateKey)
}

const verifyAccessToken = async (accessToken, publicKey) => {
  return await jwt.verify(accessToken, publicKey)
}

module.exports = {
  createTokenPair,
  authentication,
  verifyRefreshToken,
  verifyAccessToken
}