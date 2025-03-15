'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyRefreshToken } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('../services/shop.service')
const keytokenModel = require('../models/keytoken.model')
const shopRoles = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({ name, email, password }) => {
    
      //step 1: check email exist ?
      const holderShop = await shopModel.findOne({ email }).lean() //faster query, return a pure JS object

      if (holderShop) {
        throw new BadRequestError('Error: Shop already registered')
      }

      //Save User Data
      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [shopRoles.SHOP]
      })


      //2 ways: 
      //#1: Signup, then redirect to login  -> no need for token in the sign up step
      //#2: Signup and give refresh and access token --> this way

      //Generate publickey and private key, store public key into db and return publicKey as string
      if (newShop) {

        // :::HUGE SYSTEM USE THIS:::
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem' //public key cryptography standard
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   }
        // })

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        console.log({ privateKey, publicKey })
        
        const tokens = await createTokenPair({
          userId: newShop._id,
          email,
        }, publicKey, privateKey)


        const keyStored = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
          refreshToken: tokens.refreshToken
        })

        if (!keyStored) {
          throw new BadRequestError('Error: Error in storing keys')
        }

        //create a token pair based on publicKey and privateKey. 
        

        console.log('Create Token Success', tokens)
        return {         
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
            tokens    
        }
      }
      return {
        code: 200,
        metadata: null
      }
    
  }

  static signIn = async ({email, password, refreshToken = null}) => {

      /*
      1, Check email in DB
      2, match user's password vs DB password
      3, Create a public key and private key
      4, generate token
      5, save public key, private key and refresh token into db
      6, get user data from db and return to FE
      */

      //#1
      const foundShop = await findByEmail({email})
      if(!foundShop){
        throw new BadRequestError('Error: Shop not registered !')
      }

      //#2
      const matchPassword = bcrypt.compare(password, foundShop.password)
      if(!matchPassword){
        throw new AuthFailureError('Error: Authentication error')
      }

      //#3
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')
      console.log({ privateKey, publicKey })

      //#4
      const tokens = await createTokenPair(
        {
          userId: foundShop._id,
          email
        },
        publicKey,
        privateKey
      )
      console.log('Create Token Success', tokens)

      //#5
      const keyStored = await KeyTokenService.createKeyToken({
        userId: foundShop._id,
        publicKey, 
        privateKey,
        refreshToken: tokens.refreshToken
      })

      if(!keyStored){
        throw new BadRequestError('Error: Error in storing keys')
      }
      
      //#6
      return {
        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
        tokens
      }
  }

  static logOut = async (keyStored) => {
      const delKey = await KeyTokenService.removeKeyById(keyStored._id)
      console.log(delKey)
      return delKey

  }

  static handleRefreshToken = async ({refreshToken, user, keyStored}) => {  
      /*
        1, Check if refreshToken is used
        2, If used => decode the refresh token to see who tf 's that (invalid) ???
        3, Know who's that ==> Delete that user from keyToken DB (user, 2 keys, refreshToken, refreshTokenUsed)
        4, If not used => find who is using that refresh token (valid)
        5, Verify the refresh token
        6, Check user get from refresh token
        7, Create new tokens: from 2 keys in DB --> new access token, new refresh token
        8, Update user auth info: refresh token using (new refresh token just created)
        9, Add refresh token into UsedRefreshToken array
        10, Return new access token , new refresh token
      */

      //#2
      const {userId, email} = user

      //#1,3
      if(keyStored.refreshTokensUsed.includes(refreshToken)){
        await KeyTokenService.deleteUserAuthInfoByUserId(userId)
        throw new ForbiddenError('Something wrong happened. Please relogin')
      }
      
      //#4
      if(keyStored.refreshToken !== refreshToken){
        throw new AuthFailureError('Please relogin')
      }

      //#6
      const foundShop = await findByEmail({email})
      if(!foundShop) throw new AuthFailureError('Please registered')

      //#7
      const tokens = await createTokenPair(
        {
          userId,
          email
        },
       keyStored.publicKey,
       keyStored.privateKey)

      //#8
      await keyStored.updateOne({
        $set : {
          refreshToken: tokens.refreshToken
        },

        //#9
        $addToSet: {
          refreshTokensUsed: refreshToken
        }
      })
      
      //#10
      return {
        user,
        tokens 
      }
      
  }

}

module.exports = AccessService