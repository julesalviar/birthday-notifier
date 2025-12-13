import express, { Application } from 'express';
import { config } from './config/config';
import userRoutes from './routes/user.routes';

const app: Application = express();

app.use(express.json());
app.use('/', userRoutes);

const startServer = (): void => {
  app.listen(config.server.port, () => {
    console.log(`Birthday Notifier server running on port ${config.server.port}`);
    console.log(`POST endpoint available at http://localhost:${config.server.port}/user`);
  });
};

startServer();

export default app;

