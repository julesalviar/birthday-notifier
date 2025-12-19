export const config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10)
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.AWS_ENDPOINT || 'http://127.0.0.1:4566',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
    }
  },
  dynamodb: {
    userTableName: process.env.DYNAMODB_USER_TABLE_NAME || 'Users',
    messageLogTableName: process.env.DYNAMODB_MESSAGE_LOG_TABLE_NAME || 'MessageLogs'
  },
  notification: {
    hookUrl: process.env.NOTIFICATION_HOOK_URL || '',
    timeToSend: 9,
  },
  sqs: {
    queueName: process.env.SQS_QUEUE_NAME || 'birthday-notification-queue',
    dlqName: process.env.SQS_DLQ_NAME || 'birthday-notification-dlq',
  },
};

