import {Table} from "dynamodb-toolbox";
import {config} from "../config/config";
import {docClient} from "../config/aws-clients";

export const MessageLogTable = new Table({
  name: config.dynamodb.messageLogTableName,
  partitionKey: 'messageId',
  DocumentClient: docClient as any,
})