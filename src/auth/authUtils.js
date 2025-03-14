'use strict'
const jwt = require('jsonwebtoken')


const createTokenPair = async(payload, publicKey, privateKey) => {
  try {
    //access token 

    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days'
    })

    const refreshToken = await jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days'
    })

    return {accessToken, refreshToken}


  } catch (error) {
    
  }
}


module.exports = {
  createTokenPair
}