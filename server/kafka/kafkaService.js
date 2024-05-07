/**
 * @file This module provides functions for interacting with Kafka.
 * @module kafkaService
 */

const { Kafka } = require('kafkajs');

/**
 * Kafka client configuration.
 * @type {Object}
 * @property {string} clientId - Client ID used to identify the Kafka client.
 * @property {string[]} brokers - Array of broker addresses.
 * @property {Object} sasl - SASL authentication configuration.
 * @property {string} sasl.mechanism - SASL mechanism for authentication.
 * @property {string} sasl.username - Username for authentication.
 * @property {string} sasl.password - Password for authentication.
 */
const kafka = new Kafka({
    clientId: 'tictalktoe',
    brokers: ['192.168.67.2:30005'],
    sasl: {
        mechanism: 'plain',
        username: 'user1',
        password: '50oyrgdy7f'
    },
});

/**
 * Kafka producer instance.
 * @type {Producer}
 */
const producer = kafka.producer();

/**
 * Kafka consumer instance.
 * @type {Consumer}
 */
const consumer = kafka.consumer({ groupId: 'tictactoe-game-group' });

/**
 * Kafka admin instance for managing topics.
 * @type {Admin}
 */
const admin = kafka.admin();

/**
 * Connects the Kafka producer and consumer.
 * @async
 * @function connectKafka
 */
const connectKafka = async () => {
    await producer.connect();
    await consumer.connect();
}

/**
 * Deletes a Kafka topic.
 * @async
 * @function deleteTopic
 * @param {string} topicName - The name of the topic to delete.
 */
async function deleteTopic(topicName) {
    await admin.deleteTopics({
        topics: [topicName]
    })
}

/**
 * Creates a new Kafka topic.
 * @async
 * @function createTopic
 * @param {string} topicName - The name of the topic to create.
 */
async function createTopic(topicName) {
    try {
        await admin.connect();
        await admin.createTopics({
            topics: [{
                topic: topicName,
                numPartitions: 3,
                replicationFactor: 1
            }]
        });
        console.log('Topic created successfully');
    } catch (error) {
        console.error('Error creating topic:', error);
    } finally {
        await admin.disconnect();
    }
}

/**
 * Produces a message to a Kafka topic.
 * @async
 * @function produceMessage
 * @param {string} topic - The topic to which the message will be sent.
 * @param {string} keyInput - The key of the message.
 * @param {string} valueInput - The value of the message.
 */
const produceMessage = async (topic, keyInput, valueInput) => {
    await producer.send({
        topic,
        messages: [
            { key: keyInput, value: valueInput },
        ],
    });
}

/**
 * Consumes messages from a Kafka topic.
 * @async
 * @function consumeMessages
 * @param {string} topic - The topic from which messages will be consumed.
 */
const consumeMessages = async (topic) => {
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                console.log({
                    value: "{Topic: " + topic + "} Kafka Consumer: " + message.value.toString(),
                });
            } catch (error) {
                console.error('Error processing message:', error);
            }
        },
    });
}

/**
 * Disconnects Kafka clients.
 * @async
 * @function disconnectKafka
 */
const disconnectKafka = async () => {
    console.log('Disconnecting Kafka client...');
    if (consumer) {
        console.log('Disconnecting Kafka consumer...');
        await consumer.disconnect();
    }

    if (producer) {
        console.log('Disconnecting Kafka producer...');
        await producer.disconnect();
    }
    console.log('Kafka client disconnected successfully');
}

module.exports = {
    connectKafka,
    produceMessage,
    consumeMessages,
    createTopic,
    disconnectKafka,
    deleteTopic
}
