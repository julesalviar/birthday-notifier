import {BaseRepository} from "./base.repository";
import {UserEntity as UserType} from "../types/user.type";
import {UserEntity} from "../entities/user.entity";

export class UserRepository extends BaseRepository<UserType>{
  constructor() {
    super(UserEntity, 'User');
  }

  protected getPartitionKey(): string {
    return 'userId';
  }

  async create(user: UserType): Promise<UserType> {
    return super.create(user);
  }

  async delete(userId: string): Promise<boolean> {
    return super.delete(userId);
  }
}