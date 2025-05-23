'use strict'

import mongoose from 'mongoose';
import os from 'os';
import process from 'process';
const _SECONDS = 5000
//countConnect
const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connections: ${numConnection}`)
}

//check overload
const checkOverload = () => {
    setInterval(()=>{
      const numConnections = mongoose.connections.length
      const numCores = os.cpus().length
      const memoryUsage = process.memoryUsage().rss

      //example maximum number of connections based on number of cores
      const maxConnections = numCores * 5

      if(numConnections > maxConnections){
        console.log('Connection overload detected')
      }

      console.log(`Active connections: ${numConnections}`)
      console.log(`Memory usage: ${memoryUsage/ 1024 /1024} MB`)


    },_SECONDS)// Monitor every 5 seconds
}

export {countConnect, checkOverload}