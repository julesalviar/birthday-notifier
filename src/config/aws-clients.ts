import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {config} from "./config";
import { SQSClient } from '@aws-sdk/client-sqs';
import { SchedulerClient } from '@aws-sdk/client-scheduler';

const dynamoClient = new DynamoDBClient({
  region: config.aws.region,
  endpoint: config.aws.endpoint,
  credentials: config.aws.credentials
});

export const docClient = DynamoDBDocumentClient.from(dynamoClient);

export const sqsClient = new SQSClient({
  region: config.aws.region,
  endpoint: config.aws.endpoint,
  credentials: config.aws.credentials
});

export const scheduleClient = new SchedulerClient({
  region: config.aws.region,
  endpoint: config.aws.endpoint,
  credentials: config.aws.credentials,
});
