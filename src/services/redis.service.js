'use strict'

import redis from 'redis';
import { reservedInventory } from '../models/repositories/inventory.repo.js'
import { InternalServerError } from '../core/error.response.js'
const client = redis.createClient()
await client.connect()


const acquireLock = async (product_id, quantity, cart_id) => {
    const key = `lock_v1_${product_id}`
    const retryTimes = 10
    const expireTime = 3 //3 seconds DB lock

    for (let i = 0; i< retryTimes; i++){
        //Create a lock key expires after 3 secs, user has to wait to acquire the key to interact with DB
        const result = await client.set(key, 'locked', {'NX': true, EX: expireTime})
        if(result === 1){
          try {
            const isReserved = await reservedInventory({product_id, quantity, cart_id})
            if(isReserved.modifiedCount){
              return key
            }
            await client.del(key)
            return null

          } catch (error) {
            await client.del(key)
            throw new InternalServerError('Internal server error')
          }
        }else{
          await new Promise((resolve) => {
            setTimeout(resolve, 50)
          })
        }
    }
    return null
  }

//not use
const releaseLock = async (lockKey) => {
  return await client.del(lockKey)
}

export {acquireLock, releaseLock}