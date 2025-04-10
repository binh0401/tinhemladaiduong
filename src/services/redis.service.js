'use strict'

const redis = require('redis')
const redisClient = redis.createClient()
const {promisify} = require('util')


const expire = promisify(redisClient.expire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)