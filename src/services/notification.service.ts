import {MessageLogRepository} from "../repositories/message-log.repository";
import {BirthdayMessage, MessageLog} from "../models/types";
import axios from "axios";
import {config} from "../config/config";

export class NotificationService {
  private messageLogRepo: MessageLogRepository;

  constructor() {
    this.messageLogRepo = new MessageLogRepository();
  }

  async sendBirthdayNotification(message: BirthdayMessage): Promise<void> {
    try {
      const payload = {
        message: `Hey, ${message.fullName}! It's your birthday!`,
        userId: message.userId,
        scheduledFor: message.scheduledFor,
        sentAt: new Date().toISOString(),
      }

      await axios.post(config.notification.hookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          timeout: 10000,
        }
      });


    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}