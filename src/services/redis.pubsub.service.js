import redis from 'redis'

class RedisPubSubService{
    constructor(){
      this.subscriber = redis.createClient()
      this.publish = redis.createClient()
    }

    publish(channel, msg){
      
    }

    subscribe(channel){

    }
}

export default new RedisPubSubService()