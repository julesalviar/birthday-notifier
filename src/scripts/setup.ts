import {BillingMode, CreateTableCommand, DescribeTableCommand, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {config} from "../config/config";
import {sqsClient} from "../config/aws-clients";
import {CreateQueueCommand, GetQueueAttributesCommand, GetQueueUrlCommand} from "@aws-sdk/client-sqs";

const dynamoClient = new DynamoDBClient({
  region: config.aws.region,
  endpoint: config.aws.endpoint,
  credentials: config.aws.credentials,
});

async function createUsersTable() {
  try {
    await dynamoClient.send(new DescribeTableCommand({
      TableName: config.dynamodb.userTableName
    }));

    console.log(`Table ${config.dynamodb.userTableName} already exists`);
  } catch (error) {
    console.log(`Creating table ${config.dynamodb.userTableName}...`);
    await dynamoClient.send(new CreateTableCommand({
      TableName: config.dynamodb.userTableName,
      KeySchema: [
        {AttributeName: 'userId', KeyType: 'HASH'}
      ],
      AttributeDefinitions: [
        {AttributeName: 'userId', AttributeType: 'S'}
      ],
      BillingMode: BillingMode.PAY_PER_REQUEST
    }));
    console.log(`Table ${config.dynamodb.userTableName} created`);
  }
}

async function createMessageLogTable() {
  try {
    await dynamoClient.send(new DescribeTableCommand({
      TableName: config.dynamodb.messageLogTableName
    }));

    console.log(`Table ${config.dynamodb.messageLogTableName} already exists`);
  } catch (e) {
    console.log(`Creating table ${config.dynamodb.messageLogTableName}...`);

    await dynamoClient.send(new CreateTableCommand({
      TableName: config.dynamodb.messageLogTableName,
      KeySchema: [
        { AttributeName: 'messageId', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'messageId', AttributeType: 'S' },
        { AttributeName: 'status', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'StatusIndex',
          KeySchema: [
            { AttributeName: 'status', KeyType: 'HASH' }
          ],
          Projection: { ProjectionType: 'ALL' }
        }
      ],
      BillingMode: BillingMode.PAY_PER_REQUEST
    }));
    console.log(`Table ${config.dynamodb.messageLogTableName} created`);
  }
}

async function createQueues() {
  try {
    // Create DLQ first
    let dlqUrl: string;
    let dlqArn: string;

    try {
      const dlqResponse = await sqsClient.send(new GetQueueUrlCommand({
        QueueName: config.sqs.dlqName
      }));
      dlqUrl = dlqResponse.QueueUrl!;
      console.log(`DLQ ${config.sqs.dlqName} already exists`);

      const dlqAttributes = await sqsClient.send(new GetQueueAttributesCommand({
        QueueUrl: dlqUrl,
        AttributeNames: ['QueueArn']
      }));
      dlqArn = dlqAttributes.Attributes?.QueueArn || `arn:aws:sqs:${config.aws.region}:000000000000:${config.sqs.dlqName}`;
    } catch (e) {
      console.log(`Creating DLQ ${config.sqs.dlqName}...`);
      const dlqResponse = await sqsClient.send(new CreateQueueCommand({
        QueueName: config.sqs.dlqName
      }));
      dlqUrl = dlqResponse.QueueUrl!;

      // Localstack, construct the ARN manually
      dlqArn = `arn:aws:sqs:${config.aws.region}:000000000000:${config.sqs.dlqName}`;

      console.log(`DLQ ${config.sqs.dlqName} created`);
    }

    try {
      const queueResponse = await sqsClient.send(new GetQueueUrlCommand({
        QueueName: config.sqs.queueName
      }));
      console.log(`Queue ${config.sqs.queueName} already exists`);
      return queueResponse.QueueUrl!;
    } catch (e) {
      console.log(`Creating queue ${config.sqs.queueName}`);
      const queueResponse = await sqsClient.send(new CreateQueueCommand({
        QueueName: config.sqs.queueName,
        Attributes: {
          VisibilityTimeout: '60',
          MessageRetentionPeriod: '86400', // 1 day
          RedrivePolicy: JSON.stringify({
            deadLetterTargetArn: dlqArn,
            maxReceiveCount: '3'
          })
        }
      }));
      console.log(`Queue ${config.sqs.queueName} create with DLQ redrive policy`);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function setupInfra(): Promise<string> {
  console.log('Setting up infrastructure...');

  await createUsersTable();
  await createMessageLogTable();
  const queueUrl = await createQueues();

  console.log('Infrastructure setup complete.');
  console.log(`SQS queue URL: ${queueUrl}`);
  return queueUrl!;
}

if (require.main === module) {
  setupInfra()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
  })
}