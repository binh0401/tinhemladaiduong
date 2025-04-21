import { Kafka,logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'], 
  logLevel: logLevel.NOTHING  
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const runConsumer = async () => {
  try {
    await consumer.connect();
    console.log('Consumer connected to Kafka');

    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
    console.log('Consumer subscribed to topic "test-topic"');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log(`Received message from topic "${topic}" and partition ${partition}:`);
          console.log({
            value: message.value.toString(),
          });
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    });
  } catch (error) {
    console.error('Error in consumer:', error);
  }
};

runConsumer().catch((err) => console.log('Unexpected error:', err));
