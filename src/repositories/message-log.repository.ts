import {BaseRepository} from "./base.repository";
import {MessageLog} from "../models/types";
import {MessageLogEntity} from "../models/message-log.entity";

export class MessageLogRepository extends BaseRepository<MessageLog>{
  constructor() {
    super(MessageLogEntity, 'MessageLog');
  }

  protected getPartitionKey(): string {
    return "messageId";
  }

  async create(messageLog: MessageLog): Promise<MessageLog> {
    return super.create(messageLog);
  }

  async findByIdOrFail(messageId: string): Promise<MessageLog> {
    return super.findByIdOrFail(messageId);
  }

  async updateStatus(
    messageId: string,
    status: MessageLog['status'],
    sentAt?: string,
    errorMessage?: string
  ): Promise<void> {
    const existing = await this.findByIdOrFail(messageId);

    const updateData: Partial<MessageLog> = {
      messageId,
      status,
      attempts: existing.attempts + 1,
      lastAttemptAt: new Date().toISOString(),
    }

    if (sentAt) {
      updateData.sentAt = sentAt;
    }

    if (errorMessage) {
      updateData.errorMessage = errorMessage;
    }

    await this.update(updateData);
  }

}