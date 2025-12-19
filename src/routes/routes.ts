import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';

export function createRouter(userService: UserService): Router {
  const router = Router();

  router.post('/user', async (req: Request, res: Response): Promise<void> => {
    console.log('POST /user');
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({
        message: 'User created successfully',
        user
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        message: 'Error creating user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  router.delete('/user/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      await userService.deleteUser(userId);

      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  });

  return router;
}

