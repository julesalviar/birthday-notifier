import {Table} from "dynamodb-toolbox";
import {config} from "../config";
import {docClient} from "../services/aws-clients";

export const UsersTable = new Table({
  name: config.dynamodb.userTableName,
  partitionKey: 'userId',
  DocumentClient: docClient as any,
});