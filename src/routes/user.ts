import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router: Router = Router();
const userController = new UserController();

router.post('/user', userController.createUser);
router.delete('/user', userController.deleteUser);

export default router;

