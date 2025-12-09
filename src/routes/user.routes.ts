import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';

const router: Router = Router();
const userService = new UserService();

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

router.delete('/user', (req: Request, res: Response): void => {
  console.log('DELETE /user');
  res.status(200).json({ message: 'User deleted' });
});

export default router;

