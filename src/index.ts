import express from 'express';
import { config } from './config/config';
import {createRouter} from './routes/routes';
import {setupInfra} from "./scripts/setup";
import {UserService} from "./services/user.service";
import {MessageWorker} from "./workers/message.worker";
import {BirthdayPoller} from "./workers/birthday.poller";

async function main() {
  try {
    console.log('Starting server...');

    const queueUrl = await setupInfra();

    const userService = new UserService();
    userService.setQueueUrl(queueUrl);

    const app = express();
    app.use(express.json());

    const router = createRouter(userService);
    app.use('/api', router);

    const server = app.listen(config.server.port, () => {
      console.log(`Birthday Notifier server running on port ${config.server.port}`);
      console.log(`POST endpoint available at http://localhost:${config.server.port}/api/user`);
    });

    const messageWorker = new MessageWorker(queueUrl);
    messageWorker.start().catch(e => console.error('Error starting message worker:', e));

    const birthdaysPoller = new BirthdayPoller(queueUrl);
    birthdaysPoller.start().catch(e => console.error('Error starting birthday poller:', e));

    process.on('SIGTERM', () => {
      console.log('SIGTERM received,Stopping server...');
      messageWorker.stop();
      birthdaysPoller.stop();
      server.close(() => {
        console.log('Server stopped.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received,Stopping server...');
      messageWorker.stop();
      birthdaysPoller.stop();
      server.close(() => {
        console.log('Server stopped.');
      })
    })
  } catch (e) {
    console.error('Error starting server:', e);
    process.exit(1);
  }
}

main();