import {BillingMode, CreateTableCommand, DescribeTableCommand, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {config} from "../config";

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

export async function setupInfra() {
  await createUsersTable();
}

if (require.main === module) {
  setupInfra()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
  })
}