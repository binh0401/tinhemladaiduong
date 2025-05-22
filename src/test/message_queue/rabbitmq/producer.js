import amqplib from 'amqplib'

const message = 'hello'

const runProducer = async (msg) => {
  try {
    const connect = await amqplib.connect('amqps://ccujkwpk:rf7sNTxkUnhwPiqJo8djp5voVc2Vwmc_@leopard.lmq.cloudamqp.com/ccujkwpk')
    
    const channel = await connect.createChannel()

    const queue_name = 'q1'
    
    await channel.assertQueue(queue_name, {
      durable: true
    })

    //publish message
    await channel.sendToQueue(queue_name, Buffer.from(msg))
    

  } catch (error) { 
    console.log(error)
  }
}

runProducer(message)