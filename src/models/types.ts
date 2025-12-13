export interface User {
  firstName: string;
  lastName: string;
  birthDate: string;
  timezone: string;
}

export interface UserEntity extends User {
  userId: string;
  createdAt: string;
}

export interface MessageLog {
  messageId: string;
  userId: string;
  scheduledFor: string; // ISO 8601
  sentAt?: string; // ISO 8601
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  lastAttemptAt?: string;
  errorMessage?: string;
}

export interface BirthdayMessage {
  userId: string;
  fullName: string;
  scheduledFor: string;
  messageId: string;
}