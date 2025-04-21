import amqplib from 'amqplib'

const runConsumer = async() => {
  try {
    const connect = await amqplib.connect('amqp://localhost')
    const channel = await connect.createChannel()

    const queue_name = 'q1'
    await channel.assertQueue(queue_name, {
      durable: true
    })

    channel.consume(queue_name, (msg) => {
      console.log(msg.content.toString())
    }, {
      noAck: true
    })
  } catch (error) {
    console.log(error)
  }
}

runConsumer()

