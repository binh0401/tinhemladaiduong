import amqplib from 'amqplib'

const message = 'hello'

const runProducer = async (msg) => {
  try {
    // Connect to RabbitMQ
    const connect = await amqplib.connect('amqps://ccujkwpk:rf7sNTxkUnhwPiqJo8djp5voVc2Vwmc_@leopard.lmq.cloudamqp.com/ccujkwpk')
    const channel = await connect.createChannel()

    // Define exchange and queue names
    const notiExchange = 'notiEx'
    const queueName = 'notiQueue'
    const notiDLXExchange = 'notiExDLX'
    const dlxQueueName = 'notiQueueDLX'
    const routingKey = 'notification'
    const notiRoutingKeyDLX = 'notiRoutingKeyDLX'
    
    // Assert main exchange
    await channel.assertExchange(notiExchange, 'direct', {
      durable: true
    })

    // Assert dead letter exchange
    await channel.assertExchange(notiDLXExchange, 'direct', {
      durable: true
    })

    // Assert and configure the main queue with DLX settings
    const q = await channel.assertQueue(queueName, {
      exclusive: false,
      durable: true,
      deadLetterExchange: notiDLXExchange,
      deadLetterRoutingKey: notiRoutingKeyDLX
    })

    // Assert DLX queue
    const dlxQueue = await channel.assertQueue(dlxQueueName, {
      exclusive: false,
      durable: true
    })

    // Bind main queue to exchange with routing key
    await channel.bindQueue(q.queue, notiExchange, routingKey)
    
    // Bind DLX queue to DLX exchange
    await channel.bindQueue(dlxQueue.queue, notiDLXExchange, notiRoutingKeyDLX)

    console.log(`Sending message: ${msg}`)
    
    // Publish message with expiration
    await channel.publish(notiExchange, routingKey, Buffer.from(msg), {
      expiration: '10000',
      persistent: true,
      contentType: 'application/json'
    })

    console.log(`Message sent with 10s expiration`)

    // Close connection after sending message
    setTimeout(() => {
      channel.close()
      connect.close()
      console.log('Connection closed')
    }, 500)
  } catch (error) { 
    console.error('Error:', error)
  }
}

runProducer(message)