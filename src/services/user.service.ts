import {randomUUID} from "node:crypto";
import {User, UserEntity} from "../types/user.type";
import {UserRepository} from "../repositories/user.repository";

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
}