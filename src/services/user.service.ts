import {randomUUID} from "node:crypto";
import {UserRepository} from "../repositories/user.repository";
import {User, UserEntity} from "../models/types";
import {BirthdaySchedulerService} from "./birthday-scheduler.service";

export class UserService {
  private userRepo: UserRepository;
  private schedulerService: BirthdaySchedulerService;

  constructor() {
    this.userRepo = new UserRepository();
    this.schedulerService = new BirthdaySchedulerService();
  }

  setQueueUrl(url: string) {
    this.schedulerService.setQueueUrl(url);
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

  async getUser(userId: string): Promise<UserEntity | null> {
    return await this.userRepo.findById(userId);
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepo.scanAll();
  }
}