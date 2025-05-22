import amqp from 'amqplib'

async function consumerOrder() {
  const connection = await amqp.connect('amqps://ccujkwpk:rf7sNTxkUnhwPiqJo8djp5voVc2Vwmc_@leopard.lmq.cloudamqp.com/ccujkwpk')

  const channel = await connection.createChannel()

  const queueName = 'ordered_queue'

  await channel.assertQueue(queueName, {
    durable: true
  })

  for (let i = 0; i < 10; i++) {
    const message = `ordered_queue message: ${i}`
    console.log(`message: ${message}`)

    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true
    })
  }

  setTimeout(() => {
    connection.close()
  }, 5000)
}

consumerOrder().catch(err => console.log(err))