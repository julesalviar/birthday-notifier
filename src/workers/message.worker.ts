import {NotificationService} from "../services/notification.service";
import {DeleteMessageCommand, Message, ReceiveMessageCommand} from "@aws-sdk/client-sqs";
import {sqsClient} from "../config/aws-clients";
import {BirthdayMessage} from "../models/types";

export class MessageWorker {
  private notificationService: NotificationService;
  private queueUrl: string = '';
  private isRunning = false;
  private pollInterval = 1000 * 60 * 5; // 5 minutes

  constructor(queueUrl: string) {
    this.queueUrl = queueUrl;
    this.notificationService = new NotificationService();
  }

  async start(): Promise<void> {
    this.isRunning = true;
    console.log('Message worker started');

    while (this.isRunning) {
      try {
        await this.pollMessages();
      } catch (e) {
        console.error('Error polling messages:', e);
      }
    }

    await new Promise(resolve => setTimeout(resolve, this.pollInterval));
  }

  stop(): void {
    this.isRunning = false;
    console.log('Message worker stopped');
  }

  private async pollMessages(): Promise<void> {
    const command = new ReceiveMessageCommand({
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
      VisibilityTimeout: 60,
    });

    const response = await sqsClient.send(command);

    if (response.Messages) {
      console.log(`Received ${response.Messages.length} messages`);

      await Promise.all(
        response.Messages.map(message => this.processMessage(message))
      );
    }
  }

  private async processMessage(message: Message): Promise<void> {
    if(!message.Body || !message.ReceiptHandle) {
      return;
    }

    try {
      const birthdayMessage: BirthdayMessage = JSON.parse(message.Body);

      await this.notificationService.sendBirthdayNotification(birthdayMessage);

      await sqsClient.send(new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: message.ReceiptHandle
      }));

      console.log(`Message processed and deleted: ${birthdayMessage.messageId}`);
    } catch (e) {
      console.error('Failed to process message:', e);
    }
  }
}