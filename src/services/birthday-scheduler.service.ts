import moment from 'moment-timezone';
import {MessageLogRepository} from "../repositories/message-log.repository";
import {config} from "../config/config";
import {BirthdayMessage, UserEntity} from "../models/types";
import {randomUUID} from "node:crypto";
import {sqsClient} from "../config/aws-clients";
import {SendMessageCommand} from "@aws-sdk/client-sqs";

export class BirthdaySchedulerService {
  private messageLogRepo: MessageLogRepository;
  private queueUrl: string = '';

  constructor(url: string) {
    this.messageLogRepo = new MessageLogRepository();
  }

  setQueueUrl(url: string) {
    this.queueUrl = url;
  }

  calculateNextBirthdayTimestamp(birthday: string, timezone: string): number {
    const [year, month, day] = birthday.split('-').map(Number);
    const now = moment().tz(timezone);

    let nextBirthday = moment.tz(
      { year: now.year(), month: month - 1, day, hour: config.notification.timeToSend, minute: 0, second: 0},
      timezone
    );

    if (nextBirthday.isBefore(now)) {
      nextBirthday = nextBirthday.add(1, 'year');
    }

    return nextBirthday.valueOf();
  }

  async scheduleBirthdayMessage(user: UserEntity): Promise<void> {
    const messageId = randomUUID();
    const nextBirthdayTimestamp = this.calculateNextBirthdayTimestamp(user.birthDate, user.timezone);
    const nextBirthdayDate = moment.tz(nextBirthdayTimestamp, user.timezone);
    const now = moment();
    const delaySeconds = Math.floor(nextBirthdayDate.diff(now, 'seconds'));

    const message: BirthdayMessage = {
      userId: user.userId,
      fullName: `${user.firstName} ${user.lastName}`,
      scheduledFor: nextBirthdayDate.toISOString(),
      messageId,
    }

    await this.messageLogRepo.create({
      messageId,
      userId: user.userId,
      scheduledFor: nextBirthdayDate.toISOString(),
      status: 'pending',
      attempts: 0,
    });

    if (delaySeconds > 0 && delaySeconds <= 900) {
      await sqsClient.send((new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(message),
        DelaySeconds: delaySeconds
      })))
    }
  }

  async pollAndQueueUpcomingBirthdays(users: UserEntity[]): Promise<void> {
    const now = moment();
    const fifteenMinutesFromNow = now.add(15, 'minutes').valueOf();

    for (const user of users) {
      const nextBirthdayTimestamp = this.calculateNextBirthdayTimestamp(user.birthDate, user.timezone);

      if (nextBirthdayTimestamp > now.valueOf() && nextBirthdayTimestamp <= fifteenMinutesFromNow) {
        const delaySeconds = Math.floor((nextBirthdayTimestamp - now.valueOf()) / 1000);

        const message: BirthdayMessage = {
          userId: user.userId,
          fullName: `${user.firstName} ${user.lastName}`,
          scheduledFor: moment(nextBirthdayTimestamp).toISOString(),
          messageId: randomUUID(),
        }

        await sqsClient.send(new SendMessageCommand({
          QueueUrl: this.queueUrl,
          MessageBody: JSON.stringify(message),
          DelaySeconds: Math.max(0, delaySeconds),
        }))
      }
    }
  }

  async processMissedMessages(users: UserEntity[]): Promise<void> {
    const now = moment().valueOf();
    const twentyFourHoursAgo = moment().subtract(24, 'hours').valueOf();

    const missedBirthdays = users.filter(user => {
      const nextBirthdayTimestamp = this.calculateNextBirthdayTimestamp(user.birthDate, user.timezone);
      return nextBirthdayTimestamp <= now && nextBirthdayTimestamp >= twentyFourHoursAgo;
    });

    for (const user of missedBirthdays) {
      const nextBirthdayTimestamp = this.calculateNextBirthdayTimestamp(user.birthDate, user.timezone);

      const message: BirthdayMessage = {}
    }
  }
}