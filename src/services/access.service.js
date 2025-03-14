'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { ceil } = require('lodash')

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
      const holderShop = await shopModel.findOne({ email }).lean() //faster query, return a pure JS object

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












        //No save privateKey into db
        //Save publicKey into db
        //publicKey ==> JSON => save into db
        //take publicKey out from db --> string --> RSA object
        console.log({ privateKey, publicKey })

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })

        if (!keyStore) {
          return {
            code: 'xxx',
            message: 'keyStore error',
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
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
            tokens
          }
        }
      }

      return {
        code: 200,
        metadata: null
      }
    } catch (error) {
      console.error(error)
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService