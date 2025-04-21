import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
  logLevel: logLevel.NOTHING  
});

const producer = kafka.producer();

const runProducer = async () => {
  try {
    await producer.connect();
    console.log('Producer connected to Kafka');

  

    await producer.send({
      topic: 'test-topic',  
      messages: [
        { value: 'adit con me vao lien nay' },
      ],
    });

    console.log('Message sent to topic');
  } catch (error) {
    console.error('Error in producer:', error);
  } finally {
    await producer.disconnect();
    console.log('Producer disconnected');
  }
};

runProducer();
