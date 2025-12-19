import {UserService} from "../services/user.service";
import {BirthdaySchedulerService} from "../services/birthday-scheduler.service";

export class BirthdayPoller {
  private userService: UserService;
  private scheduleService: BirthdaySchedulerService;
  private isRunning = false;
  private pollInterval = 1000 * 60; // 1 minute

  constructor(queueUrl: string) {
    this.userService = new UserService();
    this.userService.setQueueUrl(queueUrl);
    this.scheduleService = new BirthdaySchedulerService();
    this.scheduleService.setQueueUrl(queueUrl);
  }

  async start(): Promise<void> {
    this.isRunning = true;
    console.log('Birthday poller started');

    await this.poll();

    while (this.isRunning) {
      await new Promise(resolve => setTimeout(resolve, this.pollInterval));

      if (this.isRunning) {
        await this.poll();
      }
    }
  }

  stop(): void {
    this.isRunning = false;
    console.log('Birthday poller stopped');
  }

  private async poll(): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();

      await this.scheduleService.pollAndQueueUpcomingBirthdays(users);
      await this.scheduleService.processMissedMessages(users);

      console.log('Birthday poller finished');
    } catch (e) {
      console.error('Error polling for birthdays:', e);
    }
  }
}