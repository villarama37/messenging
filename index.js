const Sns = require('./Sns.js');
const Sqs = require('./Sqs.js');

const sns = new Sns();
const sqs = new Sqs();

/**
 * Setup:
 *  1. Create 2 Queues (https://console.aws.amazon.com/sqs/home?region=us-west-2)
 *  2. Create an SNS Topic (https://us-west-2.console.aws.amazon.com/sns/v3/home?region=us-west-2#/topics)
 *  3. Adds policy to allow the SNS to send messages to the Queues
 *  4. Subscribes the queues to the SNS Topic
 *
 *  Setup will be done once per environment.
 */
const setup = async () => {
  const queueUrl1 = await sqs.createQueue('TEST_QUEUE');
  const queueUrl2 = await sqs.createQueue('TEST_QUEUE_2');
  const queueArn1 = await sqs.getArn(queueUrl1);
  const queueArn2 = await sqs.getArn(queueUrl2);
  const topic = await sns.createTopic('TOPIC_TEST_NAME');
  sqs.setPolicy(queueUrl1, queueArn1, topic);
  sqs.setPolicy(queueUrl2, queueArn2, topic);
  await sns.subscribeSqs(topic, queueArn1);
  await sns.subscribeSqs(topic, queueArn2);
};

/**
 * Deletes the Queues and the SNS Topic
 */
const cleanup = async () => {
  const queueUrl1 = await sqs.findQueue('TEST_QUEUE');
  const queueUrl2 = await sqs.findQueue('TEST_QUEUE_2');
  const topic = await sns.createTopic('TOPIC_TEST_NAME');
  await sqs.deleteQueue(queueUrl1);
  await sqs.deleteQueue(queueUrl2);
  await sns.deleteTopic(topic);
};

/**
 * Processes messages from a queue
 *  1. Prints the message
 *  2. Deletes the message from the queue
 */
const processMessages = (messages, queueUrl) => {
  (messages || []).forEach((message) => {
    const { ReceiptHandle, Body } = message;
    const { Message } = JSON.parse(Body);
    console.log({ Message });
    sqs.deleteMessage(queueUrl, ReceiptHandle);
  });
};

/**
 * Tries to get the Messages from the queue
 */
const getMessages = async () => {
  const queueUrl1 = await sqs.findQueue('TEST_QUEUE');
  const queueUrl2 = await sqs.findQueue('TEST_QUEUE_2');
  processMessages(await sqs.receiveMessages(queueUrl1), queueUrl1);
  processMessages(await sqs.receiveMessages(queueUrl2), queueUrl2);
};

/**
 * Sends a messages to the Topic which forwards the messages to the Queues
 */
const sendMessage = async () => {
  const topic = await sns.createTopic('TOPIC_TEST_NAME');
  await sns.sendMessage(topic, 'hi');
}

/**
 * Gets the current state of the queues
 */
const queueInfo = async () => {
  const queueUrl1 = await sqs.findQueue('TEST_QUEUE');
  const queueUrl2 = await sqs.findQueue('TEST_QUEUE_2');

  const attr1 = await sqs.getAttributes(queueUrl1);
  const attr2 = await sqs.getAttributes(queueUrl2);

  console.log({ attr1, attr2 });
}


/**
 * Main
 */
(async () => {
  try {
    //setup();
    //cleanup();
    //sendMessage();
    //queueInfo();
    //getMessages();
  } catch (err) {
    console.error(err);
  }
})();
