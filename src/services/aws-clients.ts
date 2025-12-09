import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {config} from "../config";

const dynamoClient = new DynamoDBClient({
  region: config.aws.region,
  endpoint: config.aws.endpoint,
  credentials: config.aws.credentials
});

export const docClient = DynamoDBDocumentClient.from(dynamoClient);