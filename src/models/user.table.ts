import {Table} from "dynamodb-toolbox";
import {config} from "../config/config";
import {docClient} from "../config/aws-clients";

export const UsersTable = new Table({
  name: config.dynamodb.userTableName,
  partitionKey: 'userId',
  DocumentClient: docClient as any,
});