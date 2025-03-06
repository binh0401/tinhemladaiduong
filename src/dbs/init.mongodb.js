'use strict'

const mongoose = require('mongoose')
const connectString = `mongodb://localhost:27017/shopDEV`
const {countConnect} = require('../helpers/check.connect.js')

class Database{

  constructor(){
    this.connect()
  }

  connect(type = 'mongodb'){

    if(1===1){
      mongoose.set('debug', true)
      mongoose.set('debug', {color: true})
    }
    mongoose.connect(connectString).then(() => 
    {
      console.log(`Connected MongoDB success`)
      countConnect()
    }
      )
    .catch( error => console.log(`Error Connect !`))
  }

  static getInstance(){
    if(!Database.instance){
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb
