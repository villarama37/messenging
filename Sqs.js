const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

class SqsWrapper {
  async createQueue(name) {
    var params = {
      QueueName: name,
      Attributes: {
        DelaySeconds: '60',
        MessageRetentionPeriod: '86400'
      }
    };

    const { QueueUrl } = await sqs.createQueue(params).promise();
    return QueueUrl;
  }

  async findQueue(QueueName) {
    var params = {
      QueueName
    };

    const { QueueUrl } = await sqs.getQueueUrl(params).promise();
    return QueueUrl;
  }

  async deleteQueue(QueueUrl) {
    console.log(`deleting ${QueueUrl}`);
    var params = {
      QueueUrl
    };

    await sqs.deleteQueue(params).promise();
  }
  async listQueues() {
    const { QueueUrls } = await sqs.listQueues({}).promise();
    console.log({ QueueUrls });
  }

  async receiveMessages(queueUrl) {
    console.log(`Checking for messages....`);
    const params = {
      AttributeNames: ['All'],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      QueueUrl: queueUrl,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 2
    };

    const { Messages } = await sqs.receiveMessage(params).promise();

    return Messages;
  }

  async receiveMessages(queueUrl) {
    console.log(`Checking for messages....`);
    const params = {
      AttributeNames: ['All'],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      QueueUrl: queueUrl,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 2
    };

    const { Messages } = await sqs.receiveMessage(params).promise();

    return Messages;
  }

  async deleteMessage(QueueUrl, ReceiptHandle) {
    console.log('deleting message');
    const params = {
      QueueUrl,
      ReceiptHandle
    };

    const data = await sqs.deleteMessage(params).promise();
  }

  async getArn(queueUrl) {
    const params = {
      QueueUrl: queueUrl,
      AttributeNames: ['QueueArn']
    };

    const { Attributes } = (await sqs.getQueueAttributes(params).promise()) || {};
    const { QueueArn } = Attributes;
    return QueueArn;
  }

  async setPolicy(queueUrl, queueArn, snsTopicArn) {
    const Policy = `
{
      "Version": "2012-10-17",
      "Id": "MyQueuePolicy",
      "Statement": [{
         "Sid":"MySQSPolicy001",
         "Effect":"Allow",
         "Principal":"*",
         "Action":"sqs:SendMessage",
         "Resource":"${queueArn}",
         "Condition":{
           "ArnEquals":{
             "aws:SourceArn":"${snsTopicArn}"
           }
         }
      }]
}`;
    const params = {
      QueueUrl: queueUrl,
      Attributes: { Policy }
    };

    const data = await sqs.setQueueAttributes(params).promise();
    console.log({ data });
  }

  async getAttributes(queueUrl) {
    const params = {
      QueueUrl: queueUrl,
      AttributeNames: ['All']
    };

    const { Attributes } = (await sqs.getQueueAttributes(params).promise()) || {};
    return Attributes;
  }
}

module.exports = SqsWrapper;
