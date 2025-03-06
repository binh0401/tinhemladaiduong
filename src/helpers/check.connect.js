'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000
//countConnect
const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connections: ${numConnection}`)
}

//check overload
const checkOverload = () => {
    setInterval(()=>{
      const numConnection = mongoose.connection.length
      const numCores = os.cpus().length
      const memoryUsage = process.memoryUsage().rss

      
    },_SECONDS)// Monitor every 5 seconds
}


module.exports = {countConnect}