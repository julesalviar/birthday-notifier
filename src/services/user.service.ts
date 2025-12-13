import {randomUUID} from "node:crypto";
import {UserRepository} from "../repositories/user.repository";
import {User, UserEntity} from "../models/types";

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async createUser(user: User): Promise<UserEntity> {
    const userId = randomUUID();

    const userEntity: UserEntity = {
      ...user,
      userId,
      createdAt: new Date().toISOString(),
    };

    return await this.userRepo.create(userEntity);
  }

  async deleteUser(userId: string): Promise<boolean> {
    return await this.userRepo.delete(userId);
  }
}