import amqp from 'amqplib'

async function consumeOrder(){
  const connection = await amqp.connect('amqps://ccujkwpk:rf7sNTxkUnhwPiqJo8djp5voVc2Vwmc_@leopard.lmq.cloudamqp.com/ccujkwpk')

  const channel = await connection.createChannel()

  const queueName = 'ordered_queue'
  await channel.assertQueue(queueName, {
    durable: true
  })

  channel.prefetch(1)

  channel.consume(queueName, msg => {
    const message = msg.content.toString()

    setTimeout(() => {
      console.log('process:', message)
      channel.ack(msg)
    }, Math.random() * 1000)
  })

   setTimeout(() => {
    connection.close()
  }, 20000)
}

consumeOrder().catch(err => console.log(err))