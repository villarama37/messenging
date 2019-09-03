# Miscroservices Messaging using AWS SNS and SQS

# Links

- [AWS Messenging Video](https://www.youtube.com/watch?v=UesxWuZMZqI&feature=youtu.be)
- [SNS vs SQS](https://www.linkedin.com/pulse/difference-between-amazon-aws-snssimple-notification-sqs-khan-/)
- https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sns-examples-publishing-messages.html
- [Distributted Trigger Pattern](https://www.jeremydaly.com/how-to-use-sns-and-sqs-to-distribute-and-throttle-events/)

## Example Overview Service to Service messaging

- Password Change Service
- Password History Service
- Password Email Changed Service

## Diagram

```mermaid
graph TD
 CS[Password Change Service]
 T1[SQS History Queue]
 T2[SQS Password Queue]

 H[Password History Service]
 E[Password Email Changed Service]

 User -- Change Password --> CS
 CS -- Password Changed Successful --> SNS
 SNS -- Add to History Queue --> T1
 SNS -- Add to Email Queue --> T2

 T1 -- Poll for Messages --> H
 T2 -- Poll for Messages --> E
```

# Sample Code
