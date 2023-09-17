import { Request, Response, NextFunction } from 'express'; // Suponiendo que estás utilizando Express.js
import container from '../services/inversify.config';
import { AuthService } from '../services/AuthService';
import Types from '../services/types/types';

let _AuthService = container.get<AuthService>(Types.AuthService);

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Not Authorized' });
  }

  const decodedToken = await _AuthService.verifyToken(token);

  if (!decodedToken) {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  next();
}
