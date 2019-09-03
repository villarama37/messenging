const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });

const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
const PROTOCOL = { SQS: 'sqs' };

class SnsWrapper {
  async createTopic(Name) {
    console.log(`Creating Topic: ${Name}`);
    const { TopicArn } = await sns.createTopic({ Name }).promise();
    return TopicArn;
  }

  async deleteTopic(TopicArn) {
    console.log(`Deleting Topic: ${TopicArn}`);
    await sns.deleteTopic({ TopicArn }).promise();
  }

  async listTopics() {
    console.log('Listing Topics');
    const { Topics } = await sns.listTopics({}).promise();
    console.log({ Topics });
  }

  async getTopicAttributes(TopicArn) {
    console.log('Get Attributes');
    const data = await sns.getTopicAttributes({ TopicArn }).promise();
    console.log({ data });
  }

  async setTopicAttributes(TopicArn, key, value) {
    console.log('Set Attributes');
    const data = await sns.setTopicAttributes({ TopicArn, AttributeName: key, AttributeValue: value }).promise();
    console.log({ data });
  }

  /**
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#subscribe-property
   */
  async subscribeSqs(TopicArn, queueUrl) {
    console.log(`Subscribing ${queueUrl}`);
    const params = {
      TopicArn,
      Protocol: PROTOCOL.SQS,
      Endpoint: queueUrl
    };

    const data = await sns.subscribe(params).promise();
    //console.log({ data });
  }

  async sendMessage(TopicArn, Message) {
    console.log(`Publishing to ${TopicArn}: ${Message}`);
    const params = {
      TopicArn,
      Message
    };
    const data = await sns.publish(params).promise();
    //console.log({ data });
  }

  async listSubscriptions(TopicArn) {
    console.log('Listing Subscriptions');
    const { Subscriptions } = await sns.listSubscriptionsByTopic({ TopicArn }).promise();
    console.log(Subscriptions);
  }
}

module.exports = SnsWrapper;
