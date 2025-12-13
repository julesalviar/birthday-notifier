import {Entity} from "dynamodb-toolbox";
import {MessageLogTable} from "./message-log.table";

export const MessageLogEntity = new Entity({
  name: 'MessageLog',
  attributes: {
    messageId: { partitionKey: true, type: 'string' },
    userId: { type: 'string', required: true },
    scheduleFor: { type: 'string', required: true }, // ISO 8601
    sentAt: { type: 'string', }, // ISO 8601
    status: { type: 'string', required: true }, // 'pending' | 'sent' | 'failed'
    attempts: { type: 'number', required: true, default: 0 },
    lastAttemptAt: { type: 'string', },
    errorMessage: { type: 'string', }
  },
  table: MessageLogTable,
});

export type MessageLogItem = typeof MessageLogEntity extends Entity<infer T> ? T : never;