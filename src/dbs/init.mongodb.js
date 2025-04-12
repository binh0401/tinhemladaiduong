'use strict'
import {defaultConfig} from '../configs/config.mongodb.js'
import mongoose from 'mongoose';
import {countConnect} from '../helpers/check.connect.js'
const {host, port, name} = defaultConfig.db

const connectString = `mongodb://${host}:${port}/${name}`
class Database{
//Singleton database connection
  constructor(){
    this.connect()
  }

  connect(type = 'mongodb'){

    if(1===1){
      mongoose.set('debug', true)
      mongoose.set('debug', {color: true})
    }
    mongoose.connect(connectString, {
      maxPoolSize: 50
    }).then(() => 
    {
      console.log(`Connected MongoDB success`)
      countConnect()
    }
      )
    .catch( error => console.log(`Error Connect ! ${error}`))
  }

  //static factory method, if already has instance -> return instance else create new instance
  static getInstance(){
    if(!Database.instance){
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()

export default instanceMongodb
