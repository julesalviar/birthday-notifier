import { Request, Response } from 'express';

export class UserController {
  public createUser = (req: Request, res: Response): void => {
    console.log('POST /user');
    
    res.status(200).json({ 
      message: 'User request processed',
      received: req.body 
    });
  };

  public deleteUser = (req: Request, res: Response): void => {
    console.log('DELETE /user');
    res.status(200).json({ message: 'User deleted' });
  };
}

