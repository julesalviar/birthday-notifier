import { Entity } from 'dynamodb-toolbox';
import {UsersTable} from "./user.table";

export const UserEntity = new Entity({
  name: 'User',
  attributes: {
    userId: { partitionKey: true, type: 'string' },
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    birthday: {
      type: 'string',
      required: true,
      // validate: (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)
    },
    timezone: { type: 'string', required: true },
    createdAt: { type: 'string', required: true },
  },
  table: UsersTable,
} as const);

export type UserItem = typeof UserEntity extends Entity<infer T> ? T : never;