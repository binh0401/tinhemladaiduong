'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const shopRoles = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //step 1: check email exist ?
      const holderShop = await shopModel.findOne(email).lean() //faster query, return a pure JS object

      if (holderShop) {
        return {
          code: 'xxx',
          message: 'Shop already registered'
        }
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
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa')

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey
        })

        if (!publicKeyString) {
          return {
            code: 'xxx',
            message: 'publicKeyString error',
          }
        }


        //create a token pair based on publicKey and privateKey. 
        const tokens = await createTokenPair({
          userId: newShop._id,
          email,
        }, publicKey, privateKey)

        console.log('Create Token Success', tokens)

        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens
          }
        }

      }

      return {
        code: 200,
        metadata: null
      }
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService