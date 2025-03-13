'use strict'

class AccessService{
  static signUp = async({name, email, password}) => {
    try {
      //step 1: 
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