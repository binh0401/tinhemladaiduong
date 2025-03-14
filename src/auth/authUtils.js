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


module.exports = {
  createTokenPair
}